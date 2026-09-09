export const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/$/, "");
export const adminRoot = "/api/v1/admin";

export class ApiError extends Error {
  constructor(message: string, public status: number, public retryAfter = 30) {
    super(message);
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiOrigin) throw new ApiError("The admin API is not configured. Set NEXT_PUBLIC_API_URL and restart the dashboard.", 0);
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  let response: Response;
  try {
    // Next rewrites forward to the backend while keeping session cookies first-party.
    response = await fetch(path, { ...init, headers, credentials: "include", cache: "no-store" });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new ApiError("Cannot reach the API. Check your connection and the backend's allowed origins.", 0);
  }
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok || body?.success === false) {
    const fields = Array.isArray(body?.errors)
      ? body.errors.map((item: { field: string; message: string }) => `${item.field}: ${item.message}`).join("; ")
      : "";
    const retry = response.headers.get("Retry-After");
    const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : retry ? (Date.parse(retry) - Date.now()) / 1000 : 30;
    throw new ApiError(fields || body?.message || `Request failed (${response.status}).`, response.status, Number.isFinite(seconds) ? Math.max(1, seconds) : 30);
  }
  if (response.status !== 204 && body === null && path !== "/api/auth/get-session") {
    throw new ApiError("The API returned an unexpected response.", response.status);
  }
  return body as T;
}

export function roles(role?: string) {
  return (role ?? "").split(",").map((value) => value.trim());
}

export type Session = { user: { id: string; name: string; email: string; role?: string } } | null;
export type VerificationStatus = "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
export type UserRow = {
  _id: string; authUserId: string; fullName: string; email: string;
  verificationStatus: VerificationStatus; createdAt: string;
  isBlocked: boolean; isDeleted: boolean; ridePermanentlyBanned: boolean; rideSuspendedUntil?: string;
  stats: { totalRides: number; completedRides: number; cancelledRides: number; averageRating: number; completionRate: number };
};
export type VerificationUser = Pick<UserRow, "_id" | "authUserId" | "fullName" | "email" | "verificationStatus" | "createdAt"> & {
  university?: string;
  verificationDocument: { uploaded: boolean; frontUrl: string | null; backUrl: string | null };
  verificationHistory: {
    _id: string; documentType: string; verificationMethod: string; status: VerificationStatus;
    submittedAt: string; detectedName?: string; confidenceScore?: number;
    audit: { action: string; reason?: string; createdAt: string }[];
  }[];
};
export type UserDetail = {
  user: UserRow & VerificationUser & { userMode: string; onboardingCompleted: boolean };
  account: { id: string; role?: string; banned?: boolean; banReason?: string; banExpires?: string; emailVerified: boolean } | null;
};
export type Ride = {
  _id: string; status: string; pickup: { displayName: string }; destination: { displayName: string };
  agreedPrice: number; createdAt: string;
};
export type Report = {
  _id: string; reporterId: string; reportedUserId: string; riderMatchId: string;
  reason: string; description?: string; agreedPrice: number;
  status: "SUBMITTED" | "VALIDATED" | "REJECTED" | "RESOLVED";
  evidenceSnapshotId?: string; evidenceDeletedAt?: string; resolutionNote?: string; createdAt: string;
};
export type Evidence = {
  _id: string; capturedAt: string;
  messages: { originalMessageId: string; senderId: string; type: "TEXT" | "IMAGE"; text?: string; imageUrl?: string; sentAt: string }[];
};
export type Audit = {
  _id: string; action: string; actorAuthUserId: string; actorRole: string;
  targetAuthUserId?: string; reason: string; outcome: string; failureMessage?: string; createdAt: string;
  details?: { configKey?: string; reportId?: string; changes?: Record<string, unknown>; status?: string; resolutionNote?: string };
};

// Explicit fields keep this strict PATCH endpoint free of read-only or unknown keys.
export const configFields = [
  ["searchTimeoutSeconds", "Search timeout (seconds)", 1, "integer"],
  ["requestExpirySeconds", "Request expiry (seconds)", 1, "integer"],
  ["timeToleranceMinutes", "Time tolerance (minutes)", 0, "positive"],
  ["destinationToleranceMeters", "Destination tolerance (meters)", 1, "integer"],
  ["initialSearchRadiusMeters", "Initial search radius (meters)", 1, "radius"],
  ["maxSearchRadiusMeters", "Maximum search radius (meters)", 1, "radius"],
  ["searchExpansionMeters", "Search expansion (meters)", 1, "radius"],
  ["currentPetrolPrice", "Current petrol price (PKR)", 0, "decimal"],
  ["baselinePetrolPrice", "Baseline petrol price (PKR)", 0, "positive"],
  ["baseRatePerKm", "Base rate per km (PKR)", 0, "decimal"],
  ["minimumRecommendedPrice", "Minimum recommended price (PKR)", 0, "decimal"],
  ["rateMultiplier", "Open discovery rate multiplier", 0, "positive"],
  ["minimumDetourPrice", "Minimum detour price (PKR)", 0, "decimal"],
  ["cancellationRatingPenalty", "Cancellation rating penalty (0–5)", 0, "penalty"],
  ["warningAfterCancellationCount", "Cancellations before warning", 1, "integer"],
  ["suspendAfterCancellationCount", "Cancellations before suspension", 1, "integer"],
  ["suspensionDuration", "Suspension duration (minutes)", 1, "integer"],
  ["banAfterCancellationCount", "Cancellations before ban", 1, "integer"],
  ["completionGracePeriodMinutes", "Completion grace period (minutes)", 0, "integer"],
] as const;
type ConfigKey = Exclude<(typeof configFields)[number][0], "rateMultiplier">;
export type AdminConfig = Record<ConfigKey, number> & { openDiscoveryPricing: { rateMultiplier: number } };

export function configPatch(form: FormData, current: AdminConfig): Partial<AdminConfig> {
  const patch: Partial<AdminConfig> = {};
  for (const [key, label, min, kind] of configFields) {
    const raw = form.get(key);
    const value = Number(raw);
    if (typeof raw !== "string" || !raw.trim() || !Number.isFinite(value) || value < min ||
      (kind === "positive" && value <= 0) ||
      ((kind === "integer" || kind === "radius") && !Number.isSafeInteger(value)) ||
      (kind === "radius" && value > 3000) || (kind === "penalty" && value > 5)) {
      throw new Error(`Enter a valid value for ${label.toLowerCase()}.`);
    }
    if (key === "rateMultiplier") {
      if (value !== current.openDiscoveryPricing.rateMultiplier) patch.openDiscoveryPricing = { rateMultiplier: value };
    } else if (value !== current[key]) patch[key] = value;
  }
  const next = { ...current, ...patch };
  if (next.maxSearchRadiusMeters < next.initialSearchRadiusMeters) throw new Error("Maximum search radius must be at least the initial radius.");
  if (!(next.warningAfterCancellationCount < next.suspendAfterCancellationCount && next.suspendAfterCancellationCount < next.banAfterCancellationCount)) {
    throw new Error("Cancellation thresholds must increase: warning < suspension < ban.");
  }
  if (!Object.keys(patch).length) throw new Error("Change at least one value before saving.");
  return patch;
}

export function safeDocumentUrl(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch { return null; }
}

import { expect, test, type Page } from "@playwright/test";
import { createServer } from "node:http";
import { configFields, configPatch, safeDocumentUrl, type AdminConfig } from "../lib/admin-api";

const authId = "auth/student?1";
const encodedId = encodeURIComponent(authId);
const user = {
  _id: "507f1f77bcf86cd799439011", authUserId: authId, fullName: "Ayesha Khan", email: "ayesha@example.com",
  verificationStatus: "UNDER_REVIEW", createdAt: "2026-09-01T10:00:00Z", isBlocked: false, isDeleted: false,
  ridePermanentlyBanned: false, stats: { totalRides: 8, completedRides: 7, cancelledRides: 1, averageRating: 4.8, completionRate: 87.5 },
  verificationDocument: { uploaded: true, url: "https://documents.example.com/student-id" }, verificationHistory: [],
  userMode: "RIDER", onboardingCompleted: true,
};
const initialConfig: AdminConfig = {
  searchTimeoutSeconds: 60, requestExpirySeconds: 30, timeToleranceMinutes: 5, destinationToleranceMeters: 200,
  initialSearchRadiusMeters: 500, maxSearchRadiusMeters: 2000, searchExpansionMeters: 250,
  currentPetrolPrice: 280, baselinePetrolPrice: 260, baseRatePerKm: 12, minimumRecommendedPrice: 80,
  openDiscoveryPricing: { rateMultiplier: 1.2 }, minimumDetourPrice: 20, cancellationRatingPenalty: 0.5,
  warningAfterCancellationCount: 2, suspendAfterCancellationCount: 4, banAfterCancellationCount: 6,
  suspensionDuration: 60, completionGracePeriodMinutes: 10,
};

async function mockBackend(page: Page, role: string | null = "admin", targetRole = "user") {
  let sessionRole = role;
  let currentUser = structuredClone(user);
  let config = structuredClone(initialConfig);
  let report = {
    _id: "507f1f77bcf86cd799439012", reporterId: "reporter-id", reportedUserId: user._id, riderMatchId: "ride-id",
    reason: "SAFETY_CONCERN", description: "Unsafe driving reported.", agreedPrice: 150, status: "SUBMITTED",
    evidenceSnapshotId: "evidence-id", evidenceDeletedAt: "", createdAt: "2026-09-02T10:00:00Z",
  };
  const calls: { path: string; method: string; body: Record<string, unknown> | null }[] = [];
  let failure: { status: number; path: string; body?: object; retryAfter?: string } | undefined;
  await page.route("http://127.0.0.1:3101/api/**", async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    const method = req.method();
    const headers = { "Access-Control-Allow-Origin": "http://127.0.0.1:3101", "Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS", "Access-Control-Expose-Headers": "Retry-After" };
    if (method === "OPTIONS") { await route.fulfill({ status: 204, headers }); return; }
    const body = req.postDataJSON();
    calls.push({ path, method, body });
    if (failure?.path === path) {
      const value = failure;
      failure = undefined;
      if (value.status === 401) sessionRole = null;
      await route.fulfill({ status: value.status, headers: { ...headers, "Retry-After": value.retryAfter ?? "30" }, json: value.body ?? { success: false, message: "Test server failure" } });
      return;
    }
    const json = async (data: unknown, status = 200) => route.fulfill({ status, headers, json: data });
    const success = async (data: unknown, status = 200) => json({ success: true, data }, status);
    if (path === "/api/auth/get-session") return json(sessionRole ? { user: { id: "staff-id", name: "Staff Member", email: "staff@example.com", role: sessionRole } } : null);
    if (path === "/api/auth/sign-in/email") { sessionRole = "admin"; return json({ user: { id: "staff-id" } }); }
    if (path === "/api/auth/sign-out") { sessionRole = null; return json({ success: true }); }
    if (!sessionRole) return json({ success: false, message: "Session expired" }, 401);
    if (path === "/api/v1/admin/users") return success({ users: [currentUser] });
    if (path === `/api/v1/admin/users/${encodedId}`) return success({ user: currentUser, account: { id: authId, role: targetRole, banned: false, emailVerified: true } });
    if (path === `/api/v1/admin/users/${encodedId}/rides`) return success({ rides: [] });
    if (path === `/api/v1/admin/users/${encodedId}/delete`) return success({ deletionJobId: "job-123", status: "PENDING" }, 202);
    if (path === `/api/v1/admin/users/${encodedId}/role`) { targetRole = body.role; return success({}); }
    if (path.startsWith(`/api/v1/admin/users/${encodedId}/`)) return success({});
    if (path === "/api/v1/admin/verifications") return success({ users: currentUser.verificationStatus === "UNDER_REVIEW" ? [currentUser] : [] });
    if (path === `/api/v1/admin/verifications/${encodedId}`) {
      currentUser = { ...currentUser, verificationStatus: body.status, verificationDocument: { uploaded: false, url: "" } };
      return success({ user: currentUser });
    }
    if (path === "/api/v1/admin/reports") return success({ reports: [report] });
    if (path === `/api/v1/admin/reports/${report._id}`) {
      if (method === "PATCH") report = { ...report, ...body };
      return success({ report });
    }
    if (path.endsWith("/evidence")) {
      if (method === "DELETE") { report = { ...report, evidenceDeletedAt: "2026-09-05T10:00:00Z" }; return success({ report }); }
      return success({ evidence: { _id: "evidence-id", capturedAt: "2026-09-02T10:00:00Z", messages: [{ originalMessageId: "msg-1", senderId: "sender-id", type: "TEXT", text: "Please slow down.", sentAt: "2026-09-02T09:59:00Z" }] } });
    }
    if (path === "/api/v1/admin/config") {
      if (method === "PATCH") config = { ...config, ...body };
      return success({ config });
    }
    if (path === "/api/v1/admin/audits") return success({ audits: [] });
    return json({ success: false, message: `Unexpected test endpoint: ${path}` }, 404);
  });
  return { calls, failNext: (value: NonNullable<typeof failure>) => { failure = value; } };
}

test("staff sign-in, navigation, and sign-out work without browser storage", async ({ page }) => {
  const backend = await mockBackend(page, null);
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
  await page.getByLabel("Email address").fill("staff@example.com");
  await page.getByLabel("Password", { exact: true }).fill("example-password-123");
  await page.getByRole("button", { name: "Sign in to dashboard" }).click();
  await expect(page.getByRole("heading", { name: "Users", exact: true })).toBeVisible();
  await expect(page.getByText("Ayesha Khan", { exact: true })).toBeVisible();
  expect(backend.calls.find((call) => call.path.endsWith("sign-in/email"))?.body).toEqual({ email: "staff@example.com", password: "example-password-123", rememberMe: false });
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
  await expect(page.getByText("Ayesha Khan", { exact: true })).toHaveCount(0);
});

test("a successful sign-in with no cookie session shows an error and preserves the email", async ({ page }) => {
  await mockBackend(page, null);
  await page.route("**/api/auth/sign-in/email", (route) => route.fulfill({ json: { user: { id: "staff-id" } } }));
  await page.goto("/admin");
  await page.getByLabel("Email address").fill("staff@example.com");
  await page.getByLabel("Password", { exact: true }).fill("example-password-123");
  await page.getByRole("button", { name: "Sign in to dashboard" }).click();
  await expect(page.locator(".admin").getByRole("alert")).toContainText("Sign-in succeeded, but no session was saved.");
  await expect(page.getByLabel("Email address")).toHaveValue("staff@example.com");
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
  await expect(page.getByRole("navigation", { name: "Admin navigation" })).toHaveCount(0);
});

test("the actual Next proxy preserves HttpOnly session cookies through login, reload, and logout", async ({ page, context }) => {
  const paths: string[] = [];
  const server = createServer((req, res) => {
    paths.push(req.url ?? "");
    res.setHeader("Content-Type", "application/json");
    const signedIn = req.headers.cookie?.includes("__Secure-better-auth.session_token=test-session");
    if (req.url === "/api/auth/sign-in/email") {
      res.setHeader("Set-Cookie", "__Secure-better-auth.session_token=test-session; Path=/; HttpOnly; Secure; SameSite=Lax");
      res.end(JSON.stringify({ user: { id: "staff-id" } }));
    } else if (req.url === "/api/auth/get-session") {
      res.end(JSON.stringify(signedIn ? { user: { id: "staff-id", name: "Proxy Staff", email: "staff@example.com", role: "admin" } } : null));
    } else if (req.url === "/api/auth/sign-out") {
      res.setHeader("Set-Cookie", "__Secure-better-auth.session_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
      res.end(JSON.stringify({ success: true }));
    } else if (req.url === "/api/v1/admin/users" && signedIn) {
      res.end(JSON.stringify({ success: true, data: { users: [] } }));
    } else { res.statusCode = 401; res.end(JSON.stringify({ success: false, message: "No session" })); }
  });
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(4318, "127.0.0.1", resolve); });
  try {
    await page.goto("/admin");
    await page.getByLabel("Email address").fill("staff@example.com");
    await page.getByLabel("Password", { exact: true }).fill("example-password-123");
    await page.getByRole("button", { name: "Sign in to dashboard" }).click();
    await expect(page.getByRole("heading", { name: "User directory" })).toBeVisible();
    expect((await context.cookies()).find((cookie) => cookie.name === "__Secure-better-auth.session_token")).toMatchObject({ httpOnly: true, secure: true, sameSite: "Lax", domain: "127.0.0.1" });
    expect(await page.evaluate(() => document.cookie)).not.toContain("test-session");
    await page.reload();
    await expect(page.getByRole("heading", { name: "User directory" })).toBeVisible();
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
    expect(paths).toContain("/api/v1/admin/users");
    expect((await context.cookies()).some((cookie) => cookie.name === "__Secure-better-auth.session_token")).toBe(false);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("non-staff cannot enter and moderators cannot manage staff", async ({ page }) => {
  const backend = await mockBackend(page, "user");
  await page.goto("/admin");
  await expect(page.getByText("This account does not have admin or moderator access.")).toBeVisible();
  expect(backend.calls.some((call) => call.path.startsWith("/api/v1/admin"))).toBe(false);
  await page.unrouteAll();
  await mockBackend(page, "moderator", "user,admin");
  await page.reload();
  await expect(page.getByRole("button", { name: "Configuration", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Audit log", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Staff", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Inspect Ayesha Khan" }).click();
  await expect(page.getByText("Moderators cannot manage moderator or administrator accounts.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Account actions" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Verification decision" })).toHaveCount(0);
});

test("logout requires confirmation, including for an account without staff access", async ({ page }) => {
  for (const role of ["admin", "user"]) {
    await page.unrouteAll();
    const backend = await mockBackend(page, role);
    await page.goto("/admin");
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Confirm action" });
    await expect(dialog).toContainText("Sign out of Raastah?");
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    expect(backend.calls.filter((call) => call.path === "/api/auth/sign-out")).toHaveLength(0);
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await dialog.getByRole("button", { name: "Confirm", exact: true }).click();
    await expect(page.getByRole("button", { name: "Sign in to dashboard" })).toBeVisible();
    expect(backend.calls.filter((call) => call.path === "/api/auth/sign-out")).toHaveLength(1);
  }
});

test("Staff lets an admin appoint and remove a moderator using a confirmed, audited role change", async ({ page }) => {
  const backend = await mockBackend(page);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Staff", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Manage staff access" })).toBeVisible();
  await page.getByRole("button", { name: "Inspect Ayesha Khan" }).click();
  await expect(page.getByRole("heading", { name: "Staff role" })).toBeVisible();
  await page.getByRole("combobox", { name: "New role" }).selectOption("moderator");
  await page.getByLabel("Reason", { exact: true }).fill("Appointed to the support team");
  await page.getByRole("button", { name: "Review action", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Confirm action" });
  await expect(dialog).toContainText("Change role to moderator");
  await dialog.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.locator(".notice[role=status]")).toContainText("Role changed to moderator");
  await expect(page.getByText(/^Current role: moderator/)).toBeVisible();
  await page.getByRole("combobox", { name: "New role" }).selectOption("user");
  await page.getByLabel("Reason", { exact: true }).fill("Staff assignment completed");
  await page.getByRole("button", { name: "Review action", exact: true }).click();
  await dialog.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByText(/^Current role: user/)).toBeVisible();
  expect(backend.calls.filter((call) => call.path.endsWith("/role")).map((call) => call.body)).toEqual([
    { role: "moderator", reason: "Appointed to the support team" },
    { role: "user", reason: "Staff assignment completed" },
  ]);
  await page.getByRole("button", { name: "Back to staff" }).click();
  await page.getByLabel("Find by Auth user ID").fill(authId);
  await page.getByRole("button", { name: "Find account", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Staff role" })).toBeVisible();
});

test("audits show and search configuration and report targets without a user ID", async ({ page }) => {
  await mockBackend(page);
  await page.route("**/api/v1/admin/audits", (route) => route.fulfill({ json: { success: true, data: { audits: [
    { _id: "audit-config", action: "CONFIG_UPDATED", actorAuthUserId: "staff-id", actorRole: "admin", reason: "Pricing update", outcome: "SUCCEEDED", createdAt: "2026-09-05T10:00:00Z", details: { configKey: "ride-pricing" } },
    { _id: "audit-report", action: "REPORT_EVIDENCE_DELETED", actorAuthUserId: "staff-id", actorRole: "admin", reason: "Case closed", outcome: "SUCCEEDED", createdAt: "2026-09-05T10:00:00Z", details: { reportId: "report-123" } },
  ] } } }));
  await page.goto("/admin");
  await page.getByRole("button", { name: "Audit log", exact: true }).click();
  await expect(page.getByRole("cell", { name: /ride-pricing/ })).toBeVisible();
  await expect(page.getByRole("cell", { name: /report-123/ })).toBeVisible();
  await page.getByLabel("Search loaded audits").fill("report-123");
  await expect(page.getByRole("cell", { name: /report-123/ })).toBeVisible();
  await expect(page.getByRole("cell", { name: /ride-pricing/ })).toHaveCount(0);
});

test("account actions encode auth IDs, require confirmation, and show queued deletion without polling", async ({ page }) => {
  const backend = await mockBackend(page);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Inspect Ayesha Khan" }).click();
  await page.getByRole("combobox", { name: "Action", exact: true }).selectOption("suspend");
  await page.getByLabel("Duration (minutes)").fill("60");
  await page.getByLabel("Reason", { exact: true }).fill("Repeated cancellation abuse");
  await page.getByRole("button", { name: "Review action", exact: true }).click();
  const confirmation = page.getByRole("dialog", { name: "Confirm action" });
  await expect(confirmation).toContainText("Repeated cancellation abuse");
  await expect(confirmation.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(confirmation.getByRole("button", { name: "Confirm", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(confirmation).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Review action", exact: true })).toBeFocused();
  expect(backend.calls.filter((call) => call.method === "POST")).toHaveLength(0);
  await page.getByRole("button", { name: "Review action", exact: true }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Cancel", exact: true }).click();
  expect(backend.calls.filter((call) => call.method === "POST")).toHaveLength(0);
  await page.getByRole("button", { name: "Review action", exact: true }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.locator(".notice[role=status]")).toContainText("Changes saved");
  expect(backend.calls.find((call) => call.path.endsWith("/suspend"))?.body).toEqual({ durationMinutes: 60, reason: "Repeated cancellation abuse" });
  await page.getByRole("combobox", { name: "Action", exact: true }).selectOption("delete");
  await page.getByLabel("Reason", { exact: true }).fill("Approved account deletion request");
  await page.getByRole("button", { name: "Review action", exact: true }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.locator(".notice[role=status]")).toContainText("Deletion queued. Job job-123 · PENDING");
  await expect(page.getByRole("heading", { name: "User directory" })).toBeVisible();
  expect(backend.calls.filter((call) => call.path.endsWith("/delete"))).toHaveLength(1);
  expect(backend.calls.some((call) => call.path.includes("job-123"))).toBe(false);
});

test("verification approval removes the reviewed item and its document", async ({ page }) => {
  const backend = await mockBackend(page, "moderator");
  await page.goto("/admin");
  await page.getByRole("button", { name: "Verifications", exact: true }).click();
  await page.getByRole("button", { name: "Review Ayesha Khan" }).click();
  await expect(page.getByRole("link", { name: "Open verification document" })).toHaveAttribute("href", "https://documents.example.com/student-id");
  await page.getByRole("button", { name: "Review decision" }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByText("No verifications are waiting for review.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open verification document" })).toHaveCount(0);
  expect(backend.calls.find((call) => call.method === "PATCH")?.body).toEqual({ status: "VERIFIED" });
});

test("reports follow legal transitions and only resolved evidence can be deleted", async ({ page }) => {
  const backend = await mockBackend(page);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Reports", exact: true }).click();
  await page.getByRole("button", { name: /Review report/ }).click();
  await expect(page.getByLabel("New status").locator("option")).toHaveText(["Validate report", "Reject report"]);
  await expect(page.getByRole("button", { name: "Delete evidence permanently" })).toHaveCount(0);
  await page.getByRole("button", { name: "View evidence", exact: true }).click();
  await expect(page.getByText("Please slow down.")).toBeVisible();
  await page.getByLabel("Review note").fill("Evidence confirms the report.");
  await page.getByRole("button", { name: "Review status change" }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByLabel("New status").locator("option")).toHaveText(["Resolve report"]);
  await page.getByLabel("Review note").fill("Follow-up action completed.");
  await page.getByRole("button", { name: "Review status change" }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByRole("button", { name: "Review status change" })).toHaveCount(0);
  await page.getByRole("button", { name: "Delete evidence permanently" }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByText(/Evidence permanently deleted on/)).toBeVisible();
  expect(backend.calls.filter((call) => call.method === "PATCH").map((call) => call.body?.status)).toEqual(["VALIDATED", "RESOLVED"]);
  expect(backend.calls.filter((call) => call.method === "DELETE")).toHaveLength(1);
});

test("configuration uses server values and PATCHes only changed numeric fields", async ({ page }) => {
  const backend = await mockBackend(page);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Configuration", exact: true }).click();
  await expect(page.getByLabel("Current petrol price (PKR)")).toHaveValue("280");
  await page.getByLabel("Maximum search radius (meters)").fill("100");
  await page.getByRole("button", { name: "Review configuration changes" }).click();
  await expect(page.locator(".admin").getByRole("alert")).toContainText("Maximum search radius must be at least the initial radius.");
  await page.getByLabel("Maximum search radius (meters)").fill("2000");
  await page.getByLabel("Current petrol price (PKR)").fill("290.5");
  await page.getByLabel("Open discovery rate multiplier").fill("1.3");
  await page.getByRole("button", { name: "Review configuration changes" }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.locator(".notice[role=status]")).toContainText("Changes saved.");
  expect(backend.calls.find((call) => call.method === "PATCH")?.body).toEqual({ currentPetrolPrice: 290.5, openDiscoveryPricing: { rateMultiplier: 1.3 } });
  await page.getByRole("button", { name: "Review configuration changes" }).click();
  await expect(page.locator(".admin").getByRole("alert")).toContainText("Change at least one value");
});

test("rate limiting pauses mutations without retrying and session expiry clears private UI", async ({ page }) => {
  const backend = await mockBackend(page);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Inspect Ayesha Khan" }).click();
  await page.getByRole("combobox", { name: "Action", exact: true }).selectOption("unban");
  await page.getByLabel("Reason", { exact: true }).fill("Account review completed");
  backend.failNext({ path: `/api/v1/admin/users/${encodedId}/unban`, status: 429, retryAfter: "2" });
  await page.getByRole("button", { name: "Review action", exact: true }).click();
  await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByRole("button", { name: "Review action", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Review action", exact: true })).toBeEnabled({ timeout: 5000 });
  expect(backend.calls.filter((call) => call.path.endsWith("/unban"))).toHaveLength(1);
  backend.failNext({ path: "/api/v1/admin/users", status: 401 });
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
  await expect(page.getByText("Ayesha Khan", { exact: true })).toHaveCount(0);
});

test("missing records refresh the list; conflict and validation errors remain visible", async ({ page }) => {
  const backend = await mockBackend(page);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Inspect Ayesha Khan" }).click();
  await page.getByRole("combobox", { name: "Action", exact: true }).selectOption("unban");
  await page.getByLabel("Reason", { exact: true }).fill("Account review completed");
  for (const status of [400, 403, 409, 404]) {
    backend.failNext({ path: `/api/v1/admin/users/${encodedId}/unban`, status, body: status === 400 ? { success: false, errors: [{ field: "reason", message: "Please give more detail" }] } : { success: false, message: "Account management conflict" } });
    await page.getByRole("button", { name: "Review action", exact: true }).click();
    await page.getByRole("dialog", { name: "Confirm action" }).getByRole("button", { name: "Confirm", exact: true }).click();
    await expect(page.locator(".admin").getByRole("alert")).toContainText(status === 400 ? "reason: Please give more detail" : status === 404 ? "This record no longer exists" : "Account management conflict");
  }
  await expect(page.getByRole("heading", { name: "User directory" })).toBeVisible();
  expect(backend.calls.filter((call) => call.path.endsWith("/unban"))).toHaveLength(4);
});

test("dashboard fits a phone and desktop without horizontal page overflow", async ({ page }, testInfo) => {
  await mockBackend(page);
  await page.goto("/admin");
  await expect(page.getByText("Ayesha Khan", { exact: true })).toBeVisible();
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.screenshot({ path: testInfo.outputPath(`admin-${width}.png`), fullPage: true });
  }
});

test("config validation rejects unsafe numbers and inconsistent thresholds; document links reject scripts", () => {
  function fields() {
    const form = new FormData();
    for (const [key] of configFields) form.set(key, String(key === "rateMultiplier" ? initialConfig.openDiscoveryPricing.rateMultiplier : initialConfig[key]));
    return form;
  }
  for (const [key, value] of [["searchTimeoutSeconds", "1.5"], ["initialSearchRadiusMeters", "3001"], ["rateMultiplier", "0"], ["currentPetrolPrice", ""], ["currentPetrolPrice", "Infinity"], ["warningAfterCancellationCount", "5"], ["cancellationRatingPenalty", "6"]]) {
    const form = fields(); form.set(key, value);
    expect(() => configPatch(form, initialConfig)).toThrow();
  }
  const form = fields(); form.set("currentPetrolPrice", "0");
  expect(configPatch(form, initialConfig)).toEqual({ currentPetrolPrice: 0 });
  expect(safeDocumentUrl("javascript:alert(1)")).toBeNull();
  expect(safeDocumentUrl("data:text/html,bad")).toBeNull();
  expect(safeDocumentUrl("https://example.com/file")).toBe("https://example.com/file");
});

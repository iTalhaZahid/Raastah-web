"use client";

import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ClipboardCheck, FileWarning, LogOut, Settings2, ShieldCheck, Users, ScrollText, GraduationCap } from "lucide-react";
import { adminRoot, apiOrigin, ApiError, request, roles, type Session } from "@/lib/admin-api";
import { UsersPanel, VerificationsPanel } from "./users";
import { ReportsPanel, ConfigPanel, AuditsPanel } from "./operations";
import { UniversitiesPanel } from "./universities";
import { version } from "../../package.json";

type AdminContextValue = {
  isAdmin: boolean;
  blocked: boolean;
  read: <T>(path: string, signal: AbortSignal) => Promise<T>;
  mutate: <T>(path: string, method: string, body: unknown, confirmation: string) => Promise<T | null | undefined>;
  notify: (message: string) => void;
  notifyError: (message: string) => void;
};
const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("Admin context is missing.");
  return context;
}

export function useResource<T>(path: string) {
  const { read } = useAdmin();
  const [result, setResult] = useState<{ path?: string; data?: T; loading: boolean; error?: ApiError }>({ loading: true });
  useEffect(() => {
    const controller = new AbortController();
    read<T>(path, controller.signal).then(
      (data) => { if (!controller.signal.aborted) setResult({ path, data, loading: false }); },
      (error) => { if (!controller.signal.aborted) setResult({ path, error, loading: false }); },
    );
    return () => controller.abort();
  }, [path, read]);
  return result.path === path ? result : { loading: true };
}

type Pagination = { page: number; limit: number; hasNext: boolean; hasPrevious: boolean; nextPage: number | null };

export function usePaginatedResource<T>(path: string, filter = "") {
  const key = JSON.stringify([path, filter]);
  const [position, setPosition] = useState({ key, page: 1 });
  const page = position.key === key ? position.page : 1;
  if (position.key !== key) setPosition({ key, page: 1 });
  const result = useResource<T & { pagination: Pagination }>(`${path}${path.includes("?") ? "&" : "?"}page=${page}&limit=10`);
  return { ...result, page, setPage: (page: number) => setPosition({ key, page }) };
}

export function PageControls({ result }: { result: { data?: { pagination: Pagination }; loading: boolean; page: number; setPage: (page: number) => void } }) {
  const { blocked } = useAdmin();
  const pagination = result.data?.pagination;
  return <nav className="row toolbar" aria-label="Pagination">
    <button disabled={blocked || result.loading || result.page <= 1 || pagination?.hasPrevious === false} onClick={() => result.setPage(result.page - 1)}>Previous</button>
    <span aria-live="polite">Page {result.page}</span>
    <button disabled={blocked || result.loading || !pagination?.hasNext || pagination.nextPage === null} onClick={() => { if (pagination?.nextPage) result.setPage(pagination.nextPage); }}>Next</button>
  </nav>;
}

export function Badge({ status }: { status: string }) {
  return <span className="badge" data-status={status}>{status.replaceAll("_", " ")}</span>;
}

export function date(value?: string) {
  return value ? new Date(value).toLocaleString() : "—";
}

export function LoadingSkeleton({ layout = "list", label = "Loading records…" }: { layout?: "list" | "overview" | "form"; label?: string }) {
  return <div className="stack loading-skeleton" role="status" aria-label={label}>
    <span className="sr-only">{label}</span>
    {layout === "overview" && <div className="metrics" aria-hidden="true">{[0, 1, 2].map((item) => <div className="panel stack" key={item}><span className="skeleton skeleton-label" /><span className="skeleton skeleton-value" /></div>)}</div>}
    <div className={layout === "form" ? "grid" : "stack"} aria-hidden="true">
      {(layout === "form" ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3]).map((item) => <div className="skeleton-row" key={item}><span className="skeleton skeleton-label" /><span className={`skeleton ${layout === "form" ? "skeleton-input" : "skeleton-line"}`} /></div>)}
    </div>
  </div>;
}

export function ResourceState({ loading, error, children, layout = "list" }: { loading: boolean; error?: Error; children: ReactNode; layout?: "list" | "overview" | "form" }) {
  if (loading) return <LoadingSkeleton layout={layout} />;
  if (error) return <p className="empty">Records could not be loaded. Use Refresh to try again.</p>;
  return children;
}

const tabs = [
  { id: "users", label: "Users", icon: Users, description: "Inspect accounts, ride history, and access." },
  { id: "staff", label: "Staff", icon: ShieldCheck, description: "Appoint moderators and manage staff access.", admin: true },
  { id: "universities", label: "Universities", icon: GraduationCap, description: "Manage universities available for student selection.", admin: true },
  { id: "verifications", label: "Verifications", icon: ClipboardCheck, description: "Review student documents and verification requests." },
  { id: "reports", label: "Reports", icon: FileWarning, description: "Review safety reports and preserved chat evidence." },
  { id: "config", label: "Configuration", icon: Settings2, description: "Manage matching, pricing, and cancellation rules.", admin: true },
  { id: "audits", label: "Audit log", icon: ScrollText, description: "Review privileged account actions and their outcomes.", admin: true },
] as const;
type Tab = (typeof tabs)[number]["id"];

export default function AdminDashboard() {
  const [session, setSession] = useState<Session>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [failure, setFailure] = useState<ApiError>();
  const [recovery, setRecovery] = useState<{ path: string; summary?: string; audits?: string; error?: string }>();
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const confirmationResolver = useRef<((confirmed: boolean) => void) | null>(null);
  const confirmationTrigger = useRef<HTMLElement | null>(null);
  const confirmAction = useCallback((message: string) => new Promise<boolean>((resolve) => {
    confirmationTrigger.current = document.activeElement as HTMLElement | null;
    confirmationResolver.current = resolve;
    setConfirmation(message);
  }), []);
  const answerConfirmation = useCallback((confirmed: boolean) => {
    const resolve = confirmationResolver.current;
    confirmationResolver.current = null;
    setConfirmation(null);
    resolve?.(confirmed);
  }, []);
  useEffect(() => () => { confirmationResolver.current?.(false); }, []);
  const [cooldown, setCooldown] = useState(0);
  const [tab, setTab] = useState<Tab>("users");
  const [revision, setRevision] = useState(0);
  const isAdmin = roles(session?.user.role).includes("admin");
  const isStaff = isAdmin || roles(session?.user.role).includes("moderator");
  const blocked = pending || confirmation !== null || cooldown > 0;

  const handleError = useCallback((cause: unknown) => {
    const failure = cause instanceof ApiError ? cause : new ApiError("The request could not be completed.", 0);
    setFailure(failure);
    if (failure.status === 401) {
      answerConfirmation(false);
      setSession(null);
      setRecovery(undefined);
      setNotice("");
      setTab("users");
      setError("Your session has expired. Please sign in again.");
    } else {
      setError(failure.status === 403 ? `Insufficient permission or account unavailable. ${failure.message}` :
        failure.status === 404 ? "This record no longer exists. Refresh the list to continue." : failure.message);
    }
    if (failure.status === 429) setCooldown(Math.ceil(failure.retryAfter));
  }, [answerConfirmation]);

  useEffect(() => {
    const controller = new AbortController();
    request<Session>("/api/auth/get-session", { signal: controller.signal }).then(
      (value) => { if (!controller.signal.aborted) setSession(value); },
      (cause) => { if (!controller.signal.aborted) handleError(cause); },
    ).finally(() => { if (!controller.signal.aborted) setChecking(false); });
    return () => controller.abort();
  }, [handleError]);

  async function recoverMutation(path: string) {
    setRecovery({ path });
    try {
      const parts = path.split("/");
      const target = parts[1] === "verifications" ? `/users/${parts[2]}` : parts[1] === "users" || parts[1] === "reports" ? `/${parts[1]}/${parts[2]}` : `/${parts[1]}`;
      const controller = new AbortController();
      let data: Record<string, unknown>;
      try { data = await read<Record<string, unknown>>(target, controller.signal); }
      catch (cause) {
        if (!(cause instanceof ApiError) || cause.status !== 404) throw cause;
        data = { status: "Target no longer exists. Check audit history to establish the outcome." };
      }
      const record = (data.user ?? data.report ?? data) as Record<string, unknown>;
      const account = data.account as { role?: string; banned?: boolean } | undefined;
      const summary = [record.fullName, record.verificationStatus, record.status, account?.role,
        account ? (account.banned ? "Account banned" : "Account not banned") : undefined, record.isDeleted ? "Account deleted" : undefined,
        record.rideSuspendedUntil ? `Rides suspended until ${record.rideSuspendedUntil}` : undefined,
        record.evidenceDeletedAt ? "Evidence snapshot removed" : undefined,
        target === "/config" ? "Current configuration reloaded." : undefined,
        target === "/universities" ? "Current university catalog reloaded." : undefined,
      ].filter(Boolean).join(" · ") || "Target record reloaded.";
      let audits = "Audit history is admin-only. Ask an administrator to check the outcome before retrying.";
      if (isAdmin) {
        const { audits: entries } = await read<{ audits: import("@/lib/admin-api").Audit[] }>("/audits?page=1&limit=10", controller.signal);
        const relevant = entries.filter((entry) => parts[1] === "users" || parts[1] === "verifications" ? entry.targetAuthUserId === decodeURIComponent(parts[2]) : parts[1] === "reports" ? entry.details?.reportId === decodeURIComponent(parts[2]) : parts[1] === "config" ? entry.action === "CONFIG_UPDATED" : entry.action.startsWith("UNIVERSITY_"));
        audits = relevant.slice(0, 5).map((entry) => `${entry.action}: ${entry.outcome} (${entry.createdAt})`).join("; ") || "No matching entry on the first page of audits. Absence does not establish that the write failed.";
      }
      setRecovery({ path, summary, audits });
      setRevision((value) => value + 1);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) return;
      setRecovery({ path, error: "Could not establish the outcome. Check the connection and reload the latest state before retrying." });
    }
  }

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const read = useCallback(async <T,>(path: string, signal: AbortSignal): Promise<T> => {
    try {
      const response = await request<{ success: true; data: T }>(path === "/api/v1/universities" ? path : `${adminRoot}${path}`, { signal });
      if (response?.success !== true || !response.data) throw new ApiError("The API returned an unexpected response.", 0);
      return response.data;
    } catch (cause) {
      if (!signal.aborted) handleError(cause);
      throw cause;
    }
  }, [handleError]);

  const mutate = async <T,>(path: string, method: string, body: unknown, confirmation: string): Promise<T | null | undefined> => {
    if (pendingRef.current || cooldown || recovery) return;
    pendingRef.current = true;
    try {
      const confirmed = await confirmAction(confirmation);
      if (!confirmed) return;
      setPending(true);
      setError("");
      setFailure(undefined);
      setNotice("");
      const response = await request<{ success: true; data: T } | null>(`${adminRoot}${path}`, {
        method, ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      if (response !== null && (response?.success !== true || !response.data)) throw new ApiError("The API returned an unexpected response. Refresh before taking another action.", 0);
      setNotice("Changes saved.");
      return response === null ? null : response.data;
    } catch (cause) {
      handleError(cause);
      if (cause instanceof ApiError && cause.status === 404) setRevision((value) => value + 1);
      if (cause instanceof ApiError && cause.status === 409 && (path.startsWith("/reports/") || path === "/config")) setRevision((value) => value + 1);
      if (!(cause instanceof ApiError) || cause.status === 0 || cause.status >= 500 || (cause.status >= 200 && cause.status < 300)) await recoverMutation(path);
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRef.current || cooldown) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = JSON.stringify({ email: String(data.get("email")).trim(), password: data.get("password"), rememberMe: false });
    pendingRef.current = true;
    setPending(true);
    setError("");
    try {
      await request("/api/auth/sign-in/email", { method: "POST", body });
      const nextSession = await request<Session>("/api/auth/get-session");
      if (!nextSession?.user) {
        throw new ApiError("Sign-in succeeded, but no session was saved. Check that the backend session cookie is accepted for this dashboard's host, then try again.", 0);
      }
      setSession(nextSession);
      form.reset();
      setTab("users");
      setRevision((value) => value + 1);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) setError(cause.message);
      else handleError(cause);
    } finally {
      const password = form.elements.namedItem("password") as HTMLInputElement | null;
      if (password) password.value = "";
      pendingRef.current = false;
      setPending(false);
    }
  }

  async function signOut() {
    if (pendingRef.current || cooldown) return;
    pendingRef.current = true;
    try {
      if (!await confirmAction("Sign out of Raastah? You will need to sign in again to access the staff workspace.")) return;
      setPending(true);
      setError("");
      await request("/api/auth/sign-out", { method: "POST", body: "{}" });
      setSession(null);
      setRecovery(undefined);
      setNotice("");
      setTab("users");
    } catch (cause) { handleError(cause); }
    finally { pendingRef.current = false; setPending(false); }
  }

  const confirmationDialog = (
<Dialog.Root open={confirmation !== null} onOpenChange={(open) => { if (!open) answerConfirmation(false); }}>
        <Dialog.Portal className="admin admin-dialog">
          <Dialog.Backdrop className="confirmation-backdrop" />
          <Dialog.Popup className="panel stack confirmation-popup" finalFocus={confirmationTrigger}>
            <Dialog.Title>Confirm action</Dialog.Title>
            <Dialog.Description className="muted confirmation-description">{confirmation}</Dialog.Description>
            <div className="row confirmation-actions">
              <Dialog.Close>Cancel</Dialog.Close>
              <button className="primary" type="button" onClick={() => answerConfirmation(true)}>Confirm</button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
  );

  const supportDetails = failure ? `Request ID: ${failure.requestId ?? "unavailable"}; Render ID: ${failure.renderRequestId ?? "unavailable"}; HTTP: ${failure.status || "network"}; UTC: ${failure.timestamp}; Dashboard: ${version}` : "";
  const feedback = <>
    {error && <div className="notice error error-toast row between" role="alert"><span>{error}</span><button type="button" aria-label="Dismiss error" onClick={() => setError("")}>Dismiss</button></div>}
    {error && failure && <div className="notice stack">
      <label>Support details<input readOnly value={supportDetails} onFocus={(event) => event.target.select()} /></label>
      <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(supportDetails); setNotice("Support details copied."); } catch { setNotice("Select and copy the support details field."); } }}>Copy support details</button>
    </div>}
    {recovery && <section className="notice stack" aria-label="Mutation recovery">
      <h2>Check the operation outcome</h2><p>The write may already have succeeded. It has not been retried.</p>
      <p>{recovery.error ?? recovery.summary ?? "Reading the target and available audit history…"}</p>
      {recovery.audits && <p>{recovery.audits}</p>}
      {recovery.error ? <button disabled={pending} onClick={() => recoverMutation(recovery.path)}>Reload latest state</button> : recovery.summary && <button onClick={() => setRecovery(undefined)}>I have reviewed the outcome</button>}
    </section>}
    {notice && <p className="notice" role="status">{notice}</p>}
    {cooldown > 0 && <p className="notice" role="status">Too many requests. Submissions are paused for {cooldown} seconds.</p>}
  </>;

  if (checking || !session || !isStaff) return (
    <div className="admin">{confirmationDialog}<main className="login"><div className="panel login-card stack">
      <Link href="/" className="brand">Raastah<span style={{ color: "var(--admin-lime)" }}>.</span></Link>
      <ShieldCheck size={32} color="#d4ff00" aria-hidden="true" />
      <div><p className="eyebrow">Staff workspace</p><h1>Admin sign in</h1><p className="muted">Keep every road a little safer.</p></div>
      {feedback}
      {checking ? <LoadingSkeleton label="Checking your session…" /> : session ? <>
        <p role="alert">This account does not have admin or moderator access.</p>
        <button disabled={blocked} onClick={signOut}>Sign out</button>
      </> : <form onSubmit={signIn} className="stack">
        <fieldset disabled={blocked || !apiOrigin} className="stack">
          <label>Email address<input name="email" type="email" autoComplete="username" placeholder="you@raastah.com" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={128} /></label>
          <button className="primary" type="submit">{pending ? "Signing in…" : "Sign in to dashboard"}</button>
        </fieldset>
        <p className="muted">Use an existing administrator or moderator account.</p>
      </form>}
    </div></main></div>
  );

  const current = tabs.find((item) => item.id === tab)!;
  return (
    <AdminContext.Provider value={{ isAdmin, blocked: blocked || !!recovery, read, mutate, notify: setNotice, notifyError: setError }}>
      {confirmationDialog}
      <div className="admin">
        <a className="skip" href="#admin-content">Skip to content</a>
        <div className="shell">
          <aside>
            <Link href="/" className="brand">Raastah<span style={{ color: "var(--admin-lime)" }}>.</span></Link>
            <p className="eyebrow" style={{ marginTop: 8 }}>Control center</p>
            <nav aria-label="Admin navigation">
              {tabs.filter((item) => !("admin" in item) || isAdmin).map(({ id, label, icon: Icon }) => (
                <button key={id} aria-current={tab === id ? "page" : undefined} disabled={blocked} onClick={() => { setTab(id); setError(""); setNotice(""); }}>
                  <Icon size={18} aria-hidden="true" />{label}
                </button>
              ))}
            </nav>
          </aside>
          <main id="admin-content" className="workspace">
            <div className="content stack">
              <header className="topbar row between">
                <div className="row"><ShieldCheck size={18} color="#d4ff00" aria-hidden="true" /><span>Staff workspace</span></div>
                <div className="row"><span>{session.user.name || session.user.email}</span><Badge status={isAdmin ? "ADMIN" : "MODERATOR"} /><button onClick={signOut} disabled={blocked}><LogOut size={16} aria-hidden="true" />Sign out</button></div>
              </header>
              <div className="row between">
                <div><p className="eyebrow">Operations / {current.label}</p><h1>{current.label}</h1><p className="muted">{current.description}</p></div>
                <button disabled={blocked} onClick={() => { setError(""); setRevision((value) => value + 1); }}>Refresh</button>
              </div>
              {feedback}
              <div key={`${tab}-${revision}`}>
                {tab === "users" && <UsersPanel />}
                {tab === "staff" && isAdmin && <UsersPanel staff />}
                {tab === "universities" && isAdmin && <UniversitiesPanel />}
                {tab === "verifications" && <VerificationsPanel />}
                {tab === "reports" && <ReportsPanel />}
                {tab === "config" && isAdmin && <ConfigPanel />}
                {tab === "audits" && isAdmin && <AuditsPanel />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}

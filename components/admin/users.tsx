"use client";

import { useEffect, useState, type FormEvent } from "react";
import { roles, safeDocumentUrl, type Ride, type UserDetail, type UserRow, type VerificationUser } from "@/lib/admin-api";
import { Badge, date, ResourceState, useAdmin, useResource } from "./dashboard";

export function UsersPanel({ staff = false }: { staff?: boolean }) {
  const [selected, setSelected] = useState<string>();
  const [revision, setRevision] = useState(0);
  const { blocked } = useAdmin();
  return selected ? <UserInspector key={`${selected}-${revision}`} id={selected} staff={staff} onClose={() => setSelected(undefined)} onUpdated={(close) => { setRevision((value) => value + 1); if (close) setSelected(undefined); }} />
    : <div className="stack">
      {staff && <section className="panel stack">
        <h2>Manage staff access</h2>
        <p className="muted">Select a registered account below to view its current role and appoint a moderator or remove staff access. Role changes replace existing roles and sign the account out on all devices.</p>
        <form className="row toolbar" onSubmit={(event) => { event.preventDefault(); const id = String(new FormData(event.currentTarget).get("authUserId") ?? "").trim(); if (id) setSelected(id); }}>
          <label>Find by Auth user ID<input name="authUserId" required pattern=".*\S.*" disabled={blocked} placeholder="Look up an account outside the recent list" /></label>
          <button type="submit" disabled={blocked}>Find account</button>
        </form>
      </section>}
      <UsersList onSelect={setSelected} />
    </div>;
}

function UsersList({ onSelect }: { onSelect: (id: string) => void }) {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  return <div className="stack">
    <div className="panel row toolbar">
      <label>Search loaded users<input type="search" placeholder="Name or email" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      <label>Verification status<select value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="">All statuses</option>{["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED"].map((value) => <option key={value}>{value}</option>)}
      </select></label>
    </div>
    <UserResults key={filter} filter={filter} search={search} onSelect={onSelect} />
  </div>;
}

function UserResults({ filter, search, onSelect }: { filter: string; search: string; onSelect: (id: string) => void }) {
  const result = useResource<{ users: UserRow[] }>(`/users${filter ? `?verificationStatus=${filter}` : ""}`);
  const { blocked } = useAdmin();
  const users = result.data?.users ?? [];
  const filtered = users.filter((user) => `${user.fullName} ${user.email}`.toLowerCase().includes(search.toLowerCase().trim()));
  return <ResourceState {...result}>
    <div className="stack">
      <div className="metrics">
        <div className="panel"><p className="muted">Loaded accounts</p><p className="metric">{users.length}</p></div>
        <div className="panel"><p className="muted">Verified in this list</p><p className="metric">{users.filter((user) => user.verificationStatus === "VERIFIED").length}</p></div>
        <div className="panel"><p className="muted">Blocked in this list</p><p className="metric">{users.filter((user) => user.isBlocked || user.ridePermanentlyBanned).length}</p></div>
      </div>
      <section className="panel stack"><div><h2>User directory</h2><p className="muted">Up to 100 most recent accounts. Search applies to this loaded list.</p></div>
        {!filtered.length ? <p className="empty">No users match your search.</p> : <div className="table-wrap"><table>
          <thead><tr><th scope="col">User</th><th scope="col">Verification</th><th scope="col">Account</th><th scope="col">Joined</th><th scope="col">Action</th></tr></thead>
          <tbody>{filtered.map((user) => <tr key={user.authUserId}>
            <td><strong>{user.fullName}</strong><p className="muted">{user.email}</p></td>
            <td><Badge status={user.verificationStatus} /></td>
            <td>{user.isDeleted ? "Deleted" : user.isBlocked ? "Blocked" : user.ridePermanentlyBanned ? "Rides banned" : "Active"}</td>
            <td>{date(user.createdAt)}</td><td><button disabled={blocked} onClick={() => onSelect(user.authUserId)} aria-label={`Inspect ${user.fullName}`}>Inspect</button></td>
          </tr>)}</tbody>
        </table></div>}
      </section>
    </div>
  </ResourceState>;
}

export function VerificationsPanel() {
  const [selected, setSelected] = useState<string>();
  return selected ? <UserInspector id={selected} verification onClose={() => setSelected(undefined)} onUpdated={() => setSelected(undefined)} />
    : <VerificationQueue onSelect={setSelected} />;
}

function VerificationQueue({ onSelect }: { onSelect: (id: string) => void }) {
  const result = useResource<{ users: VerificationUser[] }>("/verifications");
  const { blocked } = useAdmin();
  return <section className="panel stack">
    <div><h2>Student verification queue</h2><p className="muted">Oldest pending or under-review submissions first. Up to 100 records.</p></div>
    <ResourceState {...result}>
      {!result.data?.users.length ? <p className="empty">No verifications are waiting for review.</p> : <div className="table-wrap"><table>
        <thead><tr><th scope="col">Student</th><th scope="col">Status</th><th scope="col">Document</th><th scope="col">Action</th></tr></thead>
        <tbody>{result.data.users.map((user) => <tr key={user.authUserId}>
          <td><strong>{user.fullName}</strong><p className="muted">{user.email}</p></td>
          <td><Badge status={user.verificationStatus} /></td><td>{user.verificationDocument.uploaded ? "Uploaded" : "Not uploaded"}</td>
          <td><button disabled={blocked} onClick={() => onSelect(user.authUserId)} aria-label={`Review ${user.fullName}`}>Review</button></td>
        </tr>)}</tbody>
      </table></div>}
    </ResourceState>
  </section>;
}

function UserInspector({ id, verification = false, staff = false, onClose, onUpdated }: { id: string; verification?: boolean; staff?: boolean; onClose: () => void; onUpdated: (close?: boolean) => void }) {
  const result = useResource<UserDetail>(`/users/${encodeURIComponent(id)}`);
  const { isAdmin, blocked } = useAdmin();
  useEffect(() => { if (result.error?.status === 404) onClose(); }, [result.error, onClose]);
  const user = result.data?.user;
  const account = result.data?.account;
  const canManage = !!account && (isAdmin || !roles(account.role).some((role) => role === "admin" || role === "moderator"));
  const document = safeDocumentUrl(user?.verificationDocument?.url);
  return <div className="stack">
    <div><button disabled={blocked} onClick={onClose}>← Back to {staff ? "staff" : verification ? "verification queue" : "users"}</button></div>
    <ResourceState {...result}>{user && <>
      <section className="panel stack">
        <div className="row between"><div><h2>{user.fullName}</h2><p className="muted">{user.email}</p></div><Badge status={user.verificationStatus} /></div>
        <dl className="details">
          <div><dt>Auth user ID</dt><dd className="id">{user.authUserId}</dd></div>
          <div><dt>Application user ID</dt><dd className="id">{user._id}</dd></div>
          <div><dt>Role</dt><dd>{account?.role || "user"}</dd></div>
          <div><dt>Joined</dt><dd>{date(user.createdAt)}</dd></div>
          <div><dt>Account access</dt><dd>{user.isDeleted ? "Deleted" : account?.banned ? "Banned" : user.isBlocked ? "Blocked" : "Active"}</dd></div>
          <div><dt>Ride suspension ends</dt><dd>{date(user.rideSuspendedUntil)}</dd></div>
          <div><dt>Ride access</dt><dd>{user.ridePermanentlyBanned ? "Permanently banned" : "Not permanently banned"}</dd></div>
          <div><dt>Account ban</dt><dd>{account?.banReason || "—"}{account?.banExpires && ` · Expires ${date(account.banExpires)}`}</dd></div>
          <div><dt>Completed / total rides</dt><dd>{user.stats.completedRides} / {user.stats.totalRides}</dd></div>
          <div><dt>Average rating</dt><dd>{user.stats.averageRating}</dd></div>
        </dl>
      </section>
      {!staff && <section className="panel stack">
        <h2>Verification documents</h2>
        {document ? <a className="button-link" href={document} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Open verification document ↗</a> : <p className="muted">No accessible verification document. Reviewed files may have already been deleted.</p>}
        {!user.verificationHistory?.length ? <p className="muted">No verification history.</p> : user.verificationHistory.map((item) => <div className="message stack" key={item._id}>
          <div className="row between"><strong>{item.documentType.replaceAll("_", " ")} · {item.verificationMethod}</strong><Badge status={item.status} /></div>
          <p className="muted">Submitted {date(item.submittedAt)}{item.detectedName ? ` · Detected name: ${item.detectedName}` : ""}{item.confidenceScore !== undefined ? ` · Confidence: ${item.confidenceScore}` : ""}</p>
          {item.audit.map((entry, index) => <p key={index}>{entry.action.replaceAll("_", " ")} · {date(entry.createdAt)}{entry.reason ? ` — ${entry.reason}` : ""}</p>)}
        </div>)}
        {canManage && !user.isDeleted && (user.verificationStatus === "PENDING" || user.verificationStatus === "UNDER_REVIEW") && <VerificationDecision id={id} name={user.fullName} onDone={() => onUpdated()} />}
      </section>}
      {!canManage && <p className="notice">{account ? "Moderators cannot manage moderator or administrator accounts." : "Account details are unavailable; account changes are disabled."}</p>}
      {canManage && !user.isDeleted && <UserActions id={id} user={user} staff={staff} currentRole={account?.role} onDone={onUpdated} />}
      {!verification && !staff && <RideHistory id={id} />}
    </>}</ResourceState>
  </div>;
}

function VerificationDecision({ id, name, onDone }: { id: string; name: string; onDone: () => void }) {
  const { blocked, mutate } = useAdmin();
  const [status, setStatus] = useState("VERIFIED");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const reason = String(form.get("reason") ?? "").trim();
    if (status === "REJECTED" && (reason.length < 3 || reason.length > 1000)) { setError("Enter a reason between 3 and 1000 characters."); return; }
    setError("");
    const result = await mutate(`/verifications/${encodeURIComponent(id)}`, "PATCH", { status, ...(status === "REJECTED" ? { reason } : {}) }, `${status === "VERIFIED" ? "Approve" : "Reject"} verification for ${name}? Stored verification files will be permanently deleted.${reason ? `\nReason: ${reason}` : ""}`);
    if (result) onDone();
  }
  return <form onSubmit={submit} className="stack">
    <h3>Verification decision</h3><p className="muted">Approving or rejecting deletes the stored verification files.</p>
    <fieldset disabled={blocked} className="stack">
      <label>Decision<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="VERIFIED">Approve verification</option><option value="REJECTED">Reject verification</option></select></label>
      {status === "REJECTED" && <label>Reason<textarea name="reason" required minLength={3} maxLength={1000} /></label>}
      {error && <p role="alert" className="notice error">{error}</p>}
      <div><button className="primary" type="submit">Review decision</button></div>
    </fieldset>
  </form>;
}

const userActions = [
  ["suspend", "Suspend rides", "All active sessions will be revoked."],
  ["ban", "Ban account", "This account will lose access."],
  ["unban", "Unban account", "The account ban will be removed."],
  ["verification-revoke", "Revoke verification", "Verification returns to pending and accepted, unstarted rides will be cancelled."],
  ["role", "Change role", "Target sessions will be revoked."],
  ["password", "Change password", "The password will be replaced and target sessions revoked."],
  ["sessions/revoke", "Revoke sessions", "The user will be signed out on all devices."],
  ["delete", "Delete account", "Account deletion will be queued and processed asynchronously. This cannot be undone."],
] as const;

function UserActions({ id, user, staff = false, currentRole, onDone }: { id: string; user: UserRow; staff?: boolean; currentRole?: string; onDone: (close?: boolean) => void }) {
  const { isAdmin, blocked, mutate, notify } = useAdmin();
  const [action, setAction] = useState<string>(staff ? "role" : "suspend");
  const [error, setError] = useState("");
  const available = userActions.filter(([value], index) => (isAdmin || index < 4) && (value !== "verification-revoke" || user.verificationStatus === "VERIFIED"));
  const chosen = available.find(([value]) => value === action)!;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const reason = String(fields.get("reason") ?? "").trim();
    if (reason.length < 3 || reason.length > 1000) { setError("Enter a reason between 3 and 1000 characters."); return; }
    const body: Record<string, string | number> = { reason };
    if (action === "suspend") body.durationMinutes = Number(fields.get("durationMinutes"));
    if (action === "ban" && fields.get("banExpiresIn")) body.banExpiresIn = Number(fields.get("banExpiresIn"));
    if (action === "role") body.role = String(fields.get("role"));
    if (action === "password") body.newPassword = String(fields.get("newPassword"));
    setError("");
    const path = action === "verification-revoke" ? `/verifications/${encodeURIComponent(id)}/revoke` : `/users/${encodeURIComponent(id)}/${action}`;
    const result = await mutate<{ deletionJobId?: string; status?: string; suspendedUntil?: string }>(path, "POST", body, `${chosen[1]}${action === "role" ? ` to ${body.role}` : ""} for ${user.fullName} (${user.email})?\n${chosen[2]}${action === "role" ? " This replaces all existing roles; the user must sign in again." : ""}\nReason: ${reason}`);
    // Clear password input even after a failed or cancelled attempt.
    if (action === "password") form.reset();
    if (result) {
      if (action === "delete") notify(`Deletion queued. Job ${result.deletionJobId} · ${result.status}. Processing continues in the background.`);
      else if (result.suspendedUntil) notify(`Rides suspended until ${date(result.suspendedUntil)}.`);
      else if (action === "role") notify(`Role changed to ${body.role}. ${user.fullName} must sign in again.`);
      onDone(action === "delete");
    }
  }
  return <section className="panel stack">
    <h2>{staff ? "Staff role" : "Account actions"}</h2>
    {staff ? <p className="muted">Current role: {currentRole || "user"}. Select Moderator to appoint this account, or User to remove staff access.</p> : <label>Action<select value={action} disabled={blocked} onChange={(event) => { setAction(event.target.value); setError(""); }}>{available.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>}
    <p className="muted">{chosen[2]}</p>
    <form key={action} onSubmit={submit}><fieldset disabled={blocked} className="stack">
      {action === "suspend" && <label>Duration (minutes)<input name="durationMinutes" type="number" min={1} max={525600} step={1} required /></label>}
      {action === "ban" && <label>Ban duration (seconds, optional)<input name="banExpiresIn" type="number" min={1} step={1} placeholder="Leave blank for no expiry" /></label>}
      {action === "role" && <label>New role<select name="role" defaultValue={staff ? "moderator" : "user"}><option value="user">User</option><option value="moderator">Moderator</option><option value="admin">Admin</option></select></label>}
      {action === "password" && <label>New password<input name="newPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128} /></label>}
      <label>Reason<textarea name="reason" required minLength={3} maxLength={1000} placeholder="Explain why this action is necessary" /></label>
      {error && <p className="notice error" role="alert">{error}</p>}
      <div><button type="submit" className={action === "delete" || action === "ban" ? "danger" : "primary"}>Review action</button></div>
    </fieldset></form>
  </section>;
}

function RideHistory({ id }: { id: string }) {
  const result = useResource<{ rides: Ride[] }>(`/users/${encodeURIComponent(id)}/rides`);
  return <section className="panel stack"><h2>Ride history</h2><ResourceState {...result}>
    {!result.data?.rides.length ? <p className="empty">No rides found for this user.</p> : <div className="table-wrap"><table>
      <thead><tr><th scope="col">Route</th><th scope="col">Status</th><th scope="col">Agreed price</th><th scope="col">Created</th></tr></thead>
      <tbody>{result.data.rides.map((ride) => <tr key={ride._id}><td>{ride.pickup.displayName} → {ride.destination.displayName}<p className="id muted">{ride._id}</p></td><td><Badge status={ride.status} /></td><td>PKR {ride.agreedPrice}</td><td>{date(ride.createdAt)}</td></tr>)}</tbody>
    </table></div>}
  </ResourceState></section>;
}

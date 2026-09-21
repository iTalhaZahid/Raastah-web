"use client";

import { useEffect, useState, type FormEvent } from "react";
import { adminRoot, request, configFields, configPatch, safeDocumentUrl, type AdminConfig, type Audit, type Evidence, type Report, type UserDetail } from "@/lib/admin-api";
import { Badge, date, ResourceState, useAdmin, useResource } from "./dashboard";

export function ReportsPanel() {
  const [selected, setSelected] = useState<string>();
  const [revision, setRevision] = useState(0);
  return selected ? <ReportDetail key={`${selected}-${revision}`} id={selected} onClose={() => setSelected(undefined)} onUpdated={() => setRevision((value) => value + 1)} />
    : <ReportsList onSelect={setSelected} />;
}

function ReportsList({ onSelect }: { onSelect: (id: string) => void }) {
  const result = useResource<{ reports: Report[] }>("/reports");
  const { blocked } = useAdmin();
  const [status, setStatus] = useState("");
  const reports = (result.data?.reports ?? []).filter((report) => !status || report.status === status);
  return <section className="panel stack">
    <div className="row between"><div><h2>Safety reports</h2><p className="muted">Most recent reports first. Filters apply to the loaded records.</p></div>
      <label>Report status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{["SUBMITTED", "VALIDATED", "REJECTED", "RESOLVED"].map((value) => <option key={value}>{value}</option>)}</select></label>
    </div>
    <ResourceState {...result}>
      {!reports.length ? <p className="empty">No reports match this status.</p> : <div className="table-wrap"><table>
        <thead><tr><th scope="col">Report</th><th scope="col">Status</th><th scope="col">Submitted</th><th scope="col">Action</th></tr></thead>
        <tbody>{reports.map((report) => <tr key={report._id}>
          <td><strong>{report.reason.replaceAll("_", " ")}</strong><p className="id muted">{report._id}</p></td>
          <td><Badge status={report.status} /></td><td>{date(report.createdAt)}</td>
          <td><button disabled={blocked} onClick={() => onSelect(report._id)} aria-label={`Review report ${report._id}`}>Review</button></td>
        </tr>)}</tbody>
      </table></div>}
    </ResourceState>
  </section>;
}

function ReportDetail({ id, onClose, onUpdated }: { id: string; onClose: () => void; onUpdated: () => void }) {
  const result = useResource<{ report: Report }>(`/reports/${encodeURIComponent(id)}`);
  const { blocked, mutate } = useAdmin();
  const [showEvidence, setShowEvidence] = useState(false);
  const [error, setError] = useState("");
  const report = result.data?.report;
  useEffect(() => { if (result.error?.status === 404) onClose(); }, [result.error, onClose]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const status = String(form.get("status"));
    const resolutionNote = String(form.get("resolutionNote") ?? "").trim();
    if (!resolutionNote) { setError("Enter a review note explaining your decision."); return; }
    setError("");
    const updated = await mutate(`/reports/${encodeURIComponent(id)}`, "PATCH", { status, resolutionNote }, `Mark report ${id} as ${status}?\nReview note: ${resolutionNote}`);
    if (updated) onUpdated();
  }

  async function deleteEvidence() {
    const updated = await mutate(`/reports/${encodeURIComponent(id)}/evidence`, "DELETE", undefined, `Remove the preserved evidence snapshot for report ${id} and queue managed image cleanup? This cannot be undone. Shared images are retained until no longer referenced. The report itself will be retained.`);
    if (updated) onUpdated();
  }

  return <div className="stack">
    <div><button onClick={onClose} disabled={blocked}>← Back to reports</button></div>
    <ResourceState {...result}>{report && <>
      <section className="panel stack">
        <div className="row between"><h2>{report.reason.replaceAll("_", " ")}</h2><Badge status={report.status} /></div>
        <p style={{ whiteSpace: "pre-wrap" }}>{report.description || "No additional description."}</p>
        <dl className="details">
          <div><dt>Report ID</dt><dd className="id">{report._id}</dd></div><div><dt>Ride match ID</dt><dd className="id">{report.riderMatchId}</dd></div>
          <div><dt>Reporter (application ID)</dt><dd className="id">{report.reporterId}</dd></div><div><dt>Reported user (application ID)</dt><dd className="id">{report.reportedUserId}</dd></div>
          <div><dt>Agreed price</dt><dd>PKR {report.agreedPrice}</dd></div><div><dt>Submitted</dt><dd>{date(report.createdAt)}</dd></div>
        </dl>
        {report.resolutionNote && <div className="message"><h3>Review note</h3><p style={{ whiteSpace: "pre-wrap" }}>{report.resolutionNote}</p></div>}
      </section>
      <section className="panel stack">
        <h2>Preserved chat evidence</h2>
        {report.evidenceDeletedAt ? <p className="muted">Evidence snapshot removed on {date(report.evidenceDeletedAt)}. Managed image cleanup is queued; shared references may defer provider deletion.</p> : !report.evidenceSnapshotId ? <p className="muted">No preserved evidence is attached to this report.</p> : <>
          <div className="row"><button disabled={blocked} onClick={() => setShowEvidence((value) => !value)}>{showEvidence ? "Hide evidence" : "View evidence"}</button>
            {report.status === "RESOLVED" && <button className="danger" disabled={blocked} onClick={deleteEvidence}>Delete evidence permanently</button>}
          </div>
          {showEvidence && <EvidenceView id={id} />}
          {report.status !== "RESOLVED" && <p className="muted">Evidence can only be deleted after a report is resolved.</p>}
        </>}
      </section>
      {(report.status === "SUBMITTED" || report.status === "VALIDATED") && <section className="panel stack">
        <h2>Review report</h2>
        <form onSubmit={submit}><fieldset disabled={blocked} className="stack">
          <label>New status<select name="status">
            {report.status === "SUBMITTED" ? <><option value="VALIDATED">Validate report</option><option value="REJECTED">Reject report</option></> : <option value="RESOLVED">Resolve report</option>}
          </select></label>
          <label>Review note<textarea name="resolutionNote" required maxLength={2000} defaultValue={report.resolutionNote ?? ""} /></label>
          {error && <p className="notice error" role="alert">{error}</p>}
          <div><button className="primary" type="submit">Review status change</button></div>
        </fieldset></form>
      </section>}
    </>}</ResourceState>
  </div>;
}

function EvidenceView({ id }: { id: string }) {
  const result = useResource<{ evidence: Evidence }>(`/reports/${encodeURIComponent(id)}/evidence`);
  return <ResourceState {...result}>
    <div className="stack">
      <p className="muted">Snapshot captured {date(result.data?.evidence.capturedAt)}</p>
      {!result.data?.evidence.messages.length ? <p className="muted">This snapshot has no messages.</p> : result.data.evidence.messages.map((message) => {
        const imageUrl = safeDocumentUrl(message.imageUrl);
        return <div className="message stack" key={message.originalMessageId}>
          <div><p className="id">Sender: {message.senderId}</p><p className="muted">{date(message.sentAt)}</p></div>
          {message.text && <p style={{ whiteSpace: "pre-wrap" }}>{message.text}</p>}
          {message.type === "IMAGE" && (imageUrl ? <a href={imageUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Open evidence image ↗</a> : <p className="muted">Image unavailable.</p>)}
        </div>;
      })}
    </div>
  </ResourceState>;
}

export function ConfigPanel() {
  const result = useResource<{ config: AdminConfig }>("/config");
  return <ResourceState {...result} layout="form">{result.data && <ConfigEditor initial={result.data.config} />}</ResourceState>;
}

function ConfigEditor({ initial }: { initial: AdminConfig }) {
  const { blocked, mutate } = useAdmin();
  const [current, setCurrent] = useState(initial);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    let patch: Partial<AdminConfig>;
    try { patch = configPatch(new FormData(event.currentTarget), current); }
    catch (cause) { setError((cause as Error).message); return; }
    const changes = Object.entries(patch).map(([key, value]) => `${key}: ${typeof value === "object" ? value.rateMultiplier : value}`).join("\n");
    const updated = await mutate<{ config: AdminConfig }>("/config", "PATCH", patch, `Apply these configuration changes? They affect live ride matching and pricing.\n\n${changes}`);
    if (updated) { setCurrent(updated.config); setRevision((value) => value + 1); }
  }
  return <section className="panel stack">
    <div><h2>Service configuration</h2><p className="muted">Current values loaded from the server. Only changed fields are saved.</p></div>
    <p className="muted">Destination Road Overhead is the inclusive Google road distance from the driver&apos;s destination to a rider destination requiring an overhead check. Pickup proximity applies when starting a ride. Corridor tolerance is retained for compatibility; search radii control legacy ranking and search state, not match visibility. Drivers decide pickup convenience.</p>
    <form key={revision} onSubmit={submit}><fieldset disabled={blocked} className="stack">
      <div className="grid">{configFields.map(([key, label, min, kind]) => <label key={key}>{label}
        <input name={key} type="number" required min={min} max={kind === "radius" ? 3000 : kind === "penalty" ? 5 : undefined} step={kind === "integer" || kind === "radius" ? 1 : "any"} defaultValue={key === "rateMultiplier" ? current.openDiscoveryPricing.rateMultiplier : current[key]} />
      </label>)}</div>
      {error && <p className="notice error" role="alert">{error}</p>}
      <div className="row"><button className="primary" type="submit">Review configuration changes</button><button type="reset" onClick={() => setError("")}>Reset changes</button></div>
    </fieldset></form>
  </section>;
}

export function AuditsPanel() {
  const result = useResource<{ audits: Audit[] }>("/audits");
  const [search, setSearch] = useState("");
  const [names, setNames] = useState<Record<string, string>>({});
  useEffect(() => {
    const controller = new AbortController();
    const ids = [...new Set((result.data?.audits ?? []).flatMap((audit) => [audit.actorAuthUserId, ...(audit.targetAuthUserId ? [audit.targetAuthUserId] : [])]))];
    async function loadNames() {
      for (let index = 0; index < ids.length && !controller.signal.aborted; index += 5) {
        const entries = await Promise.all(ids.slice(index, index + 5).map(async (id) => {
          try {
            const response = await request<{ success: true; data: UserDetail }>(`${adminRoot}/users/${encodeURIComponent(id)}`, { signal: controller.signal });
            return [id, response.data.user.fullName?.trim() || response.data.account?.name?.trim() || id] as const;
          } catch {
            // Optional enrichment: deleted or unavailable accounts retain their audit IDs.
            return [id, id] as const;
          }
        }));
        if (!controller.signal.aborted) setNames((current) => ({ ...current, ...Object.fromEntries(entries) }));
      }
    }
    void loadNames();
    return () => controller.abort();
  }, [result.data]);
  const audits = (result.data?.audits ?? []).filter((audit) => `${audit.action.replaceAll("_", " ")} ${audit.action} ${names[audit.actorAuthUserId] ?? ""} ${audit.actorAuthUserId} ${names[audit.targetAuthUserId ?? ""] ?? ""} ${audit.targetAuthUserId ?? ""} ${audit.details?.configKey ?? ""} ${audit.details?.reportId ?? ""} ${audit.details?.name ?? ""} ${audit.details?.universityId ?? ""} ${audit.reason}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <section className="panel stack">
    <div><h2>Admin action history</h2><p className="muted">User, university, configuration, and report actions. Loaded audit records, newest first. Names reflect current accounts; unavailable accounts show IDs.</p></div>
    <label>Search loaded audits<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Action, name, staff ID, target ID, or reason" /></label>
    <ResourceState {...result}>
      {!audits.length ? <p className="empty">No audit records match your search.</p> : <div className="table-wrap"><table>
        <thead><tr><th scope="col">Action / reason</th><th scope="col">Staff / target</th><th scope="col">Outcome</th><th scope="col">Time</th></tr></thead>
        <tbody>{audits.map((audit) => <tr key={audit._id}>
          <td><strong>{audit.action.replaceAll("_", " ")}</strong><p className="muted">{audit.reason}</p>{audit.failureMessage && <p>{audit.failureMessage}</p>}</td>
          <td><p title={audit.actorAuthUserId}>{names[audit.actorAuthUserId] ?? audit.actorAuthUserId}</p><p className="muted">{audit.actorRole} →</p><p title={audit.targetAuthUserId}>{audit.targetAuthUserId ? names[audit.targetAuthUserId] ?? audit.targetAuthUserId : audit.details?.configKey ?? audit.details?.reportId ?? audit.details?.name ?? audit.details?.universityId ?? "—"}</p></td>
          <td><Badge status={audit.outcome} /></td><td>{date(audit.createdAt)}</td>
        </tr>)}</tbody>
      </table></div>}
    </ResourceState>
  </section>;
}

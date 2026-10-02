"use client";

import { useState, type FormEvent } from "react";
import { ResourceState, useAdmin, usePaginatedResource, PageControls } from "./dashboard";

import type { University } from "@/lib/admin-api";

export function UniversitiesPanel() {
  const [revision, setRevision] = useState(0);
  return <UniversityCatalog key={revision} onUpdated={() => setRevision((value) => value + 1)} />;
}

function UniversityCatalog({ onUpdated }: { onUpdated: () => void }) {
  const result = usePaginatedResource<{ universities: University[] }>("/universities");
  const { blocked, mutate } = useAdmin();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<University>();
  const [replaceDomains, setReplaceDomains] = useState(false);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = editing?.name ?? String(form.get("name") ?? "").trim();
    if (!name || name.length > 200) { setError("Enter a university name between 1 and 200 characters."); return; }
    setError("");
    const emailDomains = String(form.get("emailDomains") ?? "").split(/[\s,]+/).filter(Boolean).map((domain) => domain.toLowerCase());
    if (replaceDomains && emailDomains.some((domain) => domain.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain))) {
      setError("Enter domain names only, without @, URLs, or wildcards."); return;
    }
    const updated = await mutate("/universities", "POST", { name, ...(replaceDomains ? { emailDomains: [...new Set(emailDomains)] } : {}) }, `${editing ? "Update" : "Add"} ${name}? ${replaceDomains ? emailDomains.length ? `Replace email domains with: ${emailDomains.join(", ")}.` : "Disable university email verification." : "Preserve existing email domains."} An existing or removed university with this name will be reused or restored.`);
    if (updated !== undefined) onUpdated();
  }

  async function remove(university: University) {
    const updated = await mutate(`/universities/${encodeURIComponent(university._id)}`, "DELETE", undefined,
      `Remove ${university.name} from student selection? Existing student records and verification history will be preserved.`);
    if (updated !== undefined) onUpdated();
  }

  return <section className="panel stack">
    <div><h2>University catalog</h2><p className="muted">Add universities or remove them from future student selection. Adding a removed name restores it.</p></div>
    <form key={editing?._id ?? "new"} onSubmit={add}><fieldset className="stack" disabled={blocked}>
      <label>University name<input name="name" required maxLength={200} defaultValue={editing?.name ?? ""} readOnly={!!editing} placeholder="Enter university name" /></label>
      <label><input type="checkbox" checked={replaceDomains} onChange={(event) => setReplaceDomains(event.target.checked)} /> Replace email domains</label>
      {replaceDomains && <label htmlFor="email-domains">Email domains<textarea id="email-domains" name="emailDomains" defaultValue={editing?.emailDomains?.join("\n") ?? ""} aria-describedby="domain-help" /></label>}
      <p id="domain-help" className="muted">Leave replacement unchecked to preserve mappings. Separate domains with commas or newlines; list subdomains explicitly. An empty replacement disables email verification.</p>
      {error && <p className="notice error" role="alert">{error}</p>}
      <div className="row"><button className="primary" type="submit">{editing ? "Save university" : "Add university"}</button>{editing && <button type="button" onClick={() => { setEditing(undefined); setReplaceDomains(false); setError(""); }}>Cancel edit</button>}</div>
    </fieldset></form>
    <ResourceState {...result}>
      {!result.data?.universities.length ? <p className="empty">No universities on this page. Add one above or return to a previous page.</p> :
        <ul className="stack" aria-label="Universities">{result.data.universities.map((university) =>
          <li className="row between" key={university._id}>
            <div style={{ overflowWrap: "anywhere", minWidth: 0 }}><strong>{university.name}</strong><p className="muted">{university.emailDomains?.length ? university.emailDomains.join(", ") : "Email verification unavailable"}</p></div>
            <button disabled={blocked} onClick={() => { setEditing(university); setReplaceDomains(false); setError(""); }} aria-label={`Edit ${university.name}`}>Edit</button>
            <button className="danger" disabled={blocked} onClick={() => remove(university)} aria-label={`Remove ${university.name}`}>Remove</button>
          </li>)}
        </ul>}
    </ResourceState>
    <PageControls result={result} />
  </section>;
}

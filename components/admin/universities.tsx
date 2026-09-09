"use client";

import { useState, type FormEvent } from "react";
import { ResourceState, useAdmin, useResource } from "./dashboard";

type University = { _id: string; name: string };

export function UniversitiesPanel() {
  const [revision, setRevision] = useState(0);
  return <UniversityCatalog key={revision} onUpdated={() => setRevision((value) => value + 1)} />;
}

function UniversityCatalog({ onUpdated }: { onUpdated: () => void }) {
  const result = useResource<{ universities: University[] }>("/universities");
  const { blocked, mutate } = useAdmin();
  const [error, setError] = useState("");

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    if (!name || name.length > 200) { setError("Enter a university name between 1 and 200 characters."); return; }
    setError("");
    const updated = await mutate("/universities", "POST", { name }, `Add ${name} to the university catalog? An existing or removed university with this name will be reused or restored.`);
    if (updated !== undefined) onUpdated();
  }

  async function remove(university: University) {
    const updated = await mutate(`/universities/${encodeURIComponent(university._id)}`, "DELETE", undefined,
      `Remove ${university.name} from student selection? Existing student records and verification history will be preserved.`);
    if (updated !== undefined) onUpdated();
  }

  return <section className="panel stack">
    <div><h2>University catalog</h2><p className="muted">Add universities or remove them from future student selection. Adding a removed name restores it.</p></div>
    <form onSubmit={add}><fieldset className="stack" disabled={blocked}>
      <label>University name<input name="name" required maxLength={200} placeholder="Enter university name" /></label>
      {error && <p className="notice error" role="alert">{error}</p>}
      <div><button className="primary" type="submit">Add university</button></div>
    </fieldset></form>
    <ResourceState {...result}>
      {!result.data?.universities.length ? <p className="empty">No universities available. Add one above.</p> :
        <ul className="stack" aria-label="Universities">{result.data.universities.map((university) =>
          <li className="row between" key={university._id}>
            <strong style={{ overflowWrap: "anywhere", minWidth: 0 }}>{university.name}</strong>
            <button className="danger" disabled={blocked} onClick={() => remove(university)} aria-label={`Remove ${university.name}`}>Remove</button>
          </li>)}
        </ul>}
    </ResourceState>
  </section>;
}

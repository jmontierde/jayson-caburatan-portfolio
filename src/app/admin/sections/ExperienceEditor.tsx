"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, Field, Input, Textarea, Button, parseList, parseLines } from "../ui";

type Draft = {
  role: string;
  company: string;
  location: string;
  dateRange: string;
  tags: string;
  bullets: string;
  sortOrder: number;
};

const empty: Draft = {
  role: "",
  company: "",
  location: "",
  dateRange: "",
  tags: "",
  bullets: "",
  sortOrder: 0,
};

function Row({
  token,
  initial,
  id,
}: {
  token: string;
  initial: Draft;
  id?: Id<"experience">;
}) {
  const [form, setForm] = useState<Draft>(initial);
  const create = useMutation(api.experience.create);
  const update = useMutation(api.experience.update);
  const remove = useMutation(api.experience.remove);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const payload = {
        token,
        role: form.role,
        company: form.company,
        location: form.location,
        dateRange: form.dateRange,
        tags: parseList(form.tags),
        bullets: parseLines(form.bullets),
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (id) await update({ id, ...payload });
      else await create(payload);
      setStatus("Saved");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    if (!id) return;
    if (!confirm(`Delete "${form.role} @ ${form.company}"?`)) return;
    await remove({ token, id });
  }

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Role">
          <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </Field>
        <Field label="Company">
          <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </Field>
        <Field label="Date range">
          <Input value={form.dateRange} onChange={(e) => setForm({ ...form, dateRange: e.target.value })} />
        </Field>
        <Field label="Tags (comma-separated)">
          <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </Field>
        <Field label="Sort order">
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </Field>
      </div>
      <Field label="Bullets (one per line)">
        <Textarea rows={5} value={form.bullets} onChange={(e) => setForm({ ...form, bullets: e.target.value })} />
      </Field>
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={busy}>
          {busy ? "Saving..." : id ? "Save" : "Create"}
        </Button>
        {id && (
          <Button onClick={del} variant="danger">
            Delete
          </Button>
        )}
        {status && <span className="text-xs text-[#BDBDBD]">{status}</span>}
      </div>
    </Card>
  );
}

export default function ExperienceEditor({ token }: { token: string }) {
  const items = useQuery(api.experience.list);
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Experience</h2>
        <Button variant="ghost" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add experience"}
        </Button>
      </div>
      {adding && <Row token={token} initial={{ ...empty, sortOrder: items ? items.length : 0 }} />}
      {items?.map((it) => (
        <Row
          key={it._id}
          token={token}
          id={it._id}
          initial={{
            role: it.role,
            company: it.company,
            location: it.location,
            dateRange: it.dateRange,
            tags: it.tags.join(", "),
            bullets: it.bullets.join("\n"),
            sortOrder: it.sortOrder,
          }}
        />
      ))}
    </div>
  );
}

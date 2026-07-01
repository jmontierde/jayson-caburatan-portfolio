"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, Field, Input, Textarea, Button } from "../ui";

type Draft = { title: string; description: string; sortOrder: number };
const empty: Draft = { title: "", description: "", sortOrder: 0 };

function Row({ token, initial, id }: { token: string; initial: Draft; id?: Id<"services"> }) {
  const [form, setForm] = useState<Draft>(initial);
  const create = useMutation(api.services.create);
  const update = useMutation(api.services.update);
  const remove = useMutation(api.services.remove);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const payload = {
        token,
        title: form.title,
        description: form.description,
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
    if (!confirm(`Delete "${form.title}"?`)) return;
    await remove({ token, id });
  }

  return (
    <Card>
      <Field label="Title (you can include an emoji, e.g. '🎨 UI/UX Design')">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Description">
        <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <Field label="Sort order">
        <Input
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
        />
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

export default function ServicesEditor({ token }: { token: string }) {
  const items = useQuery(api.services.list);
  const [adding, setAdding] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Services</h2>
        <Button variant="ghost" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add service"}
        </Button>
      </div>
      {adding && <Row token={token} initial={{ ...empty, sortOrder: items ? items.length : 0 }} />}
      {items?.map((it) => (
        <Row
          key={it._id}
          token={token}
          id={it._id}
          initial={{ title: it.title, description: it.description, sortOrder: it.sortOrder }}
        />
      ))}
    </div>
  );
}

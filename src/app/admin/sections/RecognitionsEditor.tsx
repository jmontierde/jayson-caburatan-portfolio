"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, Field, Input, Button } from "../ui";

type Draft = { title: string; description: string; year: string; sortOrder: number };
const empty: Draft = { title: "", description: "", year: "", sortOrder: 0 };

function Row({ token, initial, id }: { token: string; initial: Draft; id?: Id<"recognitions"> }) {
  const [form, setForm] = useState<Draft>(initial);
  const create = useMutation(api.recognitions.create);
  const update = useMutation(api.recognitions.update);
  const remove = useMutation(api.recognitions.remove);
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
        year: form.year,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Year">
          <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        </Field>
        <Field label="Description">
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Sort order">
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </Field>
      </div>
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

export default function RecognitionsEditor({ token }: { token: string }) {
  const items = useQuery(api.recognitions.list);
  const [adding, setAdding] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Recognitions</h2>
        <Button variant="ghost" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add recognition"}
        </Button>
      </div>
      {adding && <Row token={token} initial={{ ...empty, sortOrder: items ? items.length : 0 }} />}
      {items?.map((it) => (
        <Row
          key={it._id}
          token={token}
          id={it._id}
          initial={{
            title: it.title,
            description: it.description,
            year: it.year,
            sortOrder: it.sortOrder,
          }}
        />
      ))}
    </div>
  );
}

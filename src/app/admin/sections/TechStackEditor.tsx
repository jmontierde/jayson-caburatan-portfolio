"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, Field, Input, Button } from "../ui";
import ImageUpload from "../ImageUpload";

type Draft = { name: string; img: string; sortOrder: number };
const empty: Draft = { name: "", img: "", sortOrder: 0 };

function Row({ token, initial, id }: { token: string; initial: Draft; id?: Id<"techStack"> }) {
  const [form, setForm] = useState<Draft>(initial);
  const create = useMutation(api.techStack.create);
  const update = useMutation(api.techStack.update);
  const remove = useMutation(api.techStack.remove);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const payload = {
        token,
        name: form.name,
        img: form.img,
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
    if (!confirm(`Delete "${form.name}"?`)) return;
    await remove({ token, id });
  }

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Name">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Icon">
          <ImageUpload token={token} value={form.img} onChange={(url) => setForm({ ...form, img: url })} />
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

export default function TechStackEditor({ token }: { token: string }) {
  const items = useQuery(api.techStack.list);
  const [adding, setAdding] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Tech Stack</h2>
        <Button variant="ghost" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add tech"}
        </Button>
      </div>
      {adding && <Row token={token} initial={{ ...empty, sortOrder: items ? items.length : 0 }} />}
      {items?.map((it) => (
        <Row
          key={it._id}
          token={token}
          id={it._id}
          initial={{ name: it.name, img: it.img, sortOrder: it.sortOrder }}
        />
      ))}
    </div>
  );
}

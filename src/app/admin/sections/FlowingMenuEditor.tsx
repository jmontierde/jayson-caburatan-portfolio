"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, Field, Input, Button } from "../ui";
import ImageUpload from "../ImageUpload";

type Draft = { text: string; image: string; link: string; sortOrder: number };
const empty: Draft = { text: "", image: "", link: "#projects", sortOrder: 0 };

function Row({ token, initial, id }: { token: string; initial: Draft; id?: Id<"flowingMenu"> }) {
  const [form, setForm] = useState<Draft>(initial);
  const create = useMutation(api.flowingMenu.create);
  const update = useMutation(api.flowingMenu.update);
  const remove = useMutation(api.flowingMenu.remove);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const payload = {
        token,
        text: form.text,
        image: form.image,
        link: form.link,
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
    if (!confirm(`Delete "${form.text}"?`)) return;
    await remove({ token, id });
  }

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Text label">
          <Input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
        </Field>
        <Field label="Image">
          <ImageUpload token={token} value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
        </Field>
        <Field label="Link target (e.g. #projects)">
          <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
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

export default function FlowingMenuEditor({ token }: { token: string }) {
  const items = useQuery(api.flowingMenu.list);
  const [adding, setAdding] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Hero Flowing Menu</h2>
        <Button variant="ghost" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add item"}
        </Button>
      </div>
      {adding && <Row token={token} initial={{ ...empty, sortOrder: items ? items.length : 0 }} />}
      {items?.map((it) => (
        <Row
          key={it._id}
          token={token}
          id={it._id}
          initial={{
            text: it.text,
            image: it.image,
            link: it.link,
            sortOrder: it.sortOrder,
          }}
        />
      ))}
    </div>
  );
}

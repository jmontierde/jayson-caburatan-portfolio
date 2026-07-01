"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, Field, Input, Button } from "../ui";

type Draft = { icon: string; href: string; label: string; sortOrder: number };
const empty: Draft = { icon: "github", href: "", label: "", sortOrder: 0 };

function Row({ token, initial, id }: { token: string; initial: Draft; id?: Id<"socials"> }) {
  const [form, setForm] = useState<Draft>(initial);
  const create = useMutation(api.socials.create);
  const update = useMutation(api.socials.update);
  const remove = useMutation(api.socials.remove);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const payload = {
        token,
        icon: form.icon,
        href: form.href,
        label: form.label,
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
    if (!confirm(`Delete "${form.label}"?`)) return;
    await remove({ token, id });
  }

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Icon (github | linkedin | mail)">
          <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </Field>
        <Field label="Label (alt text)">
          <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        </Field>
        <Field label="URL (use mailto: for email)">
          <Input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} />
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

export default function SocialsEditor({ token }: { token: string }) {
  const items = useQuery(api.socials.list);
  const [adding, setAdding] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Social Links</h2>
        <Button variant="ghost" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add social"}
        </Button>
      </div>
      {adding && <Row token={token} initial={{ ...empty, sortOrder: items ? items.length : 0 }} />}
      {items?.map((it) => (
        <Row
          key={it._id}
          token={token}
          id={it._id}
          initial={{
            icon: it.icon,
            href: it.href,
            label: it.label,
            sortOrder: it.sortOrder,
          }}
        />
      ))}
    </div>
  );
}

"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, Field, Input, Textarea, Button, parseList } from "../ui";
import ImageUpload from "../ImageUpload";

type Draft = {
  title: string;
  subTitle: string;
  description: string;
  img: string;
  mobileImg: string;
  video: string;
  projectUrl: string;
  techStack: string;
  sortOrder: number;
};

const empty: Draft = {
  title: "",
  subTitle: "",
  description: "",
  img: "",
  mobileImg: "",
  video: "",
  projectUrl: "",
  techStack: "",
  sortOrder: 0,
};

function ProjectRow({
  token,
  initial,
  id,
}: {
  token: string;
  initial: Draft;
  id?: Id<"projects">;
}) {
  const [form, setForm] = useState<Draft>(initial);
  const create = useMutation(api.projects.create);
  const update = useMutation(api.projects.update);
  const remove = useMutation(api.projects.remove);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const payload = {
        token,
        title: form.title,
        subTitle: form.subTitle,
        description: form.description,
        img: form.img,
        mobileImg: form.mobileImg || undefined,
        video: form.video || undefined,
        projectUrl: form.projectUrl,
        techStack: parseList(form.techStack),
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
        <Field label="Subtitle">
          <Input value={form.subTitle} onChange={(e) => setForm({ ...form, subTitle: e.target.value })} />
        </Field>
        <Field label="Image">
          <ImageUpload token={token} value={form.img} onChange={(url) => setForm({ ...form, img: url })} />
        </Field>
        <Field label="Mobile image (optional)">
          <ImageUpload token={token} value={form.mobileImg} onChange={(url) => setForm({ ...form, mobileImg: url })} />
        </Field>
        <Field label="Video path (optional, overrides image)">
          <Input value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} />
        </Field>
        <Field label="Project URL">
          <Input value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} />
        </Field>
        <Field label="Sort order (lower = first)">
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </Field>
        <Field label="Tech stack (comma-separated)">
          <Input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
        </Field>
      </div>
      <Field label="Description">
        <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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

export default function ProjectsEditor({ token }: { token: string }) {
  const items = useQuery(api.projects.list);
  const [adding, setAdding] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Projects</h2>
        <Button variant="ghost" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "+ Add project"}
        </Button>
      </div>
      {adding && (
        <ProjectRow
          token={token}
          initial={{ ...empty, sortOrder: items ? items.length : 0 }}
        />
      )}
      {items?.map((p) => (
        <ProjectRow
          key={p._id}
          token={token}
          id={p._id}
          initial={{
            title: p.title,
            subTitle: p.subTitle,
            description: p.description,
            img: p.img,
            mobileImg: p.mobileImg ?? "",
            video: p.video ?? "",
            projectUrl: p.projectUrl,
            techStack: p.techStack.join(", "),
            sortOrder: p.sortOrder,
          }}
        />
      ))}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, Field, Input, Textarea, Button, parseList } from "../ui";
import ImageUpload from "../ImageUpload";

export default function HeaderEditor({ token }: { token: string }) {
  const data = useQuery(api.header.get);
  const upsert = useMutation(api.header.upsert);
  const [form, setForm] = useState({
    imageUrl: "",
    availability: "",
    location: "",
    bioBold: "",
    bioRest: "",
    techTags: "",
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setForm({
        imageUrl: data.imageUrl,
        availability: data.availability,
        location: data.location,
        bioBold: data.bioBold,
        bioRest: data.bioRest,
        techTags: data.techTags.join(", "),
      });
    }
  }, [data]);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      await upsert({
        token,
        imageUrl: form.imageUrl,
        availability: form.availability,
        location: form.location,
        bioBold: form.bioBold,
        bioRest: form.bioRest,
        techTags: parseList(form.techTags),
      });
      setStatus("Saved");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-bold">Header / Hero</h2>
      <Field label="Profile image">
        <ImageUpload
          token={token}
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
        />
      </Field>
      <Field label="Availability badge">
        <Input
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value })}
        />
      </Field>
      <Field label="Location">
        <Input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </Field>
      <Field label="Bio (bold opening)">
        <Input
          value={form.bioBold}
          onChange={(e) => setForm({ ...form, bioBold: e.target.value })}
        />
      </Field>
      <Field label="Bio (rest)">
        <Textarea
          rows={4}
          value={form.bioRest}
          onChange={(e) => setForm({ ...form, bioRest: e.target.value })}
        />
      </Field>
      <Field label="Tech tags (comma-separated)">
        <Input
          value={form.techTags}
          onChange={(e) => setForm({ ...form, techTags: e.target.value })}
        />
      </Field>
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        {status && <span className="text-xs text-[#BDBDBD]">{status}</span>}
      </div>
    </Card>
  );
}

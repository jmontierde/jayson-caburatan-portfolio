"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, Field, Input, Button, parseList } from "../ui";

export default function EducationEditor({ token }: { token: string }) {
  const data = useQuery(api.education.get);
  const upsert = useMutation(api.education.upsert);
  const [form, setForm] = useState({
    degree: "",
    school: "",
    location: "",
    honors: "",
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setForm({
        degree: data.degree,
        school: data.school,
        location: data.location,
        honors: data.honors.join(", "),
      });
    }
  }, [data]);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      await upsert({
        token,
        degree: form.degree,
        school: form.school,
        location: form.location,
        honors: parseList(form.honors),
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
      <h2 className="text-xl font-bold">Education</h2>
      <Field label="Degree">
        <Input
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
        />
      </Field>
      <Field label="School">
        <Input
          value={form.school}
          onChange={(e) => setForm({ ...form, school: e.target.value })}
        />
      </Field>
      <Field label="Location">
        <Input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </Field>
      <Field label="Honors (comma-separated)">
        <Input
          value={form.honors}
          onChange={(e) => setForm({ ...form, honors: e.target.value })}
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

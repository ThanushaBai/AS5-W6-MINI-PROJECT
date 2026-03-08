"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/types/event";

type EditEventFormProps = {
  locale: string;
  event: Event;
};

export default function EditEventForm({ locale, event }: EditEventFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
    category: event.category,
    organizer: event.organizer,
    posterUrl: event.posterUrl
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const response = await fetch(`/api/events/${event.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (response.status === 401) {
      router.replace(`/login?from=/${locale}/events/${event.slug}/edit`);
      return;
    }

    if (!response.ok) {
      const body = await response.json();
      setError(body?.error || "Failed to update event");
      setSaving(false);
      return;
    }

    router.replace(`/${locale}/events/${event.slug}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-2xl space-y-4 rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
      <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-md border border-rose-200 px-3 py-2" />
      <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-md border border-rose-200 px-3 py-2" rows={4} />
      <input type="date" value={form.date.split("T")[0]} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full rounded-md border border-rose-200 px-3 py-2" />
      <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="w-full rounded-md border border-rose-200 px-3 py-2" />
      <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-md border border-rose-200 px-3 py-2" />
      <input value={form.organizer} onChange={(e) => setForm((p) => ({ ...p, organizer: e.target.value }))} className="w-full rounded-md border border-rose-200 px-3 py-2" />
      <input value={form.posterUrl} onChange={(e) => setForm((p) => ({ ...p, posterUrl: e.target.value }))} className="w-full rounded-md border border-rose-200 px-3 py-2" />

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button type="submit" disabled={saving} className="rounded-md bg-rose-500 px-4 py-2 text-white">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useTranslations } from "next-intl";

type EventFormValues = {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  organizer: string;
};

type EventFormProps = {
  locale: string;
};

export default function EventForm({ locale }: EventFormProps) {
  const t = useTranslations("EventForm");
  const router = useRouter();

  const [form, setForm] = useState<EventFormValues>({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    organizer: ""
  });

  const [poster, setPoster] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const todayMin = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formSchema = z.object({
      title: z.string().min(5, t("errors.titleMin")),
      description: z.string().min(20, t("errors.descriptionMin")),
      date: z.string().refine((value) => new Date(value) > new Date(), t("errors.futureDate")),
      location: z.string().min(3, t("errors.locationRequired")),
      category: z.string().min(3, t("errors.categoryRequired")),
      organizer: z.string().min(3, t("errors.organizerRequired"))
    });

    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || t("errors.fixForm"));
      return;
    }

    if (!poster) {
      setError(t("errors.posterRequired"));
      return;
    }

    if (!poster.type.startsWith("image/")) {
      setError(t("errors.posterImage"));
      return;
    }

    if (poster.size > 3 * 1024 * 1024) {
      setError(t("errors.posterMax"));
      return;
    }

    setSubmitting(true);
    setError("");

    let posterUrl = "";

    const uploadData = new FormData();
    uploadData.append("file", poster);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: uploadData
    });

    if (!uploadRes.ok) {
      const body = await uploadRes.json();
      setError(body?.error || t("errors.uploadFailed"));
      setSubmitting(false);
      return;
    }

    const uploaded = await uploadRes.json();
    posterUrl = uploaded.url;

    const createRes = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...parsed.data, posterUrl })
    });

    if (!createRes.ok) {
      const body = await createRes.json();
      if (createRes.status === 401) {
        router.replace(`/login?from=/${locale}/create-event`);
        router.refresh();
        return;
      }
      setError(body?.error || t("errors.createFailed"));
      setSubmitting(false);
      return;
    }

    const event = await createRes.json();
    router.push(`/${locale}/events/${event.slug}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-800">{t("title")}</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-800">{t("description")}</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={5} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400" />
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium text-slate-800">{t("date")}</label>
          <input id="date" type="date" min={todayMin} name="date" value={form.date} onChange={handleChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900" />
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-800">{t("location")}</label>
          <input id="location" name="location" value={form.location} onChange={handleChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400" />
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-800">{t("category")}</label>
          <input id="category" name="category" value={form.category} onChange={handleChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400" />
        </div>

        <div>
          <label htmlFor="organizer" className="mb-1 block text-sm font-medium text-slate-800">{t("organizer")}</label>
          <input id="organizer" name="organizer" value={form.organizer} onChange={handleChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="poster" className="mb-1 block text-sm font-medium text-slate-800">{t("poster")}</label>
          <input id="poster" type="file" accept="image/*" onChange={(e) => setPoster(e.target.files?.[0] || null)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-slate-700" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="rounded-md bg-rose-500 px-4 py-2 font-medium text-white hover:bg-rose-600 disabled:opacity-60">
        {submitting ? t("creating") : t("create")}
      </button>
    </form>
  );
}

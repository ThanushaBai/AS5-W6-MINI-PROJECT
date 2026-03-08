"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type EventActionsProps = {
  locale: string;
  slug: string;
  readMoreLabel: string;
};

export default function EventActions({ locale, slug, readMoreLabel }: EventActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/events/${slug}`, {
      method: "DELETE"
    });

    if (response.status === 401) {
      router.replace(`/auth?from=/${locale}/events`);
      return;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      window.alert(body?.error || "Failed to delete event");
      return;
    }

    router.replace(`/${locale}/events`);
    router.refresh();
  };

  return (
    <div className="mt-4 flex items-center gap-3 text-sm">
      <Link href={`/${locale}/events/${slug}`} className="text-rose-600 hover:underline">{readMoreLabel}</Link>
      <Link href={`/${locale}/events/${slug}/edit`} className="text-slate-700 hover:underline">Edit</Link>
      <button type="button" onClick={handleDelete} className="text-rose-700 hover:underline">Delete</button>
    </div>
  );
}

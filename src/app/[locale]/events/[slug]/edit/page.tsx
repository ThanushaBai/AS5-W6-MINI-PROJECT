import { notFound } from "next/navigation";
import { getServerBaseUrl } from "@/lib/api";
import EditEventForm from "@/components/EditEventForm";
import { Event } from "@/types/event";

async function getEvent(slug: string) {
  const baseUrl = await getServerBaseUrl();
  const response = await fetch(`${baseUrl}/api/events/${slug}`, { cache: "no-store" });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as Event;
}

export default async function EditEventPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Edit Event</h1>
      <p className="mt-2 text-slate-600">Update event details and save changes.</p>
      <EditEventForm locale={locale} event={event} />
    </main>
  );
}
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/db";
import { Event } from "@/types/event";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";

async function getEvent(slug: string) {
  const getCachedEvent = unstable_cache(
    async () => getEventBySlug(slug),
    ["event-by-slug", slug],
    { revalidate: 60, tags: ["events", `event:${slug}`] }
  );

  return (await getCachedEvent()) as Event | null;
}

export default async function EventPage({
  params
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("EventDetails");
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Image
          src={event.posterUrl}
          alt={event.title}
          width={1200}
          height={630}
          priority
          sizes="100vw"
          quality={80}
          className="h-72 w-full object-cover"
        />

        <div className="space-y-3 p-6">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-slate-700">{event.description}</p>
          <p><strong>{t("date")}:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>{t("location")}:</strong> {event.location}</p>
          <p><strong>{t("organizer")}:</strong> {event.organizer}</p>
          <p><strong>{t("category")}:</strong> {event.category}</p>
        </div>
      </div>
    </main>
  );
}

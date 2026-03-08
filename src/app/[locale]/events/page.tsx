import EventCard from "@/components/EventCard";
import { getEvents as getEventsFromDb } from "@/lib/db";
import { Event } from "@/types/event";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";

const getCachedEvents = unstable_cache(
  async () => getEventsFromDb(),
  ["events-list"],
  { revalidate: 60, tags: ["events"] }
);

export default async function EventsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("EventsPage");
  const events = (await getCachedEvents()) as Event[];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-slate-600">{t("subtitle")}</p>

      {events.length === 0 && <p className="mt-6">{t("empty")}</p>}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} locale={locale} viewDetailsLabel={t("viewDetails")} />
        ))}
      </div>
    </main>
  );
}

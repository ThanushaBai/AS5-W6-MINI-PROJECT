import { getTranslations } from "next-intl/server";
import { getEventCount, getRecentEvents, getUpcomingEventCount, getUserCount } from "@/lib/db";
import Link from "next/link";

export default async function AdminPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("AdminPage");
  const [totalEvents, totalUsers, upcomingEvents, recentEvents] = await Promise.all([
    getEventCount(),
    getUserCount(),
    getUpcomingEventCount(),
    getRecentEvents(6)
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-slate-600">{t("subtitle")}</p>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-rose-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total Events</p>
          <p className="mt-1 text-2xl font-bold">{totalEvents}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-white p-4">
          <p className="text-sm text-slate-500">Upcoming Events</p>
          <p className="mt-1 text-2xl font-bold">{upcomingEvents}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-white p-4">
          <p className="text-sm text-slate-500">Registered Users</p>
          <p className="mt-1 text-2xl font-bold">{totalUsers}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Recent Events</h2>
        {recentEvents.length === 0 ? (
          <p className="mt-3 text-slate-600">No events available yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {recentEvents.map((event) => (
              <li key={event.id} className="rounded-md border border-rose-100 bg-white px-3 py-2">
                <Link href={`/${locale}/events/${event.slug}`} className="font-medium text-slate-800 hover:text-rose-600">
                  {event.title}
                </Link>
                <p className="text-sm text-slate-500">{event.location} • {event.date}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

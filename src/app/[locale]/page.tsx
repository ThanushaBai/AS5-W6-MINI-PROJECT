import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Home");

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-slate-600">{t("subtitle")}</p>

      <div className="mt-6 flex gap-3">
        <Link href={`/${locale}/events`} className="rounded-md border border-slate-300 px-4 py-2">
          {t("browseEvents")}
        </Link>
        <Link href={`/${locale}/create-event`} className="rounded-md bg-rose-500 px-4 py-2 text-white hover:bg-rose-600">
          {t("createEvent")}
        </Link>
      </div>
    </main>
  );
}

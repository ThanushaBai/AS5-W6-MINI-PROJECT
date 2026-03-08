import EventForm from "@/components/EventForm";
import LogoutButton from "@/components/LogoutButton";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

export default async function CreateEventPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("CreateEventPage");
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const isLoggedIn = token ? Boolean(verifyAuthToken(token)) : false;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        {isLoggedIn && <LogoutButton />}
      </div>
      <p className="mt-2 text-slate-600">{t("subtitle")}</p>
      <EventForm locale={locale} />
    </main>
  );
}

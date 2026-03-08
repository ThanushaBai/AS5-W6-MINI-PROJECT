"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/config/locales";
import { useRouter } from "next/navigation";

const languageNames: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  fr: "French",
  kn: "Kannada",
  ar: "Arabic"
};

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();

  return (
    <header className="border-b border-slate-200 bg-white/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="font-semibold text-slate-900">
          {t("home")}
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <select
            value={locale}
            onChange={(e) => router.push(`/${e.target.value}`)}
            aria-label="Select language"
            className="rounded-md border border-rose-200 bg-white px-2 py-1 text-slate-700"
          >
            {locales.map((lang) => (
              <option key={lang} value={lang}>
                {languageNames[lang] ?? lang.toUpperCase()}
              </option>
            ))}
          </select>
          <Link href={`/${locale}/events`} className="text-slate-700 hover:text-slate-900">
            {t("events")}
          </Link>
          <Link href={`/${locale}/create-event`} className="rounded-md bg-rose-500 px-3 py-1.5 text-white hover:bg-rose-600">
            {t("createEvent")}
          </Link>
          <Link href="/auth" className="text-slate-700 hover:text-slate-900">
            Login/Register
          </Link>
        </div>
      </nav>
    </header>
  );
}

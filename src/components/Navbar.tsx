"use client"

import Link from "next/link"
import {useTranslations} from "next-intl"

export default function Navbar() {

  const t = useTranslations("Navbar")

  return (
    <nav>

      <Link href="/">
        {t("home")}
      </Link>

      <Link href="/events/create">
        {t("createEvent")}
      </Link>

    </nav>
  )
}
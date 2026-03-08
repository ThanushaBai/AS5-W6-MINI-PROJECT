import { redirect } from "next/navigation";

export default async function LegacyCreateEventPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/create-event`);
}
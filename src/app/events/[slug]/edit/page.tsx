import { redirect } from "next/navigation";

export default async function EventEditRedirectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/en/events/${slug}/edit`);
}
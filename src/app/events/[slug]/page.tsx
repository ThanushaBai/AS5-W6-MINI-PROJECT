import { redirect } from "next/navigation";

export default async function EventRedirectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/en/events/${slug}`);
}
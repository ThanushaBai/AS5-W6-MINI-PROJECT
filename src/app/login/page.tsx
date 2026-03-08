import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  redirect(from ? `/auth?from=${encodeURIComponent(from)}` : "/auth");
}

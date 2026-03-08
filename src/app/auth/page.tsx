import AuthPanel from "@/components/AuthPanel";

export default function AuthPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold">Authentication</h1>
      <p className="mt-2 text-slate-600">Use one form page to login or register.</p>
      <AuthPanel />
    </main>
  );
}

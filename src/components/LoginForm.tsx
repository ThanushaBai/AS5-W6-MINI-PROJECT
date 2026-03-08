"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body?.error || "Login failed");
      setLoading(false);
      return;
    }

    const redirectTo = searchParams.get("from") || "/en/create-event";
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium">Username or Email</label>
        <input
          id="username"
          value={username}
          placeholder="Enter username or email"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-rose-500 px-4 py-2 font-medium text-white hover:bg-rose-600 disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm text-slate-600">
        Don&apos;t have an account? <Link href="/auth" className="text-rose-600">Register</Link>
      </p>
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body?.error || "Registration failed");
      setLoading(false);
      return;
    }

    router.replace("/auth");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium">Username</label>
        <input
          id="username"
          value={username}
          placeholder="Create username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          placeholder="Create password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
        />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-rose-500 px-4 py-2 font-medium text-white hover:bg-rose-600 disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Register"}
      </button>

      <p className="text-sm text-slate-600">
        Already have an account? <Link href="/auth" className="text-rose-600">Login</Link>
      </p>
    </form>
  );
}

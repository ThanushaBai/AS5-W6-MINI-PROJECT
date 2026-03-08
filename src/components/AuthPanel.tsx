"use client";

import { Suspense, useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function AuthPanel() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="mt-8 rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-md px-4 py-2 text-sm ${mode === "login" ? "bg-rose-500 text-white" : "border border-rose-200 text-slate-700"}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-md px-4 py-2 text-sm ${mode === "register" ? "bg-rose-500 text-white" : "border border-rose-200 text-slate-700"}`}
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <Suspense fallback={<p className="mt-4 text-sm text-slate-500">Loading login...</p>}>
          <LoginForm />
        </Suspense>
      ) : (
        <RegisterForm />
      )}
    </div>
  );
}
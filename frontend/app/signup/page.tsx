"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { access_token } = await api.signup({
        workspace_name: workspaceName, full_name: fullName, email, password,
      });
      localStorage.setItem("access_token", access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-8 font-bold">Set up your workspace</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Workspace name (your show or agency)" value={workspaceName} onChange={setWorkspaceName} />
        <Field label="Your name" value={fullName} onChange={setFullName} />
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error && <p className="text-coral text-sm">{error}</p>}
        <button
          disabled={busy}
          className="w-full bg-lime text-void font-semibold px-5 py-3 rounded-sm hover:bg-lime-dim transition-colors disabled:opacity-50"
        >
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-sm text-ink-dim mt-6">
        Already have an account? <Link href="/login" className="text-lime">Log in</Link>
      </p>
    </main>
  );
}

function Field({
  label, value, onChange, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-ink-dim mb-1 block">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line rounded-sm px-3 py-2 bg-surface focus:border-lime outline-none"
      />
    </label>
  );
}

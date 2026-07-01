"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAdminAuth } from "../AdminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setToken } = useAdminAuth();
  const login = useMutation(api.auth.login);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await login({ password });
      setToken(token);
      router.push("/admin");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg.includes("Invalid password") ? "Wrong password" : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm flex flex-col gap-4 bg-[#15151a] border border-[#2a2a30] rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold">Admin login</h1>
        <p className="text-sm text-[#8B8B8B]">Enter your admin password to edit content.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="rounded-lg bg-[#0a0a0e] border border-[#2a2a30] px-4 py-3 outline-none focus:border-[#EDFF21]/50"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="rounded-lg bg-[#EDFF21] text-black font-semibold py-3 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

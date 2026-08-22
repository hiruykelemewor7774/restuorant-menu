"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WaiterLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/waiter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Login አልተሳካም");
        setLoading(false);
        return;
      }

      router.replace("/waiter");
      router.refresh();
    } catch {
      setError("የኔትወርክ ችግር ተፈጥሯል፣ እንደገና ሞክር");
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-slate-100 text-gray-800 mr-10">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl shadow-md p-8 bg-white w-full max-w-sm text-gray-800 border border-slate-200"
      >
        <h1 className="text-xl font-bold pb-3 text-center">
          የዌይተር መግቢያ
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <label className="block pb-3">
          <span className="text-sm font-medium text-white">Username</span>
          <input
            type="text"
            value={username}
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm font-medium text-white">Password</span>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-white rounded-md py-2 font-medium hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? "እየገባ ነው..." : "ግባ"}
        </button>
      </form>
    </div>
  );
}
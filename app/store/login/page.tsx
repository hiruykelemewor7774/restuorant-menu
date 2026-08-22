"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StoreLoginPage() {
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
      const res = await fetch("/api/store/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል");
        setLoading(false);
        return;
      }

      router.push("/store");
      router.refresh();
    } catch {
      setError("የኔትወርክ ችግር ተፈጥሯል");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8">
        <h1 className="text-xl font-bold text-white pb-3">
          🏪 Store Login
        </h1>

        <input
          type="text"
          placeholder="የተጠቃሚ ስም"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 px-4 py-2.5 bg-slate-100 border border-gray-300 rounded-lg text-gray-800"
        />

        <input
          type="password"
          placeholder="የይለፍ ቃል"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2.5 bg-slate-100 border border-gray-300 rounded-lg text-gray-800"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 rounded-lg disabled:opacity-50"
        >
          {loading ? "entering..." : "enter"}
        </button>
      </form>
    </div>
  );
}
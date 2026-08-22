"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReceptionistLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/receptionist/login", {
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

    router.replace("/receptionist/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="border border-slate-200 rounded-xl text-gray-800 shadow-md p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          🛎️ Receptionist login
        </h1>

        {error && (
          <div className="bg-red-900/50 text-red-300 text-sm rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full mb-3 px-3 py-2 border border-gray-700 rounded-md text-gray-800"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full mb-5 px-3 py-2 border border-gray-700 rounded-md text-gray-800"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black rounded-md py-2 font-semibold hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "እየገባ ነው..." : "ግባ"}
        </button>
      </form>
    </div>
  );
}
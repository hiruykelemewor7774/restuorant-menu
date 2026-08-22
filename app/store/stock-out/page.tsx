"use client";

import { useEffect, useState } from "react";

type StoreItem = { id: string; name: string; unit: string; quantity: number };

export default function StockOutPage() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [form, setForm] = useState({ itemId: "", quantity: "", reason: "" });
  const [message, setMessage] = useState("");

  async function loadItems() {
    const res = await fetch("/api/store/items", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setItems(data.items);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadItems();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/store/stock-out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!data.success) {
      setMessage(data.message || "ስህተት ተፈጥሯል");
      return;
    }
    setMessage("✅ ወጪ ተመዝግቧል");
    setForm({ itemId: "", quantity: "", reason: "" });
    loadItems();
  }

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 p-6 pt-8">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">📤 Stock Out (Issuance)</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg space-y-3">
        <select required value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} className="w-full px-3 py-2 bg-slate-100 border border-slate-500 rounded-lg text-sm">
          <option value="">-- እቃ ምረጥ --</option>
          {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.quantity} {i.unit} ቀርቷል)</option>)}
        </select>

        <input required type="number" placeholder="ብዛት (Quantity)" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full px-3 py-2 bg-slate-100 border border-slate-500 rounded-lg text-sm" />
        <input placeholder="ምክንያት (ለምሳሌ: Issued to Kitchen)" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3 py-2 bg-slate-100 border border-slate-500 rounded-lg text-sm" />

        {message && <p className="text-sm text-amber-400">{message}</p>}

        <button className="bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-400">መዝግብ</button>
      </form>
    </div>
  );
}
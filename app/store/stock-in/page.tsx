"use client";

import { useEffect, useState } from "react";

type StoreItem = { id: string; name: string; unit: string };
type Supplier = { id: string; name: string };

export default function StockInPage() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({ itemId: "", supplierId: "", quantity: "", totalCost: "", notes: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const [itemsRes, supRes] = await Promise.all([
        fetch("/api/store/items", { cache: "no-store" }),
        fetch("/api/store/suppliers", { cache: "no-store" }),
      ]);
      const itemsData = await itemsRes.json();
      const supData = await supRes.json();
      if (itemsData.success) setItems(itemsData.items);
      if (supData.success) setSuppliers(supData.suppliers);
    }
    void load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/store/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!data.success) {
      setMessage(data.message || "ስህተት ተፈጥሯል");
      return;
    }
    setMessage("✅ ገቢ ተመዝግቧል");
    setForm({ itemId: "", supplierId: "", quantity: "", totalCost: "", notes: "" });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 p-6 pt-10">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">📥 Stock In (Receiving)</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-slate-500 rounded-2xl p-6 max-w-lg space-y-3">
        <select required value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} className="w-full px-3 py-2 bg-slate-100 border border-slate-500 rounded-lg text-sm">
          <option value="">-- እቃ ምረጥ --</option>
          {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
        </select>

        <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} className="w-full px-3 py-2 bg-slate-100 border border-slate-500 rounded-lg text-sm">
          <option value="">-- Supplier (አማራጭ) --</option>
          {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <input required type="number" placeholder="ብዛት (Quantity)" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full px-3 py-2 bg-slate-100 border border-slate-500 rounded-lg text-sm" />
        <input type="number" placeholder="ጠቅላላ ዋጋ (Total Cost)" value={form.totalCost} onChange={(e) => setForm({ ...form, totalCost: e.target.value })} className="w-full px-3 py-2 bg-slate-100 border border-slate-500 rounded-lg text-sm" />
        <textarea placeholder="ማስታወሻ" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 bg-slate-100 border text-gray-800 border-slate-500 rounded-lg text-sm" rows={2} />

        {message && <p className="text-sm text-amber-400">{message}</p>}

        <button className="bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-400">መዝግብ</button>
      </form>
    </div>
  );
}
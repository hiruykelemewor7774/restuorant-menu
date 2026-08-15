"use client";

import { useEffect, useState } from "react";

type Item = { id: string; name: string; unit: string };
type WasteLog = {
  id: string;
  item: Item;
  quantity: number;
  reason: string | null;
  createdAt: string;
};

export default function WastePage() {
  const [logs, setLogs] = useState<WasteLog[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  async function loadAll() {
    const [wRes, iRes] = await Promise.all([
      fetch("/api/store/waste", { cache: "no-store" }),
      fetch("/api/store/items", { cache: "no-store" }),
    ]);
    const w = await wRes.json();
    const i = await iRes.json();
    if (w.success) setLogs(w.wasteLogs);
    if (i.success) setItems(i.items);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!itemId || !quantity) return;

    await fetch("/api/store/waste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        quantity: parseFloat(quantity),
        reason,
      }),
    });

    setItemId("");
    setQuantity("");
    setReason("");
    setShowForm(false);
    loadAll();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">🗑️ Waste Log</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {showForm ? "Cancel" : "+ Log Waste"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.unit})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            placeholder="Reason (spoiled, dropped...)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
          >
            Log Waste
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-gray-50">
                <td className="py-3 px-4 font-medium">{l.item.name}</td>
                <td className="py-3 px-4 text-red-500">
                  -{l.quantity} {l.item.unit}
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {l.reason || "-"}
                </td>
                <td className="py-3 px-4 text-gray-400">
                  {new Date(l.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No waste logged
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
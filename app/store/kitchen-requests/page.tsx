"use client";

import { useEffect, useState } from "react";

type Item = { id: string; name: string; unit: string };
type ReqItem = { id: string; itemId: string; quantity: number; item: Item };
type Req = {
  id: string;
  status: string;
  requestedBy: string | null;
  notes: string | null;
  items: ReqItem[];
  createdAt: string;
};

export default function KitchenRequestsPage() {
  const [requests, setRequests] = useState<Req[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [requestedBy, setRequestedBy] = useState("");
  const [lines, setLines] = useState([{ itemId: "", quantity: "" }]);

  async function loadAll() {
    const [rRes, iRes] = await Promise.all([
      fetch("/api/store/kitchen-requests", { cache: "no-store" }),
      fetch("/api/store/items", { cache: "no-store" }),
    ]);
    const r = await rRes.json();
    const i = await iRes.json();
    if (r.success) setRequests(r.requests);
    if (i.success) setItems(i.items);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  function addLine() {
    setLines([...lines, { itemId: "", quantity: "" }]);
  }

  function updateLine(idx: number, field: "itemId" | "quantity", value: string) {
    const copy = [...lines];
    copy[idx][field] = value;
    setLines(copy);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validLines = lines
      .filter((l) => l.itemId && l.quantity)
      .map((l) => ({ itemId: l.itemId, quantity: parseFloat(l.quantity) }));

    if (validLines.length === 0) return;

    await fetch("/api/store/kitchen-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestedBy, items: validLines }),
    });

    setRequestedBy("");
    setLines([{ itemId: "", quantity: "" }]);
    setShowForm(false);
    loadAll();
  }

  async function updateStatus(id: string, status: "approved" | "rejected") {
    await fetch(`/api/store/kitchen-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadAll();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">🍳 Kitchen Requests</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {showForm ? "Cancel" : "+ New Request"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 space-y-3"
        >
          <input
            placeholder="Requested By (optional)"
            value={requestedBy}
            onChange={(e) => setRequestedBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          {lines.map((line, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={line.itemId}
                onChange={(e) => updateLine(idx, "itemId", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
                placeholder="Qty"
                value={line.quantity}
                onChange={(e) => updateLine(idx, "quantity", e.target.value)}
                className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addLine}
              className="text-amber-600 text-sm font-medium"
            >
              + Add line
            </button>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Submit Request
          </button>
        </form>
      )}

      <div className="space-y-4">
        {requests.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium text-gray-800">
                  {r.requestedBy || "Unknown"}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  r.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : r.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {r.status}
              </span>
            </div>
            <ul className="text-sm text-gray-600 mb-3">
              {r.items.map((it) => (
                <li key={it.id}>
                  {it.item.name} - {it.quantity} {it.item.unit}
                </li>
              ))}
            </ul>
            {r.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(r.id, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(r.id, "rejected")}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-center py-8 text-gray-400">No requests yet</p>
        )}
      </div>
    </div>
  );
}
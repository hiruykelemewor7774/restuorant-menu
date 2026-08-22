"use client";

import { useEffect, useState } from "react";

type StoreItem = { id: string; name: string; unit: string; quantity: number };

type RequestItem = { itemId: string; quantity: string };

type KitchenRequestView = {
  id: string;
  status: string;
  createdAt: string;
  items: { id: string; quantity: number; item: { name: string; unit: string } }[];
};

export default function KitchenMaterialsPage() {
  const [materials, setMaterials] = useState<StoreItem[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cartItems, setCartItems] = useState<RequestItem[]>([]);
  const [requests, setRequests] = useState<KitchenRequestView[]>([]);
  const [message, setMessage] = useState("");

  async function loadMaterials() {
    const res = await fetch("/api/kitchen/materials", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setMaterials(data.items);
  }

  async function loadRequests() {
    const res = await fetch("/api/kitchen/request-item", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setRequests(data.requests);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMaterials();
    void loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  function addToRequestCart() {
    if (!selectedItem || !quantity) return;
    setCartItems((prev) => [...prev, { itemId: selectedItem, quantity }]);
    setSelectedItem("");
    setQuantity("");
  }

  function removeFromCart(idx: number) {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function submitRequest() {
    setMessage("");
    if (cartItems.length === 0) {
      setMessage("ቢያንስ አንድ እቃ ጨምር");
      return;
    }

    const res = await fetch("/api/kitchen/request-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItems.map((c) => ({ itemId: c.itemId, quantity: parseFloat(c.quantity) })),
      }),
    });
    const data = await res.json();

    if (!data.success) {
      setMessage(data.message || "ስህተት ተፈጥሯል");
      return;
    }

    setMessage("✅ ጥያቄ ወደ ስቶር ተልኳል");
    setCartItems([]);
    loadRequests();
  }

  function materialName(id: string) {
    return materials.find((m) => m.id === id)?.name || id;
  }
  function materialUnit(id: string) {
    return materials.find((m) => m.id === id)?.unit || "";
  }

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending: { label: "በመጠባበቅ ላይ", color: "bg-yellow-900/50 text-yellow-400" },
    approved: { label: "ጸድቋል", color: "bg-green-900/50 text-green-400" },
    rejected: { label: "ተቀባይነት አላገኘም", color: "bg-red-900/50 text-red-400" },
  };

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 p-3 pt-8">
      <h1 className="text-xl font-bold pb-2 text-yellow-400">📦 Request Material from Store</h1>

      {/* Add item to request */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm mb-4 max-w-2xl">
        <h2 className="text-lg font-bold pb-2 text-amber-400">አዲስ ጥያቄ ፍጠር</h2>
        <div className="flex gap-3 mb-3">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-100 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">-- እቃ ምረጥ --</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} (ያለው: {m.quantity} {m.unit})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="ብዛት"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-28 px-3 py-2 bg-slate-100 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={addToRequestCart}
            className="bg-slate-100 hover:bg-slate-300 px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + ጨምር
          </button>
        </div>

        {cartItems.length > 0 && (
          <div className="space-y-2 mb-3">
            {cartItems.map((c, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-800 rounded-lg px-3 py-2 text-sm">
                <span>{materialName(c.itemId)} — {c.quantity} {materialUnit(c.itemId)}</span>
                <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-300 text-xs">
                  አጥፋ
                </button>
              </div>
            ))}
          </div>
        )}

        {message && <p className="text-sm text-amber-400 mb-3">{message}</p>}

        <button
          onClick={submitRequest}
          className="w-full bg-yellow-500 text-black font-bold py-2.5 rounded-xl hover:bg-yellow-400"
        >
          🚀 ጥያቄ ላክ ወደ ስቶር
        </button>
      </div>

      {/* Request history */}
      <h2 className="text-lg font-bold mb-3 text-amber-400">Request history</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((r) => {
          const badge = statusLabel[r.status] || { label: r.status, color: "bg-gray-800 text-gray-400" };
          return (
            <div key={r.id} className="bg-gray-900 border border-gray-800 shadow-sm rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <ul className="text-sm text-gray-300 list-disc list-inside">
                {r.items.map((i) => (
                  <li key={i.id}>
                    {i.item.name} — {i.quantity} {i.item.unit}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {requests.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-10">ምንም ጥያቄ የለም</p>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

type Item = { id: string; name: string; unit: string };
type Supplier = { id: string; name: string };
type Purchase = {
  id: string;
  item: Item;
  supplier: Supplier | null;
  quantity: number;
  totalCost: number;
  purchasedAt: string;
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [itemId, setItemId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalCost, setTotalCost] = useState("");

  async function loadAll() {
    const [pRes, iRes, sRes] = await Promise.all([
      fetch("/api/store/purchases", { cache: "no-store" }),
      fetch("/api/store/items", { cache: "no-store" }),
      fetch("/api/store/suppliers", { cache: "no-store" }),
    ]);
    const p = await pRes.json();
    const i = await iRes.json();
    const s = await sRes.json();
    if (p.success) setPurchases(p.purchases);
    if (i.success) setItems(i.items);
    if (s.success) setSuppliers(s.suppliers);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!itemId || !quantity) return;

    await fetch("/api/store/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        supplierId: supplierId || null,
        quantity: parseFloat(quantity),
        totalCost: parseFloat(totalCost) || 0,
      }),
    });

    setItemId("");
    setSupplierId("");
    setQuantity("");
    setTotalCost("");
    setShowForm(false);
    loadAll();
  }

  return (
    <div className="bg-gray-100 h-screen p-5 text-gray-800">
      <div className="flex justify-between items-center mb-4 mt-5">
        <h2 className="text-xl font-bold text-gray-800">🧾 Purchases</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {showForm ? "Cancel" : "+ New Purchase"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3"
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
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">Supplier (optional)</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
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
            type="number"
            placeholder="Total Cost (ETB)"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
          >
            Save
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-300 text-gray-500 border-b border-gray-100">
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Cost</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id} className="border-b border-gray-50">
                <td className="py-3 px-4 font-medium">{p.item.name}</td>
                <td className="py-3 px-4 text-gray-500">
                  {p.supplier?.name || "-"}
                </td>
                <td className="py-3 px-4 text-green-600">
                  +{p.quantity} {p.item.unit}
                </td>
                <td className="py-3 px-4">{p.totalCost.toFixed(2)} ETB</td>
                <td className="py-3 px-4 text-gray-400">
                  {new Date(p.purchasedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No purchases yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
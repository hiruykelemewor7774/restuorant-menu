"use client";

import { useEffect, useState } from "react";

type StoreItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minThreshold: number;
  costPerUnit: number;
  expiryDate: string | null;
  notes: string | null;
};

export default function AdminStoreInventoryPage() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minThreshold, setMinThreshold] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");

  async function loadItems() {
    const res = await fetch("/api/store/items", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setItems(data.items);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadItems();
  }, []);

  function resetForm() {
    setName("");
    setCategory("");
    setUnit("");
    setQuantity("");
    setMinThreshold("");
    setCostPerUnit("");
    setExpiryDate("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !unit.trim()) return;
    setError("");

    const payload = {
      name,
      category: category || "General",
      unit,
      quantity: parseFloat(quantity) || 0,
      minThreshold: parseFloat(minThreshold) || 0,
      costPerUnit: parseFloat(costPerUnit) || 0,
      expiryDate: expiryDate || null,
    };

    if (editingId) {
      const res = await fetch(`/api/store/items/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Update failed");
        return;
      }
    } else {
      await fetch("/api/store/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    loadItems();
  }

  function startEdit(item: StoreItem) {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setUnit(item.unit);
    setQuantity(String(item.quantity));
    setMinThreshold(String(item.minThreshold));
    setCostPerUnit(String(item.costPerUnit));
    setExpiryDate(item.expiryDate ? item.expiryDate.slice(0, 10) : "");
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("ይህን ግብዓት ማጥፋት ትፈልጋለህ?")) return;
    const res = await fetch(`/api/store/items/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) {
      alert(data.message || "Delete failed");
      return;
    }
    loadItems();
  }

  return (
    <div className="text-white p-6 md:p-8 w-full">
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">
        🏪 Store Inventory (Admin Control)
      </h1>

      <button
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-semibold mb-4"
      >
        {showForm ? "Cancel" : "+ Add Item"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <input
            placeholder="Unit (kg, L, pcs...)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Min Threshold"
            value={minThreshold}
            onChange={(e) => setMinThreshold(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Cost per Unit"
            value={costPerUnit}
            onChange={(e) => setCostPerUnit(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
          >
            {editingId ? "Update" : "Save"}
          </button>
          {error && (
            <p className="col-span-full text-red-400 text-sm">{error}</p>
          )}
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Cost/Unit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const low = item.quantity <= item.minThreshold;
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-800/60 ${
                      low ? "bg-red-950/30" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-gray-400">
                      {item.category}
                    </td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4 text-gray-400">{item.unit}</td>
                    <td className="py-3 px-4">
                      {item.costPerUnit.toFixed(2)} ETB
                    </td>
                    <td className="py-3 px-4">
                      {low ? (
                        <span className="text-red-400 text-xs font-semibold">
                          ⚠️ Low
                        </span>
                      ) : (
                        <span className="text-green-400 text-xs">✓ OK</span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex gap-3">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-blue-400 hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No items yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
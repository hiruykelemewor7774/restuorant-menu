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

export default function InventoryPage() {
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !unit.trim()) return;

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
      await fetch(`/api/store/items/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
    await fetch(`/api/store/items/${id}`, { method: "DELETE" });
    loadItems();
  }

  return (
    <div className="bg-gray-200 text-gray-800 p-5 h-screen">
      <div className="flex justify-between items-center mb-4 mt-5">
        <h2 className="text-xl font-bold text-gray-800">📦 Inventory</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {showForm ? "Cancel" : "+ Add Item"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            placeholder="Unit (kg, L, pcs...)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Min Threshold"
            value={minThreshold}
            onChange={(e) => setMinThreshold(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Cost per Unit"
            value={costPerUnit}
            onChange={(e) => setCostPerUnit(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
          >
            {editingId ? "Update" : "Save"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-300 text-gray-500 border-b border-gray-100">
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
                    className={`border-b border-gray-50 ${
                      low ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {item.category}
                    </td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4 text-gray-500">{item.unit}</td>
                    <td className="py-3 px-4">
                      {item.costPerUnit.toFixed(2)} ETB
                    </td>
                    <td className="py-3 px-4">
                      {low ? (
                        <span className="text-red-500 text-xs font-semibold">
                          ⚠️ Low
                        </span>
                      ) : (
                        <span className="text-green-600 text-xs">✓ OK</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-xs italic">
                      Admin only
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
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
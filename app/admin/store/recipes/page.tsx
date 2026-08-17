"use client";

import { useEffect, useState } from "react";

type Item = { id: string; name: string; unit: string };
type RecipeItem = { id: string; itemId: string; quantity: number; item: Item };
type Recipe = {
  id: string;
  name: string;
  notes: string | null;
  items: RecipeItem[];
};

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [lines, setLines] = useState([{ itemId: "", quantity: "" }]);

  async function loadAll() {
    const [rRes, iRes] = await Promise.all([
      fetch("/api/store/recipes", { cache: "no-store" }),
      fetch("/api/store/items", { cache: "no-store" }),
    ]);
    const r = await rRes.json();
    const i = await iRes.json();
    if (r.success) setRecipes(r.recipes);
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
    if (!name.trim()) return;

    const validLines = lines
      .filter((l) => l.itemId && l.quantity)
      .map((l) => ({ itemId: l.itemId, quantity: parseFloat(l.quantity) }));

    if (validLines.length === 0) return;

    await fetch("/api/store/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, items: validLines }),
    });

    setName("");
    setLines([{ itemId: "", quantity: "" }]);
    setShowForm(false);
    loadAll();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this recipe?")) return;
    const res = await fetch(`/api/store/recipes/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) {
      alert(data.message || "Delete failed");
      return;
    }
    loadAll();
  }

  return (
    <div className="text-gray-800 mt-8 w-full">
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">
        📖 Recipes (Admin Control)
      </h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-semibold mb-4">
        {showForm ? "Cancel" : "+ New Recipe"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 space-y-3"
        >
          <input
            placeholder="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm"
          />
          {lines.map((line, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={line.itemId}
                onChange={(e) => updateLine(idx, "itemId", e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm"
              >
                <option value="">Select Ingredient</option>
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
                className="w-28 px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addLine}
            className="text-amber-400 hover:text-amber-500 text-sm font-medium"
          >
            + Add ingredient
          </button>
          <button
            type="submit"
            className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Save Recipe
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((r) => (
          <div
            key={r.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{r.name}</h3>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-red-400 hover:underline text-xs"
              >
                Delete
              </button>
            </div>
            <ul className="text-sm text-gray-400">
              {r.items.map((it) => (
                <li key={it.id}>
                  {it.item.name} - {it.quantity} {it.item.unit}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {recipes.length === 0 && (
          <p className="text-center py-8 text-gray-500 col-span-2">
            No recipes yet
          </p>
        )}
      </div>
    </div>
  );
}
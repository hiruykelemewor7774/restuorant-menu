"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type MenuItem = {
  id: string;
  type: string;
  category: string;
  name: string;
  price: string;
  image: string;
  features: string | null;
};

const categoriesByType: Record<string, string[]> = {
  Food: ["Traditional", "Fast Food", "Grill", "Breakfast", "Dessert"],
  Drink: ["Hot Drink", "Cold Drink", "Soft Drink", "Alcohol"],
  Room: ["Standard", "Deluxe", "Suite", "Family"],
};

const emptyForm = {
  type: "Food",
  category: "Traditional",
  name: "",
  price: "",
  image: "",
  features: "",
};

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [message, setMessage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadItems() {
    const res = await fetch("/api/admin/menu", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setItems(data.items);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    void loadItems();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImageError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

function startEdit(item: MenuItem) {
  setEditingId(item.id);
  setForm({
    type: item.type,
    category: item.category,
    name: item.name,
    price: item.price,
    image: item.image,
    features: item.features ? JSON.parse(item.features).join(", ") : "",
  });
  setImageError(false);

  // ካንተ layout scroll የሚያደርገው main tag ላይ ስለሆነ፣ እሱን በቀጥታ ማንቀሳቀስ
  const scrollableParent = document.querySelector("main");
  if (scrollableParent) {
    scrollableParent.scrollTo({ top: 0, behavior: "smooth" });
  }
}

  function handleTypeChange(newType: string) {
    const firstCategory = categoriesByType[newType]?.[0] || "";
    setForm({ ...form, type: newType, category: firstCategory });
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setImageError(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.path }));
      } else {
        setMessage(data.message || "ፋይል መስቀል አልተቻለም");
      }
    } catch {
      setMessage("የፋይል መስቀል ስህተት ተፈጥሯል");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.image) {
      setMessage("እባክህ ምስል ስቀል");
      return;
    }

    const payload = {
      type: form.type,
      category: form.category,
      name: form.name,
      price: form.price,
      image: form.image,
      features:
        form.type === "Room" && form.features.trim()
          ? form.features.split(",").map((f) => f.trim()).filter(Boolean)
          : undefined,
    };

    const url = editingId ? `/api/admin/menu/${editingId}` : "/api/admin/menu";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!data.success) {
      setMessage(data.message || "ስህተት ተፈጥሯል");
      return;
    }

    setMessage(editingId ? "እቃ ተስተካክሏል ✅" : "አዲስ እቃ ተፈጥሯል ✅");
    resetForm();
    loadItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("እርግጠኛ ነህ ይህን እቃ ማጥፋት ትፈልጋለህ?")) return;
    const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) loadItems();
  }

  const filteredItems =
    filterType === "All" ? items : items.filter((i) => i.type === filterType);

  const availableCategories = categoriesByType[form.type] || [];

  return (
    <div className="text-gray-800 bg-gray-200 mt-3 pt-5 pl-5 pr-5 pb-5">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">Menu Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 max-w-2xl">
        <h2 className="text-lg font-bold mb-4 text-yellow-400">
          {editingId ? "እቃ አስተካክል" : "አዲስ እቃ ጨምር"}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4 text-gray-900">
          <div>
            <label className="block text-sm text-gray-800 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-500 rounded-lg">
              <option value="Food">Food</option>
              <option value="Drink">Drink</option>
              <option value="Room">Room</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-900 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-500 rounded-lg">
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-800 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 bg-gray-100 border border-gray-500 rounded-lg"/>
          </div>
          <div>
            <label className="block text-sm text-gray-800 mb-1">Price</label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="ለምሳሌ: 80 Birr ወይም $3"
              required
              className="w-full px-3 py-2 bg-gray-100 border border-gray-700 rounded-lg"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm text-gray-800 mb-1">Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-black file:font-semibold hover:file:bg-yellow-400 cursor-pointer"
          />

          {uploading && (
            <p className="text-amber-400 text-sm mt-2">⏳ እየተሰቀለ ነው...</p>
          )}

          {/* Image Preview */}
          {form.image && !uploading && (
            <div className="mt-3 relative w-full h-40 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
              {imageError ? (
                <p className="text-red-400 text-sm">⚠️ ምስል መጫን አልተቻለም</p>
              ) : (
                <Image
                  src={form.image}
                  alt="preview"
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          )}
        </div>

        {form.type === "Room" && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">
              Features (በ , ተለያይተው)
            </label>
            <input
              type="text"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="Free Wi-Fi, TV, Air Conditioning"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>
        )}

        {message && <p className="text-sm text-amber-400 mb-3">{message}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading}
            className="bg-yellow-500 text-black font-bold px-6 py-2 rounded-xl hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {editingId ? "አስቀምጥ" : "ጨምር"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-700 px-6 py-2 rounded-xl hover:bg-gray-800 transition">
              ሰርዝ
            </button>
          )}
        </div>
      </form>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {["All", "Food", "Drink", "Room"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filterType === t
                ? "bg-yellow-500 text-black"
                : "bg-gray-900 border border-gray-700 hover:bg-gray-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-gray-400">loading...</p>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
              <div className="relative w-full h-32 bg-gray-800">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.type}
                      {item.category ? ` • ${item.category}` : ""}
                    </p>
                  </div>
                  <span className="text-amber-400 font-bold text-sm">{item.price}</span>
                </div>
                <div className="flex gap-2 mt-auto pt-3">
                  <button
                    onClick={() => startEdit(item)}
                    className="flex-1 text-sm bg-gray-200 hover:bg-gray-300 py-1.5 rounded-lg transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 text-sm bg-red-500 hover:bg-red-600 text-gray-100 py-1.5 rounded-lg transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
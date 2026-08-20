"use client";

import { useEffect, useState } from "react";

type StoreItem = { id: string; name: string; unit: string; quantity: number; minThreshold: number };

export default function LowStockPage() {
  const [items, setItems] = useState<StoreItem[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/store/items", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setItems(data.items.filter((i: StoreItem) => i.quantity <= i.minThreshold));
      }
    }
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 p-6 pt-15">
      <h1 className="text-2xl font-bold mb-6 text-red-400">⚠️ Low Stock Alerts</h1>

      {items.length === 0 ? (
        <p className="text-gray-400">ምንም ያለቀ እቃ የለም 🎉</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((i) => (
            <div key={i.id} className="bg-red-900/20 border border-red-800 rounded-xl p-4">
              <p className="font-bold text-red-300">{i.name}</p>
              <p className="text-sm text-gray-400">
                ቀርቷል: <span className="text-red-400 font-bold">{i.quantity} {i.unit}</span>
              </p>
              <p className="text-xs text-gray-500">Min Threshold: {i.minThreshold} {i.unit}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
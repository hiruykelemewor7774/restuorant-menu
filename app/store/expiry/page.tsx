"use client";

import { useEffect, useState } from "react";

type StoreItem = {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  expiryDate: string | null;
};

export default function ExpiryPage() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/store/items", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.items);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const soon = new Date();
  soon.setDate(now.getDate() + 7);

  const withExpiry = items.filter((i) => i.expiryDate);

  function statusOf(item: StoreItem) {
    if (!item.expiryDate) return null;
    const d = new Date(item.expiryDate);
    if (d <= now) return "expired";
    if (d <= soon) return "soon";
    return "ok";
  }

  const sorted = [...withExpiry].sort(
    (a, b) =>
      new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4 mt-15">⏳ Expiry Tracking</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => {
                const status = statusOf(item);
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-50 ${
                      status === "expired"
                        ? "bg-red-50"
                        : status === "soon"
                        ? "bg-yellow-50"
                        : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(item.expiryDate!).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {status === "expired" && (
                        <span className="text-red-600 text-xs font-semibold">
                          ❌ Expired
                        </span>
                      )}
                      {status === "soon" && (
                        <span className="text-yellow-600 text-xs font-semibold">
                          ⚠️ Expiring Soon
                        </span>
                      )}
                      {status === "ok" && (
                        <span className="text-green-600 text-xs">✓ OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No items with expiry dates
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
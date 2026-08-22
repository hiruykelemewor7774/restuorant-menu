"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  tableNumber: string;
  status: string;
  items: { id: string; name: string; quantity: number }[];
};

export default function KitchenHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/kitchen/orders/history", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    }
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 p-3 pt-8">
      <h1 className="text-2xl font-bold pb-2 text-yellow-400">📋 Completed / History</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-gray-900 border border-gray-800 shadow-sm rounded-xl p-4">
            <p className="font-bold text-gray-300 mb-2">ጠረጴዛ: {o.tableNumber}</p>
            <ul className="text-xs text-gray-500 list-disc list-inside">
              {o.items.map((i) => (
                <li key={i.id}>{i.name} x{i.quantity}</li>
              ))}
            </ul>
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-400">ምንም ታሪክ የለም</p>}
      </div>
    </div>
  );
}
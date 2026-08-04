"use client";

import { useState } from "react";

export default function KitchenDashboard() {
  const [kitchenOrders, setKitchenOrders] = useState([
    { id: "1", tableNumber: "Table-01", items: [{ name: "Doro Wat", quantity: 2 }], status: "sent_to_kitchen" },
  ]);

  const markReady = (id: string) => {
    setKitchenOrders(kitchenOrders.map(o => o.id === id ? { ...o, status: "ready" } : o));
  };

  return (
    <div className="min-h-screen text-white p-10">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">🍳 Kitchen Order Preparation Screen</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kitchenOrders.map((order) => (
          <div key={order.id} className="border border-gray-800 bg-blue-500 p-6 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-extrabold text-red-400">{order.tableNumber}</span>
              <span className="px-3 py-1 text-xs rounded-full font-bold bg-yellow-500/20 text-yellow-400 uppercase">
                {order.status}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-300 mb-6">
              {order.items.map((item, idx) => (
                <li key={idx}>{item.name} - Qty: {item.quantity}</li>
              ))}
            </ul>
            <button
              onClick={() => markReady(order.id)}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg transition"
            >
              Mark as Ready 🟢
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
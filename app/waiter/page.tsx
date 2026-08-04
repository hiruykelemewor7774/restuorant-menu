"use client";

import { useState } from "react";


export default function WaiterDashboard() {
  const [orders, setOrders] = useState([
    { id: "1", tableNumber: "Table-01", items: [{ name: "Doro Wat", quantity: 2 }], status: "pending" },
    { id: "2", tableNumber: "Table-03", items: [{ name: "Tibs", quantity: 1 }], status: "ready" },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="min-h-screen text-white p-10">
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">🍽️ Waiter Station & Order Dispatcher</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-slate-700 border border-gray-800 p-6 rounded-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-extrabold text-yellow-400">{order.tableNumber}</span>
                <span className="px-3 py-1 text-xs rounded-full font-bold bg-blue-500/20 text-blue-400 uppercase">
                  {order.status}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-300 mb-6">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} (x{item.quantity})</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              {order.status === "pending" && (
                <button
                  onClick={() => updateStatus(order.id, "sent_to_kitchen")}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg transition"
                >
                  Forward to Kitchen 🚀
                </button>
              )}
              {order.status === "ready" && (
                <button
                  onClick={() => updateStatus(order.id, "delivered")}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition"
                >
                  Deliver to Table Based on No. ✅
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
}
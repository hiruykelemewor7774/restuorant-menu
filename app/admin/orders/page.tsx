"use client";

import { useEffect, useRef, useState } from "react";
import { playNotificationSound } from "@/lib/notifySound";

type OrderItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
};

type Order = {
  id: string;
  tableNumber: string;
  status: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
  waiter: { username: string; fullName: string | null } | null;
};

type WaiterOption = {
  id: string;
  username: string;
  fullName: string | null;
};

export default function LiveOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [waiters, setWaiters] = useState<WaiterOption[]>([]);
  const [selectedWaiter, setSelectedWaiter] = useState<Record<string, string>>({});
  const knownIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  async function loadOrders() {
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return;

    const newPending = data.orders.filter(
      (o: Order) => o.status === "pending" && !knownIds.current.has(o.id)
    );

    if (!firstLoad.current && newPending.length > 0) {
      playNotificationSound();
    }

    data.orders.forEach((o: Order) => knownIds.current.add(o.id));
    setOrders(data.orders);
    firstLoad.current = false;
  }

  useEffect(() => {
    fetch("/api/admin/waiters", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setWaiters(data.waiters);
      });
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  async function sendToKitchen(orderId: string) {
    const waiterId = selectedWaiter[orderId];
    if (!waiterId) {
      alert("እባክህ ዌይተር ምረጥ");
      return;
    }

    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ waiterId, status: "sent_to_kitchen" }),
    });
    loadOrders();
  }

  const statusLabel: Record<string, string> = {
    pending: "🟡 አዲስ",
    sent_to_kitchen: "🍳 ወደ ኩሽና ተልኳል",
    ready: "✅ ዝግጁ ነው",
  };

  return (
    <div className="text-gray-800 mt-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">Live Orders</h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-500 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-yellow-400">
                ጠረጴዛ: {order.tableNumber}
              </span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded-md">
                {statusLabel[order.status] || order.status}
              </span>
            </div>

            <div className="space-y-1 mb-3 border-t border-b border-gray-800 py-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="text-gray-400">{item.price}</span>
                </div>
              ))}
            </div>

            {order.notes && (
              <p className="text-xs italic text-gray-400 mb-2">
                ማስታወሻ: {order.notes}
              </p>
            )}

            {order.waiter && (
              <p className="text-xs text-gray-400 mb-2">
                ዌይተር: {order.waiter.fullName || order.waiter.username}
              </p>
            )}

            {order.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <select
                  value={selectedWaiter[order.id] || ""}
                  onChange={(e) =>
                    setSelectedWaiter({ ...selectedWaiter, [order.id]: e.target.value })
                  }
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm">
                  <option value="">ዌይተር ምረጥ</option>
                  {waiters.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.fullName || w.username}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => sendToKitchen(order.id)}
                  className="bg-yellow-500 text-black text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-yellow-400">
                  ወደ ኩሽና ላክ
                </button>
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-10">
            ምንም ትዕዛዝ የለም
          </p>
        )}
      </div>
    </div>
  );
}
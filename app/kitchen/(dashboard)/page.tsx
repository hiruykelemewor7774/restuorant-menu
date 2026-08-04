"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { playNotificationSound } from "@/lib/notifySound";

type OrderItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  category: string;
};

type Order = {
  id: string;
  tableNumber: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
};

export default function KitchenDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const knownIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  async function loadOrders() {
    const res = await fetch("/api/kitchen/orders", { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return;

    const newOnes = data.orders.filter((o: Order) => !knownIds.current.has(o.id));
    if (!firstLoad.current && newOnes.length > 0) {
      playNotificationSound();
    }

    data.orders.forEach((o: Order) => knownIds.current.add(o.id));
    setOrders(data.orders);
    firstLoad.current = false;
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  async function markReady(id: string) {
    await fetch(`/api/kitchen/orders/${id}`, { method: "PUT" });
    loadOrders();
  }

  async function handleLogout() {
    await fetch("/api/kitchen/logout", { method: "POST" });
    router.replace("/kitchen/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">🍳 የኩሽና ትዕዛዞች</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
        >
          ውጣ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <p className="font-bold text-yellow-400 mb-2">
              ጠረጴዛ: {order.tableNumber}
            </p>

            <div className="space-y-1 border-t border-b border-gray-800 py-2 mb-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-bold text-amber-400">x{item.quantity}</span>
                </div>
              ))}
            </div>

            {order.notes && (
              <p className="text-xs italic text-gray-400 mb-3">
                ማስታወሻ: {order.notes}
              </p>
            )}

            <button
              onClick={() => markReady(order.id)}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded-lg"
            >
              ✅ ዝግጁ ነው (Ready)
            </button>
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
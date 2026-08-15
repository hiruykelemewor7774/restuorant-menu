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
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function KitchenDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);
  const knownIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);
  const [processing, setProcessing] = useState<string | null>(null);

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

  async function loadHistory() {
    const res = await fetch("/api/kitchen/orders/history", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setFinishedOrders(data.orders);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
    loadHistory();
    const interval = setInterval(() => {
      loadOrders();
      loadHistory();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function markReady(id: string) {
    setProcessing(id);
    const res = await fetch(`/api/kitchen/orders/${id}`, { method: "PUT" });
    const data = await res.json();
    if (data.success) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      loadHistory();
    } else {
      alert(data.message || "ስህተት ተፈጥሯል");
    }
    setProcessing(null);
  }

  async function handleLogout() {
    await fetch("/api/kitchen/logout", { method: "POST" });
    router.replace("/kitchen/login");
    router.refresh();
  }

  const statusBadge: Record<string, { label: string; color: string }> = {
    ready: { label: "ለ Waiter ተልኳል", color: "bg-blue-900/50 text-blue-400" },
    delivered: { label: "ተጠናቅቋል", color: "bg-green-900/50 text-green-400" },
  };

  return (
    <div className="mt-10 min-h-screen text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">🍳 የኩሽና ትዕዛዞች</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700">
          ውጣ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4">
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
              disabled={processing === order.id}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
            >
              {processing === order.id ? "..." : "✅ ዝግጁ ነው (Ready)"}
            </button>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-10">
            ምንም ትዕዛዝ የለም
          </p>
        )}
      </div>

      {finishedOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3 text-green-400">📋 ያለፉ ትዕዛዞች</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finishedOrders.map((order) => {
              const badge = statusBadge[order.status] || { label: order.status, color: "bg-gray-800 text-gray-400" };
              return (
                <div
                  key={order.id}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 opacity-70"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-300">ጠረጴዛ: {order.tableNumber}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <ul className="text-xs text-gray-500 list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item.id}>{item.name} (x{item.quantity})</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
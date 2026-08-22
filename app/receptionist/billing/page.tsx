"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  tableNumber: string;
  totalAmount: number;
  items: { id: string; name: string; quantity: number; price: string }[];
};

export default function BillingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  async function loadOrders() {
    const res = await fetch("/api/receptionist/billing", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setOrders(data.orders);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOrders();
  }, []);

  async function handleConfirm(id: string, method: string) {
    setProcessing(id);
    const res = await fetch(`/api/receptionist/billing/${id}/confirm`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethod: method }),
    });
    const data = await res.json();
    if (data.success) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } else {
      alert(data.message || "ስህተት ተፈጥሯል");
    }
    setProcessing(null);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 p-5 pt-10">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">💳 Billing & Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => {
          const total = order.items.reduce(
            (sum, i) => sum + (parseFloat(i.price.replace(/[^0-9.]/g, "")) || 0) * i.quantity,
            0
          );
          return (
            <div key={order.id} className="bg-gray-900 border shadow-sm border-gray-800 rounded-xl p-4">
              <p className="font-bold text-amber-400 mb-2">ጠረጴዛ/ክፍል: {order.tableNumber}</p>
              <ul className="text-sm text-gray-300 mb-3 list-disc list-inside">
                {order.items.map((i) => (
                  <li key={i.id}>{i.name} x{i.quantity}</li>
                ))}
              </ul>
              <p className="text-lg font-bold text-green-400 mb-3">{total.toFixed(2)} ETB</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirm(order.id, "cash")}
                  disabled={processing === order.id}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-50"
                >
                  💵 Cash
                </button>
                <button
                  onClick={() => handleConfirm(order.id, "chapa")}
                  disabled={processing === order.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-50"
                >
                  📱 Mobile Money
                </button>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && <p className="text-gray-400 col-span-full text-center py-10">ያልተከፈለ ትዕዛዝ የለም</p>}
      </div>
    </div>
  );
}
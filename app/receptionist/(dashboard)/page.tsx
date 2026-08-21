"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RingingAlertModal from "@/app/components/RingingAlertModal";

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
  status: string;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  guestAddress: string | null;
  guestIdNumber: string | null;
  items: OrderItem[];
};

export default function ReceptionistDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const knownIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  async function loadOrders() {
    const res = await fetch("/api/receptionist/orders", { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return;

    const newOnes = data.orders.filter((o: Order) => !knownIds.current.has(o.id));
    if (!firstLoad.current && newOnes.length > 0) {
      setAlertMessage(`🛎️ አዲስ የክፍል ትዕዛዝ! ጠረጴዛ/ክፍል ${newOnes[0].tableNumber}`);
      setAlertOpen(true);
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

  async function confirmOrder(id: string) {
    setProcessing(id);
    const res = await fetch(`/api/receptionist/orders/${id}/confirm`, { method: "PUT" });
    const data = await res.json();
    if (data.success) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } else {
      alert(data.message || "ስህተት ተፈጥሯል");
    }
    setProcessing(null);
  }

  async function handleLogout() {
    await fetch("/api/receptionist/logout", { method: "POST" });
    router.replace("/receptionist/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 pt-24">
      <RingingAlertModal
        isOpen={alertOpen}
        title="ማሳወቂያ"
        message={alertMessage}
        onAcknowledge={() => setAlertOpen(false)}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">🛎️ የክፍል ትዕዛዞች (Receptionist)</h1>
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
            <p className="font-bold text-yellow-400 mb-2">ክፍል: {order.tableNumber}</p>

            <div className="space-y-1 border-t border-b border-gray-800 py-2 mb-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-bold text-amber-400">x{item.quantity}</span>
                </div>
              ))}
            </div>

            {(order.guestName || order.guestPhone) && (
              <div className="bg-gray-800/50 rounded-lg p-3 mb-3 text-xs space-y-1">
                <p className="font-semibold text-gray-300">የእንግዳ መረጃ</p>
                {order.guestName && <p>ስም: {order.guestName}</p>}
                {order.guestPhone && <p>ስልክ: {order.guestPhone}</p>}
                {order.guestEmail && <p>ኢሜል: {order.guestEmail}</p>}
                {order.guestAddress && <p>አድራሻ: {order.guestAddress}</p>}
                {order.guestIdNumber && <p>መታወቂያ: {order.guestIdNumber}</p>}
              </div>
            )}

            <button
              onClick={() => confirmOrder(order.id)}
              disabled={processing === order.id}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
            >
              {processing === order.id ? "..." : "✅ አረጋግጥ / ደርሷል"}
            </button>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-10">
            ምንም የክፍል ትዕዛዝ የለም
          </p>
        )}
      </div>
    </div>
  );
}
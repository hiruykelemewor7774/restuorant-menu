"use client";

import { useEffect, useRef, useState } from "react";
import { playNotificationSound } from "@/lib/notifySound";
import RingingAlertModal from "../components/RingingAlertModal";

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
  items: OrderItem[];
};

type ManualOrder = Order & { paymentMethod?: string | null };

export default function WaiterDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);
  const knownStatuses = useRef<Map<string, string>>(new Map());
  const firstLoad = useRef(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const [manualOrders, setManualOrders] = useState<ManualOrder[]>([]);
  const knownManualIds = useRef<Set<string>>(new Set());
  const firstManualLoad = useRef(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  async function loadOrders() {
    const unclaimedRes = await fetch("/api/waiter/orders/unclaimed", { cache: "no-store" });
    const unclaimedData = await unclaimedRes.json();

    const mineRes = await fetch("/api/waiter/orders", { cache: "no-store" });
    const mineData = await mineRes.json();

    if (!unclaimedData.success || !mineData.success) return;

    const combined: Order[] = [
      ...unclaimedData.orders.map((o: Order) => ({ ...o, status: "pending" })),
      ...mineData.orders.filter((o: Order) => o.status !== "delivered"),
    ];

    const uniqueMap = new Map<string, Order>();
    combined.forEach((o) => uniqueMap.set(o.id, o));
    const uniqueOrders = Array.from(uniqueMap.values());

    // 🔍 DEBUG LOG
    console.log("🔍 firstLoad:", firstLoad.current, "| orders:", uniqueOrders.map(o => `${o.tableNumber}:${o.status}`));

    if (!firstLoad.current) {
      for (const order of uniqueOrders) {
        const prevStatus = knownStatuses.current.get(order.id);
        const isNew = prevStatus === undefined;
        const becameReady = prevStatus && prevStatus !== "ready" && order.status === "ready";

        // 🔍 DEBUG LOG
        console.log(`🔍 order ${order.tableNumber}: prevStatus=${prevStatus}, isNew=${isNew}, becameReady=${becameReady}`);

        if (isNew) {
          console.log("🔔 TRIGGERING: new order alert");
          setAlertMessage(`🆕 አዲስ ትዕዛዝ! ጠረጴዛ ${order.tableNumber}`);
          setAlertOpen(true);
          break;
        }
        if (becameReady) {
          console.log("🔔 TRIGGERING: ready alert");
          setAlertMessage(`✅ ጠረጴዛ ${order.tableNumber} ትዕዛዝ ዝግጁ ሆኗል! ወደ ደንበኛ ውሰድ።`);
          setAlertOpen(true);
          break;
        }
      }
    }

    uniqueOrders.forEach((o) => knownStatuses.current.set(o.id, o.status));
    setOrders(uniqueOrders);
    firstLoad.current = false;
  }

  async function loadManualOrders() {
    const res = await fetch("/api/waiter/orders/manual-pending", { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return;

    const newOnes = data.orders.filter(
      (o: ManualOrder) => !knownManualIds.current.has(o.id)
    );
    if (!firstManualLoad.current && newOnes.length > 0) {
      setAlertMessage(`💵 አዲስ የበእጅ ክፍያ ትዕዛዝ! ጠረጴዛ: ${newOnes[0].tableNumber}`);
      setAlertOpen(true);
    }

    data.orders.forEach((o: ManualOrder) => knownManualIds.current.add(o.id));
    setManualOrders(data.orders);
    firstManualLoad.current = false;
  }

  async function loadFinished() {
    const res = await fetch("/api/waiter/orders?status=delivered", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setFinishedOrders(data.orders.slice(0, 10));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
    loadFinished();
    const interval = setInterval(() => {
      loadOrders();
      loadFinished();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadManualOrders();
    const interval = setInterval(loadManualOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  async function forwardToKitchen(orderId: string) {
    setProcessing(orderId);
    const res = await fetch(`/api/waiter/orders/${orderId}/claim`, { method: "PUT" });
    const data = await res.json();
    if (data.success) {
      loadOrders();
    } else {
      alert(data.message || "ስህተት ተፈጥሯል");
    }
    setProcessing(null);
  }

  async function acceptCashPayment(orderId: string) {
    setProcessing(orderId);
    const res = await fetch(`/api/waiter/orders/${orderId}/accept-cash`, { method: "PUT" });
    const data = await res.json();
    if (data.success) {
      setManualOrders((prev) => prev.filter((o) => o.id !== orderId));
      loadOrders();
    } else {
      alert(data.message || "ስህተት ተፈጥሯል");
    }
    setProcessing(null);
  }

  async function deliverToTable(orderId: string, tableNumber: string) {
    if (!confirm(`ጠረጴዛ ${tableNumber} ላይ ትዕዛዙን በትክክል አድርሰሃል?`)) return;
    setProcessing(orderId);
    const res = await fetch(`/api/waiter/orders/${orderId}/deliver`, { method: "PUT" });
    const data = await res.json();
    if (data.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      loadFinished();
    } else {
      alert(data.message || "ስህተት ተፈጥሯል");
    }
    setProcessing(null);
  }

  const statusLabel: Record<string, string> = {
    pending: "PENDING",
    sent_to_kitchen: "IN KITCHEN",
    ready: "READY",
  };

  return (
    <div className="mt-5 pt-5 min-h-screen text-amber-500 bg-gray-200">
     <RingingAlertModal
        isOpen={alertOpen}
        title="ማሳወቂያ"
        message={alertMessage}
        onAcknowledge={() => setAlertOpen(false)}/>
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">🍽️ Waiter Station & Order Dispatcher</h1>

      {manualOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-amber-400">💵 በእጅ ክፍያ የሚጠበቁ ትዕዛዞች</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {manualOrders.map((order) => (
              <div key={order.id} className="bg-amber-900/30 border border-amber-500 p-5 rounded-xl">
                <p className="font-bold text-amber-300 mb-2">Table-{order.tableNumber}</p>
                <ul className="text-sm text-gray-300 mb-3 list-disc list-inside">
                  {order.items.map((item) => (
                    <li key={item.id}>{item.name} (x{item.quantity})</li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mb-3">ጠቅላላ ክፍያ ይሰብስቡ ከዚያ ያረጋግጡ</p>
                <button
                  onClick={() => acceptCashPayment(order.id)}
                  disabled={processing === order.id}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-lg disabled:opacity-50"
                >
                  {processing === order.id ? "..." : "💵 ገንዘብ ተቀብያለሁ → ላክ ወደ ኩሽና"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className=" ml-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-800 p-6 rounded-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-extrabold text-yellow-400">Table-{order.tableNumber}</span>
                <span className="px-3 py-1 text-xs rounded-full font-bold bg-blue-500/20 text-blue-400 uppercase">
                  {statusLabel[order.status] || order.status}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-300 mb-6">
                {order.items.map((item) => (
                  <li key={item.id}>{item.name} (x{item.quantity})</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              {order.status === "pending" && (
                <button
                  onClick={() => forwardToKitchen(order.id)}
                  disabled={processing === order.id}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg transition disabled:opacity-50"
                >
                  {processing === order.id ? "እየተላከ ነው..." : "Forward to Kitchen 🚀"}
                </button>
              )}
              {order.status === "sent_to_kitchen" && (
                <button
                  disabled
                  className="w-full bg-gray-600 text-gray-300 font-bold py-2 rounded-lg cursor-not-allowed"
                >
                  ኩሽና እያዘጋጀ ነው... ⏳
                </button>
              )}
              {order.status === "ready" && (
                <button
                  onClick={() => deliverToTable(order.id, order.tableNumber)}
                  disabled={processing === order.id}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold text-sm py-2 rounded-lg transition disabled:opacity-50"
                >
                  {processing === order.id ? "..." : "Deliver to User By Table No. ✅"}
                </button>
              )}
            </div>
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
          <h2 className="text-lg font-bold mb-3 text-green-400">✅ የተጠናቀቁ ትዕዛዞች</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finishedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-200 border border-green-800 p-4 rounded-xl opacity-70"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-300">Table-{order.tableNumber}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-900/50 text-green-400">
                    FINISHED
                  </span>
                </div>
                <ul className="text-xs text-gray-500 list-disc list-inside">
                  {order.items.map((item) => (
                    <li key={item.id}>{item.name} (x{item.quantity})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
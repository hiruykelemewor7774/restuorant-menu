"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import RingingAlertModal from "@/app/components/RingingAlertModal";

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

const steps = [
  { key: "pending", label: "ትዕዛዝ ደርሷል", icon: "📝" },
  { key: "sent_to_kitchen", label: "ኩሽና እያዘጋጀ ነው", icon: "🍳" },
  { key: "ready", label: "ዝግጁ ነው", icon: "✅" },
  { key: "delivered", label: "ደርሶዎታል", icon: "🎉" },
];

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const knownStatus = useRef<string | null>(null);
  const firstLoad = useRef(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  async function loadStatus() {
    const res = await fetch(`/api/orders/${orderId}/status`, { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return;

    const newStatus = data.order.status;

    if (!firstLoad.current && knownStatus.current && knownStatus.current !== newStatus) {
      if (newStatus === "ready") {
        setAlertMessage("🎉 ትዕዛዝዎ ዝግጁ ሆኗል! ዌይተር በቅርቡ ያመጣልዎታል።");
        setAlertOpen(true);
      } else if (newStatus === "sent_to_kitchen") {
        setAlertMessage("🍳 ትዕዛዝዎ ወደ ኩሽና ተልኳል!");
        setAlertOpen(true);
      } else if (newStatus === "delivered") {
        setAlertMessage("✅ ትዕዛዝዎ ደርሶዎታል! መልካም ምግብ!");
        setAlertOpen(true);
      }
    }

    knownStatus.current = newStatus;
    setOrder(data.order);
    firstLoad.current = false;
  }

  useEffect(() => {    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStatus();
    const interval = setInterval(loadStatus, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>ትዕዛዝ በመፈለግ ላይ...</p>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="pt-20 min-h-screen px-4 py-10 text-white">
      <RingingAlertModal
        isOpen={alertOpen}
        title="ማሳወቂያ"
        message={alertMessage}
        onAcknowledge={() => setAlertOpen(false)}/>

      <div className="max-w-md mx-auto bg-gray-50 text-gray-950 border border-gray-300 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-amber-400 mb-1">የትዕዛዝ ሁኔታ</h1>
        <p className="text-sm text-gray-400 mb-6">ጠረጴዛ: {order.tableNumber}</p>

        {/* Timeline */}
        <div className="space-y-4 mb-6">
          {steps.map((step, idx) => {
            const isDone = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.key} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    isDone ? "bg-amber-500" : "bg-gray-800"
                  } ${isCurrent ? "animate-pulse" : ""}`}>
                  {step.icon}
                </div>
                <p className={isDone ? "text-white font-semibold" : "text-gray-500"}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Items */}
        <div className="border-t border-gray-300 pt-4 space-y-1">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-500">
              <span>{item.name} x{item.quantity}</span>
              <span>{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
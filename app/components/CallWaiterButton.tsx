"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CallWaiterButton() {
  const { tableNumber } = useCart();
  const [calling, setCalling] = useState(false);
  const [called, setCalled] = useState(false);

  async function handleCall() {
    if (!tableNumber) {
      alert("እባክህ መጀመሪያ QR code ስካን አድርግ ወይም ጠረጴዛ ቁጥር ግባ (Cart ውስጥ)");
      return;
    }

    setCalling(true);
    const res = await fetch("/api/waiter-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableNumber }),
    });
    const data = await res.json();

    setCalling(false);

    if (data.success) {
      setCalled(true);
      setTimeout(() => setCalled(false), 4000);
    } else {
      alert(data.message || "ስህተት ተፈጥሯል");
    }
  }

  return (
    <button
      onClick={handleCall}
      disabled={calling}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-3 rounded-full shadow-lg transition disabled:opacity-50"
    >
      <Phone size={18} className={calling ? "animate-bounce" : ""} />
      <span className="text-sm">
        {called ? "✅ ተጠርቷል!" : calling ? "እየጠራ ነው..." : "Call Waiter"}
      </span>
    </button>
  );
}
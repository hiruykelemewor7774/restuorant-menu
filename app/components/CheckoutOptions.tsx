"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

interface CheckoutOptionsProps {
  subtotal: number;
  onClose?: () => void;
}

type PaymentMethod = "telebirr" | "bank" | "manual";

export default function CheckoutOptions({ subtotal, onClose }: CheckoutOptionsProps) {
  const router = useRouter();
  const { cart, tableNumber, clearCart, guestInfo } = useCart();  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("telebirr");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const serviceCharge = 30;
  const totalAmount = subtotal + serviceCharge;

  async function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
       tableNumber,
       items: cart,
       paymentMethod: selectedMethod === "manual" ? "manual" : "chapa",
       guestInfo,
        }),     
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "ትዕዛዝ መፍጠር አልተቻለም");
        setIsSubmitting(false);
        return;
      }

      if (selectedMethod === "manual") {
        clearCart();
        if (onClose) onClose();
        // ደንበኛውን ወደ Track Order ገፅ ውሰድ (ringing notifications ጋር)
        router.push(`/track/${data.order.id}`);
        return;
      }

      // Telebirr / Bank → ወደ Chapa checkout ገጽ ውሰድ
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError("የክፍያ ማገናኛ አልተገኘም");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Order submit error:", err);
      setError("ስህተት ተፈጥሯል፣ እባክህ እንደገና ሞክር");
      setIsSubmitting(false);
    }
  }

  const paymentOptions: { value: PaymentMethod; title: string; subtitle: string; badge: string; badgeColor: string }[] = [
    {
      value: "telebirr",
      title: "ቴሌብር (Telebirr)",
      subtitle: "በቴሌብር በፍጥነት ይክፈሉ",
      badge: "ኦንላይን",
      badgeColor: "bg-blue-600",
    },
    {
      value: "bank",
      title: "ባንክ (CBE, Awash, Dashen...)",
      subtitle: "ማንኛውንም ባንክ በመጠቀም ይክፈሉ",
      badge: "ኦንላይን",
      badgeColor: "bg-purple-600",
    },
    {
      value: "manual",
      title: "በእጅ ክፍያ / ደረሰኝ ማያያዝ",
      subtitle: "ገንዘብ አስተላልፈው በኋላ ያረጋግጡ",
      badge: "በእጅ",
      badgeColor: "bg-emerald-600",
    },
  ];

  return (
    <div className="max-w-xl mx-auto p-6 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-400">የክፍያ አማራጭ ይምረጡ</h2>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold">
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleOrderSubmit} className="space-y-4">
        {paymentOptions.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              selectedMethod === opt.value
                ? "border-amber-400 bg-slate-800/80"
                : "border-slate-700 bg-slate-800/40 hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={selectedMethod === opt.value}
                onChange={() => setSelectedMethod(opt.value)}
                className="text-amber-500 focus:ring-amber-400 h-4 w-4"
              />
              <div>
                <p className="font-semibold text-lg">{opt.title}</p>
                <p className="text-sm text-slate-400">{opt.subtitle}</p>
              </div>
            </div>
            <span className={`${opt.badgeColor} text-xs px-2.5 py-1 rounded-full font-medium`}>
              {opt.badge}
            </span>
          </label>
        ))}

        <div className="pt-4 border-t border-slate-800 space-y-2 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>ንጥሎች ድምር (Subtotal):</span>
            <span>{subtotal} ብር</span>
          </div>
          <div className="flex justify-between">
            <span>የአገልግሎት ቻርጅ (Service Charge):</span>
            <span>{serviceCharge} ብር</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
            <span className="text-base font-semibold text-white">አጠቃላይ የሚከፈለው:</span>
            <span className="text-2xl font-bold text-amber-400">{totalAmount} ብር</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 py-3.5 font-bold transition-all rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg disabled:opacity-50 text-center"
        >
          {isSubmitting ? "እየተሰራ ነው..." : "ክፍያ አረጋግጥ (Proceed)"}
        </button>
      </form>
    </div>
  );
}
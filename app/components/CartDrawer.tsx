"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, changeQuantity, clearCart, totalPrice } = useCart();
  const [tableNumber, setTableNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleCheckout() {
    setMessage("");

    if (!tableNumber.trim()) {
      setMessage("እባክህ የጠረጴዛ ቁጥር ግባ");
      return;
    }
    if (cart.length === 0) {
      setMessage("Cart ባዶ ነው");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, items: cart }),
      });
      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "ትዕዛዝ መላክ አልተቻለም");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      clearCart();
      setTableNumber("");
    } catch {
      setMessage("የኔትወርክ ችግር ተፈጥሯል");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setSuccess(false);
    setMessage("");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={handleClose}
      ></div>

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900 border-l border-gray-800 z-50 flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-yellow-400">🛒 Cart</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-lg font-bold text-white mb-2">
              ትዕዛዝ በተሳካ ሁኔታ ተልኳል!
            </p>
            <p className="text-gray-400 text-sm mb-6">
              ዌይተር በቅርቡ ወደ ጠረጴዛዎ ይመጣል።
            </p>
            <button
              onClick={handleClose}
              className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-400"
            >
              ዝጋ
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-10">
                  Cart ባዶ ነው
                </p>
              ) : (
                <div className="space-y-3">
                  {cart.map((c) => (
                    <div
                      key={`${c.category}-${c.name}`}
                      className="flex items-center gap-3 bg-gray-800 rounded-lg p-2"
                    >
                      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-700 shrink-0">
                        <Image src={c.image} alt={c.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.price}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => changeQuantity(c.name, c.category, -1)}
                          className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600"
                        >
                          −
                        </button>
                        <span className="text-sm w-4 text-center">{c.quantity}</span>
                        <button
                          onClick={() => changeQuantity(c.name, c.category, 1)}
                          className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-800 p-4 space-y-3">
                <div className="flex justify-between font-bold text-white">
                  <span>ጠቅላላ</span>
                  <span>{totalPrice.toFixed(2)}</span>
                </div>

                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="የጠረጴዛ ቁጥር (ለምሳሌ: 5)"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                />

                {message && (
                  <p className="text-sm text-red-400">{message}</p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="w-full bg-yellow-500 text-black font-bold py-2.5 rounded-full hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {submitting ? "እየተላከ ነው..." : "ትዕዛዝ ላክ"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
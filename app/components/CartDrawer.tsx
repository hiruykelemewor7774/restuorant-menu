"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import CheckoutOptions from "./CheckoutOptions";
export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, changeQuantity, clearCart, totalPrice, tableNumber, setTableNumber } = useCart();
  const [message, setMessage] = useState("");
  
  // የክፍያ አማራጮች መስኮት (Checkout View) እንዲከፈት የሚረዳ state
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);

  // 1. ተጠቃሚው የጠረጴዛ ቁጥር ሞልቶ "ትዕዛዝ ላክ" ሲጫን የክፍያ አማራጮችን እናሳያለን
  function handleProceedToPayment() {
    setMessage("");

    if (!tableNumber.trim()) {
      setMessage("እባክህ የጠረጴዛ ቁጥር ግባ");
      return;
    }
    if (cart.length === 0) {
      setMessage("Cart ባዶ ነው");
      return;
    }

    // ወደ ክፍያ ምርጫ ማያ ገጽ እንሸጋገራለን
    setShowCheckoutOptions(true);
  }

  function handleClose() {
    setShowCheckoutOptions(false);
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
          <h2 className="text-lg font-bold text-yellow-400">
            {showCheckoutOptions ? "💳 የክፍያ አማራጮች" : "🛒 Cart"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* 2. ክፍያ መፈጸሚያ ገጽ (የመረጣቸውን የክፍያ መንገዶች ማሳየት) */}
        {showCheckoutOptions ? (
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={() => setShowCheckoutOptions(false)}
              className="text-sm text-yellow-400 hover:underline mb-4 flex items-center gap-1"
            >
              ← ወደ ካርት (Cart) ተመለስ
            </button>

            {/* እዚህጋ የሰራነውን CheckoutOptions እንጥላለን */}
            <CheckoutOptions 
              subtotal={totalPrice} 
              onClose={() => {
                clearCart();
                handleClose();
              }} 
            />
          </div>
        ) : (
          /* 3. መደበኛ የካርት (Cart) ዝርዝር ማሳያ */
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
                        <p className="text-sm font-medium truncate text-white">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.price}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => changeQuantity(c.name, c.category, -1)}
                          className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="text-sm w-4 text-center text-white">{c.quantity}</span>
                        <button
                          onClick={() => changeQuantity(c.name, c.category, 1)}
                          className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center"
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
                  <span>ጠቅላላ (Subtotal)</span>
                  <span>{totalPrice.toFixed(2)} ብር</span>
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
                  onClick={handleProceedToPayment}
                  className="w-full bg-yellow-500 text-black font-bold py-2.5 rounded-full hover:bg-yellow-400 transition"
                >
                  ወደ ክፍያ ሂድ (Proceed to Checkout)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
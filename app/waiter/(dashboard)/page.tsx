"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { foodMenu, drinkMenu, roomMenu, MenuItem } from "@/lib/menu-data";

type CartItem = MenuItem & { quantity: number; category: string };

type OrderItemResult = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  category: string;
};

type OrderResult = {
  id: string;
  tableNumber: string;
  notes: string | null;
  createdAt: string;
  items: OrderItemResult[];
};

const mainTabs = ["Food", "Drink", "Room"] as const;
type MainTab = (typeof mainTabs)[number];

export default function WaiterOrderPage() {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [mainTab, setMainTab] = useState<MainTab>("Food");
  const [foodCategory, setFoodCategory] = useState(Object.keys(foodMenu)[0]);
  const [drinkCategory, setDrinkCategory] = useState(Object.keys(drinkMenu)[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [lastOrder, setLastOrder] = useState<OrderResult | null>(null);

  function currentItems(): MenuItem[] {
    if (mainTab === "Food") return foodMenu[foodCategory];
    if (mainTab === "Drink") return drinkMenu[drinkCategory];
    return roomMenu;
  }

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.name === item.name && c.category === mainTab
      );
      if (existing) {
        return prev.map((c) =>
          c.name === item.name && c.category === mainTab
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { ...item, quantity: 1, category: mainTab }];
    });
  }

  function changeQuantity(name: string, category: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.name === name && c.category === category
            ? { ...c, quantity: c.quantity + delta }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  }

  async function handleSubmitOrder() {
    setMessage("");

    if (!tableNumber.trim()) {
      setMessage("እባክህ የጠረጴዛ ቁጥር ግባ");
      return;
    }
    if (cart.length === 0) {
      setMessage("ቢያንስ አንድ እቃ ምረጥ");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/waiter/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, items: cart, notes }),
      });
      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "ትዕዛዝ መላክ አልተቻለም");
        setSubmitting(false);
        return;
      }

      setLastOrder(data.order);
      setMessage("ትዕዛዝ በተሳካ ሁኔታ ተልኳል! ✅");
      setCart([]);
      setTableNumber("");
      setNotes("");
    } catch {
      setMessage("የኔትወርክ ችግር ተፈጥሯል");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/waiter/logout", { method: "POST" });
    router.replace("/waiter/login");
    router.refresh();
  }

  const total = cart.reduce((sum, c) => {
    const num = parseFloat(c.price.replace(/[^0-9.]/g, "")) || 0;
    return sum + num * c.quantity;
  }, 0);

  function receiptTotal(order: OrderResult) {
    return order.items
      .reduce(
        (sum, i) => sum + (parseFloat(i.price.replace(/[^0-9.]/g, "")) || 0) * i.quantity,
        0
      )
      .toFixed(2);
  }

  return (
    <div className="min-h-screen bg-gray-8000 relative z-10 pt-28 px-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 fot">የዌይተር ትዕዛዝ ገፅ</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          ውጣ (Logout)
        </button>
      </div>

      {/* Receipt */}
      {lastOrder && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center border-b pb-3 mb-3">
            <h2 className="text-xl font-bold">Kerami 🍽️</h2>
            <p className="text-xs text-gray-500">ደረሰኝ / Receipt</p>
          </div>
          <p className="text-sm">
            <strong>ጠረጴዛ:</strong> {lastOrder.tableNumber}
          </p>
          <p className="text-sm mb-2">
            <strong>ቀን:</strong> {new Date(lastOrder.createdAt).toLocaleString()}
          </p>
          <div className="border-t border-b py-2 my-2 space-y-1">
            {lastOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{item.price}</span>
              </div>
            ))}
          </div>
          {lastOrder.notes && (
            <p className="text-sm italic text-gray-600 mb-2">
              ማስታወሻ: {lastOrder.notes}
            </p>
          )}
          <div className="flex justify-between font-bold mb-4">
            <span>ጠቅላላ</span>
            <span>{receiptTotal(lastOrder)}</span>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-black text-gray-900 py-2 rounded-full text-sm hover:bg-gray-800"
            >
              🖨️ ደረሰኝ አትም
            </button>
            <button
              onClick={() => setLastOrder(null)}
              className="flex-1 border py-2 rounded-full text-sm hover:bg-gray-100"
            >
              ዝጋ
            </button>
          </div>
        </div>
      )}

      <div className="text-gray-900 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Left: Menu selection */}
        <div className="lg:col-span-2">
          {/* Table number */}
          <div className="text-gray-900 bg-white rounded-xl shadow p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              የጠረጴዛ ቁጥር
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="ለምሳሌ: 5"
              className="text-gray-900 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ማስታወሻ (አማራጭ)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ለምሳሌ: ስኳር አታድርግ፣ ቶሎ አምጣ..."
              className="text-gray-900 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={2}
            />
          </div>

          {/* Main tabs: Food / Drink / Room */}
          <div className="flex gap-3 mb-4 text-gray-900">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`px-5 py-2 rounded-full font-semibold transition-colors ${
                  mainTab === tab
                    ? "bg-amber-500 text-black"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sub-category tabs */}
          {mainTab === "Food" && (
            <div className="flex flex-wrap gap-2 mb-4 text-gray-900">
              {Object.keys(foodMenu).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFoodCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    foodCategory === cat
                      ? "bg-black text-white"
                      : "bg-white border hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          {mainTab === "Drink" && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(drinkMenu).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDrinkCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    drinkCategory === cat
                      ? "bg-black text-white"
                      : "bg-white border hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Item grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {currentItems().map((item) => (
              <button
                key={item.name}
                onClick={() => addToCart(item)}
                className="bg-white rounded-xl shadow overflow-hidden text-left hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="relative h-28 w-full bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-amber-600 font-bold text-sm">{item.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Cart */}
        <div className="bg-white rounded-xl shadow p-4 h-fit sticky top-28">
          <h2 className="text-lg font-bold mb-3">🛒 ትዕዛዝ ዝርዝር</h2>

          {cart.length === 0 ? (
            <p className="text-gray-400 text-sm">ገና ምንም እቃ አልተመረጠም</p>
          ) : (
            <div className="space-y-3">
              {cart.map((c) => (
                <div
                  key={`${c.category}-${c.name}`}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeQuantity(c.name, c.category, -1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-sm w-4 text-center">{c.quantity}</span>
                    <button
                      onClick={() => changeQuantity(c.name, c.category, 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between font-bold pt-2">
                <span>ጠቅላላ</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {message && (
            <p className="text-sm mt-3 text-center text-amber-600 font-medium">
              {message}
            </p>
          )}

          <button
            onClick={handleSubmitOrder}
            disabled={submitting}
            className="w-full mt-4 bg-amber-500 text-black font-semibold py-2 rounded-full hover:bg-amber-600 disabled:opacity-50"
          >
            {submitting ? "እየተላከ ነው..." : "ትዕዛዝ ላክ"}
          </button>
        </div>
      </div>
    </div>
  );
}
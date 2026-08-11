"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { playNotifySound } from "@/lib/notifySound";

type DbItem = {
  id: string;
  type: string;
  category: string;
  name: string;
  price: string;
  image: string;
};

type CartItem = {
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string;
};

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
  paymentStatus?: string;
  source?: string;
};

const mainTabs = ["Food", "Drink", "Room"] as const;
type MainTab = (typeof mainTabs)[number];

export default function WaiterOrderPage() {
  const router = useRouter();
  const [allItems, setAllItems] = useState<DbItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [mainTab, setMainTab] = useState<MainTab>("Food");
  const [subCategory, setSubCategory] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [lastOrder, setLastOrder] = useState<OrderResult | null>(null);
  const [readyOrders, setReadyOrders] = useState<OrderResult[]>([]);
  const knownReadyIds = useRef<Set<string>>(new Set());
  const firstReadyLoad = useRef(true);
  const [incomingOrders, setIncomingOrders] = useState<OrderResult[]>([]);
  const knownIncomingIds = useRef<Set<string>>(new Set());
  const firstIncomingLoad = useRef(true);

  // Menu ጫን
  useEffect(() => {
    fetch("/api/menu", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllItems(data.items);
          const firstFoodCategory = data.items.find(
            (i: DbItem) => i.type === "Food"
          )?.category;
          setSubCategory(firstFoodCategory || "");
        }
        setLoadingMenu(false);
      });
  }, []);

  // Ready orders ጫን + ድምጽ
  useEffect(() => {
    async function loadReadyOrders() {
      const res = await fetch("/api/waiter/orders?status=ready", { cache: "no-store" });
      const data = await res.json();
      if (!data.success) return;

      const newOnes = data.orders.filter(
        (o: OrderResult) => !knownReadyIds.current.has(o.id)
      );
      if (!firstReadyLoad.current && newOnes.length > 0) {
        playNotifySound();
      }

      data.orders.forEach((o: OrderResult) => knownReadyIds.current.add(o.id));
      setReadyOrders(data.orders);
      firstReadyLoad.current = false;
    }

    loadReadyOrders();
    const interval = setInterval(loadReadyOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Incoming pending orders (customer/manual) ጫን + ድምጽ
useEffect(() => {
  async function loadIncomingOrders() {
    const res = await fetch("/api/waiter/orders?status=pending", { cache: "no-store" });
    const data = await res.json();
    if (!data.success) return;

    const customerOrders = data.orders.filter((o: OrderResult) => o.source === "customer");

    const newOnes = customerOrders.filter(
      (o: OrderResult) => !knownIncomingIds.current.has(o.id)
    );
    if (!firstIncomingLoad.current && newOnes.length > 0) {
      playNotifySound();
    }

    customerOrders.forEach((o: OrderResult) => knownIncomingIds.current.add(o.id));
    setIncomingOrders(customerOrders);
    firstIncomingLoad.current = false;
  }

  loadIncomingOrders();
  const interval = setInterval(loadIncomingOrders, 5000);
  return () => clearInterval(interval);
}, []);

  async function handleDeliver(orderId: string, tableNum: string) {
    if (!confirm(`ጠረጴዛ ${tableNum} ላይ ትዕዛዙን በትክክል አድርሰሃል?`)) return;

    const res = await fetch(`/api/waiter/orders/${orderId}/deliver`, {
      method: "PUT",
    });
    const data = await res.json();

    if (data.success) {
      setReadyOrders((prev) => prev.filter((o) => o.id !== orderId));
    } else {
      alert(data.message || "ስህተት ተፈጥሯል");
    }
  }

   async function handleConfirmPayment(orderId: string) {
  const res = await fetch(`/api/waiter/orders/${orderId}/confirm-payment`, {
    method: "PUT",
  });
  const data = await res.json();
  if (data.success) {
    setIncomingOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: "paid" } : o))
    );
  } else {
    alert(data.message || "ስህተት ተፈጥሯል");
  }
}

async function handleForwardToKitchen(orderId: string) {
  const res = await fetch(`/api/waiter/orders/${orderId}/forward`, {
    method: "PUT",
  });
  const data = await res.json();
  if (data.success) {
    setIncomingOrders((prev) => prev.filter((o) => o.id !== orderId));
  } else {
    alert(data.message || "ስህተት ተፈጥሯል");
  }
}

  function itemsForTab(tab: MainTab): DbItem[] {
    return allItems.filter((i) => i.type === tab);
  }

  function categoriesForTab(tab: MainTab): string[] {
    return Array.from(new Set(itemsForTab(tab).map((i) => i.category)));
  }

  function currentItems(): DbItem[] {
    if (mainTab === "Room") return itemsForTab("Room");
    return itemsForTab(mainTab).filter((i) => i.category === subCategory);
  }

  function switchMainTab(tab: MainTab) {
    setMainTab(tab);
    if (tab !== "Room") {
      const firstCat = categoriesForTab(tab)[0] || "";
      setSubCategory(firstCat);
    }
  }

  function addToCart(item: DbItem) {
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
      return [
        ...prev,
        { name: item.name, price: item.price, image: item.image, quantity: 1, category: mainTab },
      ];
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
    <div className="min-h-screen bg-gray-50 pt-28 px-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto print:hidden">
        <h1 className="text-2xl font-bold">የዌይተር ትዕዛዝ ገፅ</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          ውጣ (Logout)
        </button>
      </div>

           {/* Incoming Orders (ከ customer የመጡ አዲስ ትዕዛዞች) */}
    {incomingOrders.length > 0 && (
      <div className="max-w-6xl mx-auto mb-6 print:hidden">
        <h2 className="text-lg font-bold mb-3">🆕 አዳዲስ ትዕዛዞች</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomingOrders.map((order) => (
            <div
              key={order.id}
              className="bg-amber-50 border border-amber-300 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-amber-700">ጠረጴዛ: {order.tableNumber}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus === "paid" ? "ተከፍሏል" : "አልተከፈለም"}
                </span>
              </div>
              <div className="text-sm space-y-1 mb-3">
                {order.items.map((item) => (
                  <p key={item.id}>
                    {item.name} x{item.quantity}
                  </p>
                ))}
              </div>
              {order.paymentStatus !== "paid" ? (
                <button
                  onClick={() => handleConfirmPayment(order.id)}
                  className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-full hover:bg-emerald-700"
                >
                  💵 ክፍያ አረጋግጥ
                </button>
              ) : (
                <button
                  onClick={() => handleForwardToKitchen(order.id)}
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-full hover:bg-blue-700"
                >
                  🚀 ወደ ኪችን ላክ
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

      {/* Ready Orders (ደረሱ ዝግጁ ናቸው) */}
      {readyOrders.length > 0 && (
        <div className="max-w-6xl mx-auto mb-6 print:hidden">
          <h2 className="text-lg font-bold mb-3">🔔 ዝግጁ የሆኑ ትዕዛዞች</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyOrders.map((order) => (
              <div
                key={order.id}
                className="bg-green-50 border border-green-300 rounded-xl p-4"
              >
                <p className="font-bold text-green-700 mb-2">
                  ጠረጴዛ: {order.tableNumber}
                </p>
                <div className="text-sm space-y-1 mb-3">
                  {order.items.map((item) => (
                    <p key={item.id}>
                      {item.name} x{item.quantity}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => handleDeliver(order.id, order.tableNumber)}
                  className="w-full bg-green-600 text-white font-semibold py-2 rounded-full hover:bg-green-700"
                >
                  🚚 ደረሰ (Delivered)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
              className="flex-1 bg-black text-white py-2 rounded-full text-sm hover:bg-gray-800"
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

      {loadingMenu ? (
        <p className="text-center text-gray-400">Menu እየጫነ ነው...</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
          {/* Left: Menu selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                የጠረጴዛ ቁጥር
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="ለምሳሌ: 5"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ማስታወሻ (አማራጭ)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ለምሳሌ: ስኳር አታድርግ፣ ቶሎ አምጣ..."
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={2}
              />
            </div>

            <div className="flex gap-3 mb-4">
              {mainTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchMainTab(tab)}
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

            {mainTab !== "Room" && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categoriesForTab(mainTab).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSubCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      subCategory === cat
                        ? "bg-black text-white"
                        : "bg-white border hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currentItems().map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-white rounded-xl shadow overflow-hidden text-left hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="relative h-28 w-full bg-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
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
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  totalMenuItems: number;
  totalWaiters: number;
  activeWaiters: number;
  pendingOrders: number;
  inKitchenOrders: number;
  readyOrders: number;
  todayOrders: number;
  todayDelivered: number;
};

type MenuBreakdown = Record<string, Record<string, number>>;

const typeColors: Record<string, string> = {
  Food: "text-amber-400 border-amber-500/30",
  Drink: "text-cyan-400 border-cyan-500/30",
  Room: "text-purple-400 border-purple-500/30",
};

const typeIcons: Record<string, string> = {
  Food: "🍽️",
  Drink: "🥤",
  Room: "🛏️",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [breakdown, setBreakdown] = useState<MenuBreakdown>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setBreakdown(data.menuBreakdown);
      }
      setLoading(false);
    }
    void loadStats();
  }, []);

  const cards = stats
    ? [
        { label: "አዲስ ትዕዛዞች (Pending)", value: stats.pendingOrders, color: "text-yellow-400", href: "/admin/orders" },
        { label: "ወደ ኩሽና የተላኩ", value: stats.inKitchenOrders, color: "text-blue-400", href: "/admin/orders" },
        { label: "ዝግጁ የሆኑ", value: stats.readyOrders, color: "text-green-400", href: "/admin/orders" },
        { label: "የዛሬ ትዕዛዞች", value: stats.todayOrders, color: "text-amber-400", href: "/admin/orders" },
        { label: "የዛሬ የተላኩ", value: stats.todayDelivered, color: "text-emerald-400", href: "/admin/orders" },
        { label: "የ Menu እቃዎች", value: stats.totalMenuItems, color: "text-purple-400", href: "/admin/menu" },
        { label: "ንቁ ዌይተሮች", value: `${stats.activeWaiters} / ${stats.totalWaiters}`, color: "text-pink-400", href: "/admin/staff" },
      ]
    : [];

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-2 text-yellow-500">Admin Page</h1>
      <p className="text-gray-400 mb-8">Welcome, admin. Overview of your restaurant.</p>

      {loading ? (
        <p className="text-gray-400">እየጫነ ነው...</p>
      ) : (
        <>
          {/* Order/Waiter Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition"
              >
                <p className="text-sm text-gray-400 mb-1">{card.label}</p>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              </Link>
            ))}
          </div>

          {/* Menu Breakdown by Type & Category */}
          <h2 className="text-xl font-bold mb-4 text-yellow-500">
            🍴 Menu Items በ Type እና Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Food", "Drink", "Room"].map((type) => {
              const categories = breakdown[type] || {};
              const total = Object.values(categories).reduce((a, b) => a + b, 0);

              return (
                <div
                  key={type}
                  className={`bg-gray-900 border rounded-xl p-5 ${typeColors[type]}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span>{typeIcons[type]}</span>
                      <span>{type}</span>
                    </h3>
                    <span className="text-sm bg-gray-800 px-3 py-1 rounded-full">
                      ጠቅላላ: {total}
                    </span>
                  </div>

                  {Object.keys(categories).length === 0 ? (
                    <p className="text-gray-500 text-sm">ምንም እቃ የለም</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(categories).map(([category, count]) => (
                        <div
                          key={category}
                          className="flex justify-between items-center bg-gray-800 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-gray-300">{category}</span>
                          <span className="text-sm font-bold text-gray-200">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/admin/menu"
                    className="mt-4 inline-block text-xs text-gray-400 hover:text-yellow-400 transition"
                  >
                    → ማስተዳደር
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-block bg-amber-500 text-black font-semibold px-6 py-2.5 rounded-full hover:bg-amber-600 transition"
            >
              Go to Menu
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
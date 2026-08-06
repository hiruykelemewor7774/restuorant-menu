"use client";

import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  QrCode, 
  Users 
} from "lucide-react";

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

type WaiterSale = {
  waiterId: string;
  name: string;
  totalSales: number;
  orderCount: number;
};

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
  const [waiterSales, setWaiterSales] = useState<WaiterSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setBreakdown(data.menuBreakdown);
        setWaiterSales(data.waiterSales || []);
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
    <div className="text-white p-6 md:p-8 ml-0 w-full">
      <h1 className="text-3xl font-bold mb-2 text-yellow-500">Admin Page</h1>
      <p className="text-gray-400 mb-8">Welcome, admin. Overview of your restaurant.</p>

      {/* Newly Added Admin Management Action Buttons Section */}
      <div className="mt-6 mb-10 last:">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Quick Management Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
    
          {/* 1. Dashboard Action Button */}
          <Link 
            href="/admin" 
            className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                <LayoutDashboard size={22} />
              </div>
              <span className="font-medium text-gray-200 group-hover:text-white">Dashboard</span>
            </div>
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md">View</span>
          </Link>

          {/* 2. Menu Management Action Button */}
          <Link 
            href="/admin/menu" 
            className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                <UtensilsCrossed size={22} />
              </div>
              <span className="font-medium text-gray-200 group-hover:text-white">Menu Management</span>
            </div>
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md">Manage</span>
          </Link>

          {/* 3. Live Orders Action Button */}
          <Link 
            href="/admin/orders" 
            className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                <ClipboardList size={22} />
              </div>
              <span className="font-medium text-gray-200 group-hover:text-white">Live Orders</span>
            </div>
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md">Track</span>
          </Link>

          {/* 4. Table & QR Generator Action Button */}
          <Link 
            href="/admin/tables" 
            className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                <QrCode size={22} />
              </div>
              <span className="font-medium text-gray-200 group-hover:text-white">Table & QR Generator</span>
            </div>
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md">Generate</span>
          </Link>

          {/* 5. Manage Staff Auth Action Button */}
          <Link 
            href="/admin/staff" 
            className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                <Users size={22} />
              </div>
              <span className="font-medium text-gray-200 group-hover:text-white">Manage Staff Auth</span>
            </div>
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md">Control</span>
          </Link>

        </div>
      </div>

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
            <h2 className="text-xl font-bold mb-4 mt-10 text-yellow-500">
              💰 በ Waiter የተከፋፈለ ሽያጭ (የተከፈለ ብቻ)
            </h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {waiterSales.length === 0 ? (
                <p className="text-gray-400 text-sm p-4">ገና ምንም የተከፈለ ትዕዛዝ የለም</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-gray-300">
                    <tr>
                      <th className="text-left p-3">Waiter</th>
                      <th className="text-right p-3">ትዕዛዞች</th>
                      <th className="text-right p-3">ጠቅላላ ሽያጭ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waiterSales.map((w) => (
                      <tr key={w.waiterId} className="border-t border-gray-800">
                        <td className="p-3">{w.name}</td>
                        <td className="p-3 text-right">{w.orderCount}</td>
                        <td className="p-3 text-right text-amber-400 font-bold">
                          {w.totalSales.toFixed(2)} ETB
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-6 gap-3">
               <Link
                  href="/admin/reports"
                  className="inline-block bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-full hover:bg-yellow-400 transition"
  >
                  📊 ሙሉ ሪፖርት ይመልከቱ
              </Link>
              <Link
                href="/"
                className="inline-block bg-amber-500 text-black font-semibold px-6 py-2.5 rounded-full hover:bg-amber-600 transition"
              >
                Go to Menu
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
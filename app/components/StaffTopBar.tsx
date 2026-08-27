"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Bell, Search } from "lucide-react";
import { useRestaurantSettings } from "../context/SettingsContext";

const roleConfig: Record<string, { label: string; extra?: string }> = {
  admin: { label: "Admin Dashboard" },
  waiter: { label: "Waiter Portal", extra: "🟢 Active" },
  kitchen: { label: "Kitchen Display (KDS)", extra: "🔊 Sound On" },
  store: { label: "Store / Inventory" },
  receptionist: { label: "Reception / Cashier", extra: "Counter 01" },
};

export default function StaffTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { restaurantName } = useRestaurantSettings();

  const role = Object.keys(roleConfig).find((r) => pathname.startsWith(`/${r}`));
  if (!role) return null;

  const config = roleConfig[role];

  async function handleLogout() {
    await fetch(`/api/${role}/logout`, { method: "POST" });
    router.push(`/${role}/login`);
    router.refresh();
  }

  return (
    <header className="nav-header fixed h-13 w-full text-white flex items-center justify-between px-6 py-4 top-0 left-0 right-0 z-50 border-b border-white/10 gap-4">
      
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-lg font-bold text-amber-400 truncate">
          🍽️ {restaurantName} — {config.label}
        </h1>
        {config.extra && (
          <span className="hidden sm:inline text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">
            {config.extra}
          </span>
        )}
      </div>

      {/* Search bar (Admin ላይ ብቻ) */}
      {role === "admin" && (
        <div className="hidden md:flex items-center flex-1 max-w-xs border border-gray-700 rounded-full px-3 py-1.5">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search menu, staff, orders..."
            className="bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500 w-full"
          />
        </div>
      )}

      <div className="flex items-center gap-3 shrink-0">
        <button className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-500 transition">
          <Bell size={18} />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
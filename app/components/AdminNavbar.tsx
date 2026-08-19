"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, LogOut, User } from "lucide-react";

export default function AdminNavbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    // ለጊዜው Menu Management ገጽ ላይ query param ጋር ይላካል
    router.push(`/admin/menu?q=${encodeURIComponent(search)}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-gray-950 border-b border-gray-800 px-6 py-3 flex items-center justify-between gap-4">
      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl">🍽️</span>
        <span className="font-bold text-amber-400 hidden sm:inline">
          Kerami RMS
        </span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu, staff, orders..."
          className="w-full bg-gray-900 border border-gray-800 rounded-full pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
        />
      </form>

      <div className="flex items-center gap-3 shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white transition"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-72 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden py-2 text-sm text-gray-300 z-50">
              <p className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold">
                Notifications
              </p>
              <div className="px-4 py-2 hover:bg-gray-800">
                ⚠️ Low stock alert on Store items
              </div>
              <div className="px-4 py-2 hover:bg-gray-800">
                📦 New kitchen request pending approval
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-full px-3 py-2 text-sm text-white transition"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold">
              <User size={14} />
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden py-1 text-sm z-50">
              <button
                onClick={() => {
                  setShowProfile(false);
                  router.push("/admin");
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-800 text-gray-200 transition"
              >
                Profile Settings
              </button>
              <div className="border-t border-gray-800 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-500/10 text-red-400 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
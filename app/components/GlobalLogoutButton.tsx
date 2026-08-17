"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { WasteLogCountAggregateInputType } from '../generated/prisma/models/WasteLog';

export default function GlobalLogoutButton() {
  const pathname = usePathname();
  const router = useRouter();

  let role: "admin" | "waiter" | "kitchen" | null = null;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    role = "admin";
  } else if (pathname.startsWith("/waiter") && pathname !== "/waiter/login") {
    role = "waiter";
  } else if (pathname.startsWith("/kitchen") && pathname !== "/kitchen/login") {
    role = "kitchen";
  }

  if (!role) return null;

  async function handleLogout() {
    await fetch(`/api/${role}/logout`, { method: "POST" });
    router.replace(`/${role}/login`);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="fixed top-24 right-4 [z-60] flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg transition text-sm font-semibold">
      <LogOut size={16} />
      Logout
    </button>
  );
}
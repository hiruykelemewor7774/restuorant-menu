"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const roleLabels: Record<string, string> = {
  admin: "Admin Panel",
  waiter: "Waiter Station",
  kitchen: "Kitchen Screen",
  store: "Store Panel",
  receptionist: "Receptionist Desk",
};

export default function StaffTopBar() {
  const pathname = usePathname();
  const router = useRouter();

  const role = Object.keys(roleLabels).find((r) => pathname.startsWith(`/${r}`));
  if (!role) return null;

  async function handleLogout() {
    await fetch(`/api/${role}/logout`, { method: "POST" });
    router.push(`/${role}/login`);
    router.refresh();
  }

  return (
    <header className="nav-header fixed h-20 w-full text-white flex items-center justify-between px-6 py-4 top-0 left-0 right-0 z-50 border-b border-white/10 md:ml-64">
      <h1 className="text-lg font-bold text-amber-400">🍽️ Kereami — {roleLabels[role]}</h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
      >
        <LogOut size={16} />
        ውጣ
      </button>
    </header>
  );
}
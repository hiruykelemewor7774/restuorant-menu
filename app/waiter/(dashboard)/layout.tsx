"use client";

import { useRouter } from "next/navigation";
import { Grid3x3, UtensilsCrossed, ClipboardList, Receipt, TrendingUp } from "lucide-react";
import SessionGuard from "@/app/waiter/components/SessionGuard";
import RoleSidebar from "@/app/components/RoleSidebar";

const waiterLinks = [
  { href: "/waiter", label: "Tables / Floor Plan", icon: Grid3x3 },
  { href: "/waiter", label: "New Order", icon: UtensilsCrossed },
  { href: "/waiter", label: "Active Orders", icon: ClipboardList },
  { href: "/waiter", label: "Bill / Checkout", icon: Receipt },
  { href: "/waiter", label: "My Performance", icon: TrendingUp },
];

export default function WaiterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/waiter/logout", { method: "POST" });
    router.replace("/waiter/login");
    router.refresh();
  }

  return (
    <SessionGuard>
      <div className="flex min-h-screen bg-gray-950">
        <RoleSidebar title="Waiter Panel" links={waiterLinks} onLogout={handleLogout} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </SessionGuard>
  );
}
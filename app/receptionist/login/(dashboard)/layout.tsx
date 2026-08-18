"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, CreditCard, CalendarCheck, Receipt, DollarSign } from "lucide-react";
import RoleSidebar from "@/app/components/RoleSidebar";

const receptionistLinks = [
  { href: "/receptionist/login", label: "Dashboard", icon: LayoutDashboard },
  { href: "/receptionist/login", label: "Billing & Checkout", icon: CreditCard },
  { href: "/receptionist/login", label: "Reservations", icon: CalendarCheck },
  { href: "/receptionist/login", label: "Receipts", icon: Receipt },
  { href: "/receptionist/login", label: "Cash Drawer Report", icon: DollarSign },
];

export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/receptionist/me", { cache: "no-store" });
      if (!res.ok) router.replace("/receptionist/login");
    }
    check();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/receptionist/logout", { method: "POST" });
    router.replace("/receptionist/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <RoleSidebar
        title="Reception Panel"
        links={receptionistLinks}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
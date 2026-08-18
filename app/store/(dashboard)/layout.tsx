"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inbox, Flame, CheckCircle, History } from "lucide-react";
import RoleSidebar from "@/app/components/RoleSidebar";

const kitchenLinks = [
  { href: "/kitchen", label: "Live Orders", icon: Inbox },
  { href: "/kitchen", label: "Preparing", icon: Flame },
  { href: "/kitchen", label: "Ready for Pickup", icon: CheckCircle },
  { href: "/kitchen", label: "History", icon: History },
];

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/kitchen/me", { cache: "no-store" });
      if (!res.ok) router.replace("/kitchen/login");
    }
    check();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/kitchen/logout", { method: "POST" });
    router.replace("/kitchen/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <RoleSidebar title="Kitchen Panel" links={kitchenLinks} onLogout={handleLogout} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
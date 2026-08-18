"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ChefHat,
  Trash2,
  Clock,
  BarChart3,
  BookOpen,
  Truck,
} from "lucide-react";
import RoleSidebar from "@/app/components/RoleSidebar";

const storeLinks = [
  { href: "/store", label: "Dashboard", icon: LayoutDashboard },
  { href: "/store/inventory", label: "Inventory", icon: Package },
  { href: "/store/purchases", label: "Purchases", icon: ShoppingCart },
  { href: "/store/kitchen-requests", label: "Kitchen Requests", icon: ChefHat },
  { href: "/store/waste", label: "Waste", icon: Trash2 },
  { href: "/store/expiry", label: "Expiry", icon: Clock },
  { href: "/store/reports", label: "Reports", icon: BarChart3 },
  { href: "/store/recipes", label: "Recipes", icon: BookOpen },
  { href: "/store/suppliers", label: "Suppliers", icon: Truck },
];

export default function StoreSidebarWrapper() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/store/logout", { method: "POST" });
    router.replace("/store/login");
    router.refresh();
  }

  return (
    <RoleSidebar title="Store Panel" links={storeLinks} onLogout={handleLogout} />
  );
}
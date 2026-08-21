"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/store", label: "Dashboard" },
  { href: "/store/inventory", label: "Inventory" },
  { href: "/store/purchases", label: "Purchases" },
  { href: "/store/kitchen-requests", label: "Kitchen Requests" },
  { href: "/store/waste", label: "Waste" },
  { href: "/store/expiry", label: "Expiry" },
  { href: "/store/reports", label: "Reports" },
  { href: "/store/recipes", label: "Recipes" },
  { href: "/store/suppliers", label: "Suppliers" },
];

export default function StoreTabs() {
  const pathname = usePathname();
  // const router = useRouter();

  // async function handleLogout() {
  //   await fetch("/api/store/logout", { method: "POST" });
  //   router.replace("/store/login");
  //   router.refresh();
  // }

  return (
    <div className="border-b text-gray-800 border-gray-400 bg-gray-300 px-6 py-4 mt-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-amber-500">
          🏪 Store Management
        </h1>
        {/* <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold">
          Logout
        </button> */}
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
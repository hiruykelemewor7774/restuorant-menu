"use client";

import { useState } from "react";
import Image from "next/image";
import { User, LogOut, ChevronDown, Lock, Utensils, ChefHat } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import CartDrawer from "./CartDrawer";
import { Menu } from "lucide-react";
import { useUI } from "../context/UIContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { totalItems } = useCart();
  const { toggleSidebar } = useUI();
  const { t } = useLanguage();
  const [cartOpen, setCartOpen] = useState(false);

  const pathname = usePathname();

async function handleLogout() {
  let role: "admin" | "waiter" | "kitchen" = "admin";

  if (pathname.startsWith("/waiter")) role = "waiter";
  else if (pathname.startsWith("/kitchen")) role = "kitchen";
  else if (pathname.startsWith("/admin")) role = "admin";

  await fetch(`/api/${role}/logout`, { method: "POST" });
  setShowDropdown(false);
  router.push(`/${role}/login`);
  router.refresh();
}

  return (
    <>
      <header className="bg h-20 w-screen fixed text-white flex items-center justify-between px-6 py-4 backdrop-blur-md  top-0 left-0 right-0 z-50">
        {/* Hamburger Menu - Mobile ላይ ብቻ ይታያል */}
<button
  onClick={toggleSidebar}
  className="md:hidden p-2 rounded-lg bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-white mr-2">
  <Menu size={20} />
</button>
     
    <div className='mt-3 block dark-content:hidden p-1 shrink-0 items-center space-x-2 cursor-pointer logo-light'>
          <Image
                alt="Company logo"
                width={90}
                height={50}
                style={{ width: "auto", height: "auto" }}
                className=" object-cover"
                priority
                src="/image/kereamilm.png"/>
    </div>

    <div className='mt-3 shrink-0 hidden items-center space-x-2 cursor-pointer logo-dark'>
          <Image
                alt="Company logo"
                width={90}
                height={50}
                style={{ width: "auto", height: "auto" }}
                className=" object-cover"
                priority
                src="/image/kereamidm.png"/>
    </div>

        {/* Center links (All, Food, Drink, Room navigation links have been completely removed from the navbar as requested) */}

        {/* Right section containing Staff Portal, Cart button, and User dropdown menu */}
        <div className="relative flex items-center gap-4">
          
          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-full hover:bg-gray-200 dark:bg-gray-800/80 dark:hover:bg-gray-800 border border-gray-300 text-white transition cursor-pointer">
            <FaShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-gray-200 dark:bg-gray-800/80 dark:hover:bg-gray-800 px-4 py-2 rounded-full border border-gray-300 text-sm transition text-white cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>{t("staffPortal")}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-gray-950 shadow-md cursor-pointer">
            <User size={20} />
          </div>

          {/* Dropdown Menu (Opened when Staff Portal is clicked) */}
          {showDropdown && (
            <div className="absolute right-0 top-14 w-40 border border-gray-300 rounded-xl shadow-2xl overflow-hidden py-1 z-50 text-white">
              
              <button 
                onClick={() => { setShowDropdown(false); router.push("/admin/login"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm dark:bg-gray-900 hover:bg-gray-200 transition text-gray-200 cursor-pointer">
                <Lock size={16} className="text-amber-400" />
                <span>{t("adminLogin")}</span>
              </button>

              <button 
                onClick={() => { setShowDropdown(false); router.push("/waiter"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-200 cursor-pointer">
                <Utensils size={16} className="text-amber-400" />
                <span>{t("waiterLogin")}</span>
              </button>

              <button 
                onClick={() => { setShowDropdown(false); router.push("/kitchen"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-200 cursor-pointer">
                <ChefHat size={16} className="text-amber-400" />
                <span>{t("kitchenLogin")}</span>
              </button>

              <button 
                onClick={() => { setShowDropdown(false); router.push("/store/login"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-200 cursor-pointer">
                <Utensils size={16} className="text-amber-400" />
                <span>{t("storeLogin") || "Store Login"}</span>
              </button>

              <div className="border-t border-gray-800 my-1"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500 transition cursor-pointer">
                <LogOut size={16} />
                <span>{t("logout")}</span>
              </button>

            </div>
          )}

        </div>

      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
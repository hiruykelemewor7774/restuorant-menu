"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, ChevronDown, Lock, Utensils, ChefHat } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-md border-b border-gray-800/40 sticky top-0 z-50">
        
        {/* የግራው ክፍል (Logo with Image) */}
        <Link href="/campany" className="flex items-center space-x-2 cursor-pointer">
          <Image src="/pizza.Webp" width={35} height={35} className="rounded-full object-cover" alt="Company logo"/>
          <span className="text-amber-400 font-bold text-xl tracking-wider">Kerami</span>
        </Link>

        {/* መሃል ላይ ያሉት ሊንኮች */}
        <nav className="flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-amber-400 transition cursor-pointer">
            All
          </Link>
          <Link href="/Food" className="hover:text-amber-400 transition cursor-pointer">
            Food
          </Link>
          <Link href="/drink" className="hover:text-amber-400 transition cursor-pointer">
            Drink
          </Link>
          <Link href="/room" className="hover:text-amber-400 transition cursor-pointer">
            Room
          </Link>
        </nav>

        {/* የቀኝ በኩል Staff Portal, Cart, እና Dropdown */}
        <div className="relative flex items-center gap-4">
          
          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-full bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-white transition cursor-pointer"
          >
            <FaShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-800 px-4 py-2 rounded-full border border-gray-700 text-sm transition text-white cursor-point">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Staff Portal</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-gray-950 shadow-md cursor-pointer">
            <User size={20} />
          </div>

          {/* Dropdown Menu (Staff Portal ሲጫን የሚከፈተው) */}
          {showDropdown && (
            <div className="absolute right-0 top-14 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden py-1 z-50 text-white">
              
              <button 
                onClick={() => { setShowDropdown(false); router.push("/admin/login"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer"
              >
                <Lock size={16} className="text-amber-400" />
                <span>Admin Login</span>
              </button>

              <button 
                onClick={() => { setShowDropdown(false); router.push("/waiter"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer">
                <Utensils size={16} className="text-amber-400" />
                <span>Waiter Login</span>
              </button>

              <button 
                onClick={() => { setShowDropdown(false); router.push("/kitchen"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer">
                <ChefHat size={16} className="text-amber-400" />
                <span>Kitchen Login</span>
              </button>

              <div className="border-t border-gray-800 my-1"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
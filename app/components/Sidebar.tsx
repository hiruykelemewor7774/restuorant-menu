"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  QrCode, 
  Users, 
  Settings, 
  Globe, 
  Moon, 
  Sun,
  ChevronDown,
  Grid,
  Coffee,
  Wine,
  Home
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage, Language } from "../context/LanguageContext";

interface SidebarProps {
  isAdmin?: boolean; // Determines if the logged-in user is an admin
}

const languageOptions: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "am", label: "አማርኛ (Amharic)", flag: "🇪🇹" },
  { code: "ti", label: "ትግርኛ (Tigrinya)", flag: "🇪🇹" },
  { code: "om", label: "Afaan Oromoo", flag: "🇪🇹" },
  { code: "zh", label: "中文 (Chinese)", flag: "🇨🇳" },
];

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  // Dark Mode - ትክክለኛ Theme Context
  const { theme, toggleTheme } = useTheme();

  // Language - ትክክለኛ Language Context
  const { language, setLanguage, t } = useLanguage();

  // Main controller state for opening/closing the Settings dropdown menu
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  // Nested controller state for opening/closing the Language options submenu
  const [showLangSubMenu, setShowLangSubMenu] = useState(false);

  const currentLangLabel =
    languageOptions.find((l) => l.code === language)?.label || "English";

  return (
    <aside className="mt-28 w-64 bg-gray-950 text-white flex flex-col justify-between p-4 border-r border-gray-800 select-none relative z-30 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      {/* Top section containing navigation links and system settings */}
      <div>
        <div className="text-amber-400 text-2xl font-black mb-8 px-2 tracking-wide">
          Kerami RMS
        </div>

        <nav className="space-y-2 pb-6">
          {/* Admin Management Navigation Links - Displayed ONLY when isAdmin is true */}
          {isAdmin && (
            <div className="space-y-2 pb-4 border-b border-gray-800/60">
              <div className="px-3 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">
                Admin Control
              </div>
              <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
                <LayoutDashboard size={20} /> {t("dashboard")}
              </Link>
              <Link href="/admin/menu" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
                <UtensilsCrossed size={20} /> {t("menuManagement")}
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
                <ClipboardList size={20} /> {t("liveOrders")}
              </Link>
              <Link href="/admin/tables" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
                <QrCode size={20} /> {t("tableQr")}
              </Link>
              <Link href="/admin/staff" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
                <Users size={20} /> {t("manageStaff")}
              </Link>
            </div>
          )}

          {/* User / Public Navigation Section (Always visible for customers/regular users) */}
          <div className="pt-2 pb-2">
            <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Public Navigation
            </div>
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
              <Grid size={20} /> {t("all")}
            </Link>
            <Link href="/Food" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
              <Coffee size={20} /> {t("food")}
            </Link>
            <Link href="/drink" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
              <Wine size={20} /> {t("drink")}
            </Link>
            <Link href="/room" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
              <Home size={20} /> {t("room")}
            </Link>
          </div>

          {/* Settings Dropdown Container */}
          <div className="relative pt-2 border-t border-gray-800/60">
            <button 
              onClick={() => {
                setShowSettingsDropdown(!showSettingsDropdown);
                setShowLangSubMenu(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-200 transition border border-gray-800 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-amber-400" />
                <span className="font-medium text-sm">{t("settings")}</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${showSettingsDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu Content Panel */}
            {showSettingsDropdown && (
              <div className="mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden py-1 text-white space-y-1">
                
                {/* 1. Dark Mode Toggle Control Button - ትክክለኛ functional */}
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {theme === "dark" ? <Moon size={16} className="text-amber-400" /> : <Sun size={16} className="text-amber-400" />}
                    <span>Dark Mode</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${theme === "dark" ? "bg-amber-500/20 text-amber-400" : "bg-gray-800 text-gray-400"}`}>
                    {theme === "dark" ? "On" : "Off"}
                  </span>
                </button>

                <div className="border-t border-gray-800 my-1"></div>

                {/* 2. Language Selector Trigger Button - ትክክለኛ functional */}
                <div>
                  <button 
                    onClick={() => setShowLangSubMenu(!showLangSubMenu)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe size={16} className="text-amber-400" />
                      <span>Language ({currentLangLabel})</span>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${showLangSubMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* Sub-menu panel listing available languages */}
                  {showLangSubMenu && (
                    <div className="bg-gray-950 border-t border-b border-gray-800 py-1 space-y-0.5">
                      {languageOptions.map((opt) => (
                        <button
                          key={opt.code}
                          onClick={() => {
                            setLanguage(opt.code);
                            setShowLangSubMenu(false);
                            setShowSettingsDropdown(false);
                          }}
                          className="w-full text-left px-8 py-2 text-xs hover:bg-gray-800 text-gray-300 transition cursor-pointer"
                        >
                          {opt.flag} {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </nav>
      </div>

    </aside>
  );
}
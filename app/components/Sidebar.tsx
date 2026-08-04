"use client";

import { useState } from "react";
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
  ChevronDown
} from "lucide-react";

export default function Sidebar() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState("English");
  
  // የ Settings Dropdown ዋና መቆጣጠሪያ
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  // በውስጡ የ Languages ዝርዝር ለመክፈት
  const [showLangSubMenu, setShowLangSubMenu] = useState(false);

  return (
    <aside className="h-screen w-64 bg-gray-950 text-white flex flex-col justify-between p-4 border-r border-gray-800 select-none relative z-30 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      {/* የላይኛው የናቪጌሽን ሊንኮች እና Settings */}
      <div>
        <div className="text-amber-400 text-2xl font-black mb-8 px-2 tracking-wide">
          Kerami RMS
        </div>

        <nav className="space-y-2 pb-6">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/menu" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
            <UtensilsCrossed size={20} /> Menu Management
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
            <ClipboardList size={20} /> Live Orders
          </Link>
          {/* ትክክለኛው የ Table & QR Generator ዱካ (path) ተመልሷል */}
          <Link href="/admin/tables" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
            <QrCode size={20} /> Table & QR Generator
          </Link>
          <Link href="/admin/staff" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition">
            <Users size={20} /> Manage Staff Auth
          </Link>

          {/* Settings ከ Manage Staff Auth ስር */}
          <div className="relative pt-1">
            <button 
              onClick={() => {
                setShowSettingsDropdown(!showSettingsDropdown);
                setShowLangSubMenu(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-200 transition border border-gray-800 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-amber-400" />
                <span className="font-medium text-sm">Settings</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${showSettingsDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Settings Dropdown Menu */}
            {showSettingsDropdown && (
              <div className="mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden py-1 text-white space-y-1">
                
                {/* 1. Dark Mode Toggle */}
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {isDarkMode ? <Moon size={16} className="text-amber-400" /> : <Sun size={16} className="text-amber-400" />}
                    <span>Dark Mode</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? "bg-amber-500/20 text-amber-400" : "bg-gray-800 text-gray-400"}`}>
                    {isDarkMode ? "On" : "Off"}
                  </span>
                </button>

                <div className="border-t border-gray-800 my-1"></div>

                {/* 2. Language Dropdown Trigger */}
                <div>
                  <button 
                    onClick={() => setShowLangSubMenu(!showLangSubMenu)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe size={16} className="text-amber-400" />
                      <span>Language ({language})</span>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${showLangSubMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* Sub-menu for Languages */}
                  {showLangSubMenu && (
                    <div className="bg-gray-950 border-t border-b border-gray-800 py-1 space-y-0.5">
                      <button 
                        onClick={() => { setLanguage("English"); setShowLangSubMenu(false); setShowSettingsDropdown(false); }}
                        className="w-full text-left px-8 py-2 text-xs hover:bg-gray-800 text-gray-300 transition cursor-pointer"
                      >
                        🇬🇧 English
                      </button>
                      <button 
                        onClick={() => { setLanguage("አማርኛ"); setShowLangSubMenu(false); setShowSettingsDropdown(false); }}
                        className="w-full text-left px-8 py-2 text-xs hover:bg-gray-800 text-gray-300 transition cursor-pointer"
                      >
                        🇪🇹 አማርኛ (Amharic)
                      </button>
                      <button 
                        onClick={() => { setLanguage("ትግርኛ"); setShowLangSubMenu(false); setShowSettingsDropdown(false); }}
                        className="w-full text-left px-8 py-2 text-xs hover:bg-gray-800 text-gray-300 transition cursor-pointer"
                      >
                        🇪🇹 ትግርኛ (Tigrinya)
                      </button>
                      <button 
                        onClick={() => { setLanguage("Afaan Oromoo"); setShowLangSubMenu(false); setShowSettingsDropdown(false); }}
                        className="w-full text-left px-8 py-2 text-xs hover:bg-gray-800 text-gray-300 transition cursor-pointer"
                      >
                        🇪🇹 Afaan Oromoo
                      </button>
                      <button 
                        onClick={() => { setLanguage("中文"); setShowLangSubMenu(false); setShowSettingsDropdown(false); }}
                        className="w-full text-left px-8 py-2 text-xs hover:bg-gray-800 text-gray-300 transition cursor-pointer"
                      >
                        🇨🇳 中文 (Chinese)
                      </button>
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
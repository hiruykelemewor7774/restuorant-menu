"use client";

import Link from "next/link";
import {
  Settings,
  Globe,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage, Language } from "../context/LanguageContext";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const languageOptions: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "am", label: "አማርኛ (Amharic)", flag: "🇪🇹" },
  { code: "ti", label: "ትግርኛ (Tigrinya)", flag: "🇪🇹" },
  { code: "om", label: "Afaan Oromoo", flag: "🇪🇹" },
  { code: "zh", label: "中文 (Chinese)", flag: "🇨🇳" },
];

export default function RoleSidebar({
  title,
  links,
  onLogout,
}: {
  title: string;
  links: NavLink[];
  onLogout: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const [showLangSub, setShowLangSub] = useState(false);

  const currentLangLabel =
    languageOptions.find((l) => l.code === language)?.label || "English";

  return (
    <aside className="sidebar-nav w-64 h-screen sticky top-0 text-white flex flex-col justify-between p-4 border-r border-white/10 select-none z-30">
      <div className="pt-2">
        <div className="px-3 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-4">
          {title}
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition"
              >
                <Icon size={20} /> {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        {/* Settings Dropdown */}
        <div className="relative pt-2 border-t border-gray-800/60">
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowLangSub(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-200 transition border border-gray-800 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-amber-400" />
              <span className="font-medium text-sm">Settings</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                showSettings ? "rotate-180" : ""
              }`}
            />
          </button>

          {showSettings && (
            <div className="mt-2 w-full border border-gray-700 rounded-xl shadow-xl overflow-hidden py-1 text-white space-y-1">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {theme === "dark" ? (
                    <Moon size={16} className="text-amber-400" />
                  ) : (
                    <Sun size={16} className="text-amber-400" />
                  )}
                  <span>Dark Mode</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    theme === "dark"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {theme === "dark" ? "On" : "Off"}
                </span>
              </button>

              <div className="border-t border-gray-800 my-1"></div>

              <div>
                <button
                  onClick={() => setShowLangSub(!showLangSub)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe size={16} className="text-amber-400" />
                    <span>Language ({currentLangLabel})</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${
                      showLangSub ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showLangSub && (
                  <div className="border-t border-b border-gray-800 py-1 space-y-0.5">
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => {
                          setLanguage(opt.code);
                          setShowLangSub(false);
                          setShowSettings(false);
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

        <button
          onClick={onLogout}
          className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
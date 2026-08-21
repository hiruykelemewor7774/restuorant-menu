"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, UtensilsCrossed, ClipboardList, QrCode, Users, 
  Settings, Globe, Moon, Sun, ChevronDown, Grid, Coffee, Wine, Home,
  ChefHat, Utensils, BedDouble, Store as StoreIcon,
  BarChart3, CreditCard, Cog, FileText, PackagePlus, PackageMinus,
  AlertTriangle, Truck, FileBarChart, Receipt, Wallet, CalendarCheck
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage, Language } from "../context/LanguageContext";

const languageOptions: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "am", label: "አማርኛ (Amharic)", flag: "🇪🇹" },
  { code: "ti", label: "ትግርኛ (Tigrinya)", flag: "🇪🇹" },
  { code: "om", label: "Afaan Oromoo", flag: "🇪🇹" },
  { code: "zh", label: "中文 (Chinese)", flag: "🇨🇳" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showLangSubMenu, setShowLangSubMenu] = useState(false);

  const currentLangLabel =
    languageOptions.find((l) => l.code === language)?.label || "English";

  const isAdmin = pathname.startsWith("/admin");
  const isWaiter = pathname.startsWith("/waiter");
  const isKitchen = pathname.startsWith("/kitchen");
  const isStore = pathname.startsWith("/store");
  const isReceptionist = pathname.startsWith("/receptionist");
  const isStaffRoute = isAdmin || isWaiter || isKitchen || isStore || isReceptionist;

  const linkClass = "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition text-sm";
  const sectionTitle = "px-3 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2";

  return (
    <aside className="sidebar-nav w-64 text-white flex flex-col justify-between p-4 border-r border-white/10 select-none relative z-30 h-screen overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full">

      <div className="pt-5">

        <nav className="space-y-2 pb-15">

          {/* ------- ADMIN ------- */}
          {isAdmin && (
            <div className="space-y-1 pb-4 border-b border-gray-800/60">
              <div className={sectionTitle}>Admin Control</div>
              <Link href="/admin" className={linkClass}><LayoutDashboard size={18} /> Dashboard / Overview</Link>
              <Link href="/admin/staff" className={linkClass}><Users size={18} /> Branch & Staff Management</Link>
              <Link href="/admin/menu" className={linkClass}><UtensilsCrossed size={18} /> Menu & Inventory</Link>
              <Link href="/admin/orders" className={linkClass}><ClipboardList size={18} /> Orders & Transactions</Link>
              <Link href="/admin/reports" className={linkClass}><BarChart3 size={18} /> Reports & Analytics</Link>
              <Link href="/admin/payments" className={linkClass}><CreditCard size={18} /> Payments & Finance</Link>
              <Link href="/admin/tables" className={linkClass}><QrCode size={18} /> Table & QR Generator</Link>
              <Link href="/admin/settings" className={linkClass}><Cog size={18} /> System Settings</Link>
            </div>
          )}

          {/* ------- WAITER ------- */}
          {isWaiter && (
            <div className="space-y-1 pb-4 border-b border-gray-800/60">
              <div className={sectionTitle}>Waiter Panel</div>
              <Link href="/admin/tables" className={linkClass}><QrCode size={18} /> Tables / Floor Plan</Link>
              <Link href="/waiter" className={linkClass}><Utensils size={18} /> New Order / Menu</Link>
              <Link href="/waiter#active" className={linkClass}><ClipboardList size={18} /> Active Orders</Link>
              <Link href="/waiter#bill" className={linkClass}><Receipt size={18} /> Bill / Checkout Request</Link>
              <Link href="/waiter/performance" className={linkClass}><BarChart3 size={18} /> My Tips / Performance</Link>
            </div>
          )}

          {/* ------- KITCHEN ------- */}
          {isKitchen && (
            <div className="space-y-1 pb-4 border-b border-gray-800/60">
              <div className={sectionTitle}>Kitchen Screen (KDS)</div>
              <Link href="/kitchen#live" className={linkClass}><ChefHat size={18} /> Live Orders (Incoming)</Link>
              <Link href="/kitchen#preparing" className={linkClass}><FileText size={18} /> Preparing</Link>
              <Link href="/kitchen#ready" className={linkClass}><ClipboardList size={18} /> Ready for Pickup</Link>
              <Link href="/kitchen/history" className={linkClass}><FileBarChart size={18} /> Completed / History</Link>
              <Link href="/kitchen/materials" className={linkClass}><PackagePlus size={18} /> Request Material</Link>
            </div>
          )}

          {/* ------- STORE ------- */}
          {isStore && (
            <div className="space-y-1 pb-4 border-b border-gray-800/60">
              <div className={sectionTitle}>Store / Inventory</div>
              <Link href="/store" className={linkClass}><StoreIcon size={18} /> Inventory Dashboard</Link>
              <Link href="/store/stock-in" className={linkClass}><PackagePlus size={18} /> Stock In (Receiving)</Link>
              <Link href="/store/stock-out" className={linkClass}><PackageMinus size={18} /> Stock Out (Issuance)</Link>
              <Link href="/store/kitchen-requests" className={linkClass}><ClipboardList size={18} /> Kitchen Requests</Link>
              <Link href="/store/low-stock" className={linkClass}><AlertTriangle size={18} /> Low Stock Alerts</Link>
              <Link href="/store/suppliers" className={linkClass}><Truck size={18} /> Suppliers Directory</Link>
              <Link href="/store/reports" className={linkClass}><FileBarChart size={18} /> Stock Reports</Link>
            </div>
          )}

          {/* ------- RECEPTIONIST ------- */}
          {isReceptionist && (
            <div className="space-y-1 pb-4 border-b border-gray-800/60">
              <div className={sectionTitle}>Reception / Cashier</div>
              <Link href="/receptionist" className={linkClass}><BedDouble size={18} /> Reception Dashboard</Link>
              <Link href="/receptionist/billing" className={linkClass}><Wallet size={18} /> Billing & Checkout</Link>
              <Link href="/receptionist/reservations" className={linkClass}><CalendarCheck size={18} /> Reservations</Link>
              <Link href="/receptionist/receipts" className={linkClass}><Receipt size={18} /> Receipts & Invoices</Link>
              <Link href="/receptionist/cash-report" className={linkClass}><FileBarChart size={18} /> Daily Cash Drawer Report</Link>
            </div>
          )}

          {/* ------- PUBLIC NAVIGATION (Customer ብቻ) ------- */}
          {!isStaffRoute && (
            <div className="pt-2 pb-2">
              <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Public Navigation
              </div>
              <Link href="/" className={linkClass}><Grid size={18} /> {t("all")}</Link>
              <Link href="/Food" className={linkClass}><Coffee size={18} /> {t("food")}</Link>
              <Link href="/drink" className={linkClass}><Wine size={18} /> {t("drink")}</Link>
              <Link href="/room" className={linkClass}><Home size={18} /> {t("room")}</Link>
            </div>
          )}

          {/* ------- SETTINGS (ሁልጊዜ ይታያል) ------- */}
          <div className="relative pt-2 border-t border-gray-800/60">
            <button 
              onClick={() => { setShowSettingsDropdown(!showSettingsDropdown); setShowLangSubMenu(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-200 transition border border-gray-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-amber-400" />
                <span className="font-medium text-sm">{t("settings")}</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${showSettingsDropdown ? "rotate-180" : ""}`} />
            </button>

            {showSettingsDropdown && (
              <div className="mt-2 w-full border border-gray-700 rounded-xl shadow-xl overflow-hidden py-1 text-white space-y-1">
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    {theme === "dark" ? <Moon size={16} className="text-amber-400" /> : <Sun size={16} className="text-amber-400" />}
                    <span>Dark Mode</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${theme === "dark" ? "bg-amber-500/20 text-amber-400" : "bg-gray-800 text-gray-400"}`}>
                    {theme === "dark" ? "On" : "Off"}
                  </span>
                </button>
                <div className="border-t border-gray-800 my-1"></div>
                <div>
                  <button 
                    onClick={() => setShowLangSubMenu(!showLangSubMenu)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition text-gray-200 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Globe size={16} className="text-amber-400" />
                      <span>Language ({currentLangLabel})</span>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${showLangSubMenu ? "rotate-180" : ""}`} />
                  </button>
                  {showLangSubMenu && (
                    <div className="border-t border-b border-gray-800 py-1 space-y-0.5">
                      {languageOptions.map((opt) => (
                        <button
                          key={opt.code}
                          onClick={() => { setLanguage(opt.code); setShowLangSubMenu(false); setShowSettingsDropdown(false); }}
                          className="w-full text-left px-8 py-2 text-xs hover:bg-gray-800 text-gray-300 transition cursor-pointer">
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
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "en" | "am" | "ti" | "om" | "zh";

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    subtitle: "To Digital Food Menu",
    chooseCategory: "Choose a category from the menu above.",
    dashboard: "Dashboard",
    menuManagement: "Menu Management",
    liveOrders: "Live Orders",
    tableQr: "Table & QR Generator",
    manageStaff: "Manage Staff Auth",
    settings: "Settings",
    all: "All",
    food: "Food",
    drink: "Drink",
    room: "Room",
    staffPortal: "Staff Portal",
    adminLogin: "Admin Login",
    waiterLogin: "Waiter Login",
    kitchenLogin: "Kitchen Login",
    logout: "Logout",
  },
  am: {
    welcome: "እንኳን ደህና መጡ",
    subtitle: "ወደ ዲጂታል ምግብ ዝርዝር",
    chooseCategory: "ከላይ ካለው ምናሌ ምድብ ይምረጡ።",
    dashboard: "ዳሽቦርድ",
    menuManagement: "ምናሌ አስተዳደር",
    liveOrders: "ቀጥታ ትዕዛዞች",
    tableQr: "ጠረጴዛ እና QR ማመንጫ",
    manageStaff: "ሰራተኞችን ማስተዳደር",
    settings: "ቅንብሮች",
    all: "ሁሉም",
    food: "ምግብ",
    drink: "መጠጥ",
    room: "ክፍል",
    staffPortal: "የሰራተኞች መግቢያ",
adminLogin: "አድሚን መግቢያ",
waiterLogin: "ዌይተር መግቢያ",
kitchenLogin: "ኩሽና መግቢያ",
logout: "ውጣ",
  },
  ti: {
    welcome: "እንቋዕ ብደሓን መጻእኩም",
    subtitle: "ናብ ዲጂታል ናይ ምግቢ ዝርዝር",
    chooseCategory: "ካብቲ ኣብ ላዕሊ ዘሎ ምድብ ምረጹ።",
    dashboard: "ዳሽቦርድ",
    menuManagement: "ምናሌ ምሕደራ",
    liveOrders: "ህያው ትእዛዛት",
    tableQr: "ጠረጴዛ ከምኡውን QR ጀነሬተር",
    manageStaff: "ሰራሕተኛታት ምሕደራ",
    settings: "ቅጥዕታት",
    all: "ኩሉ",
    food: "ምግቢ",
    drink: "መስተ",
    room: "ክፍሊ",
    staffPortal: "መእተዊ ሰራሕተኛታት",
adminLogin: "መእተዊ ኣድሚን",
waiterLogin: "መእተዊ ዌይተር",
kitchenLogin: "መእተዊ ክሽነ",
logout: "ውጻእ",
  },
  om: {
    welcome: "Baga Nagaan Dhuftan",
    subtitle: "Menu Nyaataa Dijitaalaa",
    chooseCategory: "Gareen armaan olitti jiru filadhaa.",
    dashboard: "Dashboardii",
    menuManagement: "Bulchiinsa Menu",
    liveOrders: "Ajajawwan Yeroo Ammaa",
    tableQr: "Minjaalaa fi QR Generator",
    manageStaff: "Bulchiinsa Hojjettootaa",
    settings: "Qindaa'ina",
    all: "Hunda",
    food: "Nyaata",
    drink: "Dhugaatii",
    room: "Kutaa",
    staffPortal: "Portaalii Hojjettootaa",
adminLogin: "Seensa Admin",
waiterLogin: "Seensa Waiter",
kitchenLogin: "Seensa Kitchen",
logout: "Ba'i",
  },
  zh: {
    welcome: "欢迎",
    subtitle: "数字美食菜单",
    chooseCategory: "请从上面的菜单中选择一个类别。",
    dashboard: "仪表板",
    menuManagement: "菜单管理",
    liveOrders: "实时订单",
    tableQr: "桌号和二维码生成器",
    manageStaff: "员工管理",
    settings: "设置",
    all: "全部",
    food: "食物",
    drink: "饮料",
    room: "房间",
    staffPortal: "员工门户",
adminLogin: "管理员登录",
waiterLogin: "服务员登录",
kitchenLogin: "厨房登录",
logout: "登出",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
  const saved = localStorage.getItem("kerami-lang") as Language | null;
  // eslint-disable-next-line react-hooks/set-state-in-effect
  if (saved) setLanguageState(saved);
}, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem("kerami-lang", lang);
  }

  function t(key: string): string {
    return translations[language]?.[key] || translations.en[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
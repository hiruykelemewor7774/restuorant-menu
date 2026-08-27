"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type RestaurantSettings = {
  restaurantName: string;
  logoLight: string;
  logoDark: string;
  defaultLanguage: string;
};

const defaultSettings: RestaurantSettings = {
  restaurantName: "Kereami",
  logoLight: "/image/kereamilm.png",
  logoDark: "/image/kereamidm.png",
  defaultLanguage: "en",
};

const SettingsContext = createContext<RestaurantSettings>(defaultSettings);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/settings/public", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings({
            restaurantName: data.settings.restaurantName || defaultSettings.restaurantName,
            logoLight: data.settings.logoLight || defaultSettings.logoLight,
            logoDark: data.settings.logoDark || defaultSettings.logoDark,
            defaultLanguage: data.settings.defaultLanguage || defaultSettings.defaultLanguage,
          });
        }
      });
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useRestaurantSettings() {
  return useContext(SettingsContext);
}
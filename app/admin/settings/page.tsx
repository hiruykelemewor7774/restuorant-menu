"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function AdminSettingsPage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [logoLight, setLogoLight] = useState("");
  const [logoDark, setLogoDark] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [serviceCharge, setServiceCharge] = useState("30");
  const [taxRate, setTaxRate] = useState("0");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [uploadingLight, setUploadingLight] = useState(false);
  const [uploadingDark, setUploadingDark] = useState(false);
  const lightInputRef = useRef<HTMLInputElement>(null);
  const darkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setRestaurantName(data.settings.restaurantName);
        setLogoLight(data.settings.logoLight || "");
        setLogoDark(data.settings.logoDark || "");
        setDefaultLanguage(data.settings.defaultLanguage || "en");
        setServiceCharge(String(data.settings.serviceCharge));
        setTaxRate(String(data.settings.taxRate));
      }
      setLoading(false);
    }
    void load();
  }, []);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>, variant: "light" | "dark") {
    const file = e.target.files?.[0];
    if (!file) return;

    if (variant === "light") setUploadingLight(true);
    else setUploadingDark(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        if (variant === "light") setLogoLight(data.path);
        else setLogoDark(data.path);
      } else {
        setMessage(data.message || "ፋይል መስቀል አልተቻለም");
      }
    } catch {
      setMessage("የፋይል መስቀል ስህተት ተፈጥሯል");
    } finally {
      if (variant === "light") setUploadingLight(false);
      else setUploadingDark(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantName, logoLight, logoDark, defaultLanguage, serviceCharge, taxRate }),
    });
    const data = await res.json();
    if (!data.success) {
      setMessage(data.message || "ስህተት ተፈጥሯል");
      return;
    }
    setMessage("✅ ተቀምጧል - ገፁን refresh ካደረግህ በሁሉም ቦታ ይተገበራል");
  }

  if (loading) return <p className="text-gray-400">እየጫነ ነው...</p>;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">⚙️ System Settings</h1>

      <form onSubmit={handleSave} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Restaurant Name</label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        {/* Light Logo */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Logo (Light Mode)</label>
          <input
            ref={lightInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleLogoUpload(e, "light")}
            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-black file:font-semibold hover:file:bg-yellow-400 cursor-pointer"
          />
          {uploadingLight && <p className="text-amber-400 text-xs mt-1">⏳ እየተሰቀለ ነው...</p>}
          {logoLight && !uploadingLight && (
            <div className="mt-2 relative w-32 h-16 bg-white rounded-lg overflow-hidden border border-gray-700">
              <Image src={logoLight} alt="logo light" fill className="object-contain" />
            </div>
          )}
        </div>

        {/* Dark Logo */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Logo (Dark Mode)</label>
          <input
            ref={darkInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleLogoUpload(e, "dark")}
            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-black file:font-semibold hover:file:bg-yellow-400 cursor-pointer"
          />
          {uploadingDark && <p className="text-amber-400 text-xs mt-1">⏳ እየተሰቀለ ነው...</p>}
          {logoDark && !uploadingDark && (
            <div className="mt-2 relative w-32 h-16 bg-gray-950 rounded-lg overflow-hidden border border-gray-700">
              <Image src={logoDark} alt="logo dark" fill className="object-contain" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Default Language</label>
          <select
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          >
            <option value="en">English</option>
            <option value="am">አማርኛ (Amharic)</option>
            <option value="ti">ትግርኛ (Tigrinya)</option>
            <option value="om">Afaan Oromoo</option>
            <option value="zh">中文 (Chinese)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Service Charge (Birr)</label>
          <input
            type="number"
            value={serviceCharge}
            onChange={(e) => setServiceCharge(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        {message && <p className="text-sm text-amber-400">{message}</p>}

        <button type="submit" className="bg-yellow-500 text-black font-bold px-6 py-2 rounded-xl hover:bg-yellow-400">
          Save Changes
        </button>
      </form>
    </div>
  );
}
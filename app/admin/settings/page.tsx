"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [serviceCharge, setServiceCharge] = useState("30");
  const [taxRate, setTaxRate] = useState("0");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setRestaurantName(data.settings.restaurantName);
        setServiceCharge(String(data.settings.serviceCharge));
        setTaxRate(String(data.settings.taxRate));
      }
      setLoading(false);
    }
    void load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantName, serviceCharge, taxRate }),
    });
    const data = await res.json();
    if (!data.success) {
      setMessage(data.message || "ስህተት ተፈጥሯል");
      return;
    }
    setMessage("✅ ተቀምጧል");
  }

  if (loading) return <p className="text-gray-400">እየጫነ ነው...</p>;

  return (
    <div className="text-gray-800 bg-slate-100 p-3 h-screen">
      <h1 className="text-xl font-bold mb-3 pt-4 text-yellow-500">⚙️ System Settings</h1>

      <form onSubmit={handleSave} className="bg-gray-900 border border-gray-800 shadow-sm rounded-2xl p-6 max-w-2xl space-y-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Restaurant Name</label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-100 border border-gray-500 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Service Charge (Birr)</label>
          <input
            type="number"
            value={serviceCharge}
            onChange={(e) => setServiceCharge(e.target.value)}
            className="w-full px-3 py-2 bg-slate-100 border border-gray-500 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-100 border border-gray-500 rounded-lg"
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
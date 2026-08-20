"use client";

import { useEffect, useState } from "react";
import { Kitchen } from '../../generated/prisma/browser';

type Summary = {
  totalOrders: number;
  totalRevenue: number;
  deliveredCount: number;
  pendingCount: number;
  cancelledCount: number;
};

type WaiterPerf = {
  name: string;
  orders: number;
  revenue: number;
};

type KitchenPerf = {
  name: string; 
  readyCount: number 
};

type TopItem = {
  name: string;
  category: string;
  quantity: number;
  revenue: number;
};

type Period = "day" | "week" | "month" | "year";

const periodLabels: Record<Period, string> = {
  day: "ዛሬ",
  week: "ይህ ሳምንት",
  month: "ይህ ወር",
  year: "ይህ አመት",
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("day");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [waiterPerformance, setWaiterPerformance] = useState<WaiterPerf[]>([]);
  const [kitchenPerformance, setKitchenPerformance] = useState<KitchenPerf[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      const res = await fetch(`/api/admin/reports?period=${period}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setWaiterPerformance(data.waiterPerformance);
        setKitchenPerformance(data.kitchenPerformance || []);
        setTopItems(data.topItems);
      }
      setLoading(false);
    }
    void loadReport();
  }, [period]);

  return (
    <div className="text-gray-800 h-screen bg-gray-200 pl-5 pr-5 pb-5 pt-9">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">📊 ሪፖርት</h1>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {(["day", "week", "month", "year"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              period === p
                ? "bg-yellow-500 text-black"
                : "bg-gray-900 border border-gray-700 hover:bg-gray-800"
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">እየጫነ ነው...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-sm text-gray-400 mb-1">ጠቅላላ ትዕዛዞች</p>
              <p className="text-3xl font-bold text-amber-400">{summary?.totalOrders ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-sm text-gray-400 mb-1">ጠቅላላ ገቢ</p>
              <p className="text-3xl font-bold text-green-400">
                {(summary?.totalRevenue ?? 0).toFixed(2)} ETB
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-sm text-gray-400 mb-1">የተላኩ</p>
              <p className="text-3xl font-bold text-emerald-400">{summary?.deliveredCount ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-sm text-gray-400 mb-1">አዲስ (Pending)</p>
              <p className="text-3xl font-bold text-yellow-400">{summary?.pendingCount ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-sm text-gray-400 mb-1">የተሰረዙ</p>
              <p className="text-3xl font-bold text-red-400">{summary?.cancelledCount ?? 0}</p>
            </div>
          </div>

          {/* Waiter Performance */}
          <h2 className="text-xl font-bold mb-4 text-yellow-500">👥 Waiter Performance</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-10">
            {waiterPerformance.length === 0 ? (
              <p className="text-gray-400 text-sm p-4">ለዚህ ጊዜ ክፍል ዳታ የለም</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-200 text-gray-300">
                  <tr>
                    <th className="text-left p-3">ዌይተር</th>
                    <th className="text-right p-3">ትዕዛዞች</th>
                    <th className="text-right p-3">ገቢ</th>
                  </tr>
                </thead>
                <tbody>
                  {waiterPerformance.map((w, idx) => (
                    <tr key={idx} className="border-t border-gray-800">
                      <td className="p-3">{w.name}</td>
                      <td className="p-3 text-right">{w.orders}</td>
                      <td className="p-3 text-right text-amber-400 font-bold">
                        {w.revenue.toFixed(2)} ETB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* kitchen Performance */}
          <h2 className="text-xl font-bold mb-4 mt-10 text-yellow-500">🍳 Kitchen Performance</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-10">
            {kitchenPerformance.length === 0 ? (
              <p className="text-gray-400 text-sm p-4">ለዚህ ጊዜ ክፍል ዳታ የለም</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-200 text-gray-300">
                  <tr>
                    <th className="text-left p-3">Kitchen Staff</th>
                    <th className="text-right p-3">ያዘጋጁት ትዕዛዞች</th>
                  </tr>
                </thead>
                <tbody>
                  {kitchenPerformance.map((k, idx) => (
                    <tr key={idx} className="border-t border-gray-800">
                      <td className="p-3">{k.name}</td>
                      <td className="p-3 text-right text-amber-400 font-bold">{k.readyCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>  

          {/* Top Selling Items */}
          <h2 className="text-xl font-bold mb-4 text-yellow-500">🔥 Top-Selling Items</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {topItems.length === 0 ? (
              <p className="text-gray-400 text-sm p-4">ለዚህ ጊዜ ክፍል ዳታ የለም</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-200 text-gray-300">
                  <tr>
                    <th className="text-left p-3">እቃ</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-right p-3">ብዛት</th>
                    <th className="text-right p-3">ገቢ</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-800">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3 text-gray-400">{item.category}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right text-amber-400 font-bold">
                        {item.revenue.toFixed(2)} ETB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
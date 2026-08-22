"use client";

import { useEffect, useState } from "react";

type ReportData = {
  days: number;
  totalPurchaseCost: number;
  totalPurchaseQty: number;
  totalWasteQty: number;
  totalWasteCost: number;
  topPurchased: { name: string; qty: number; cost: number }[];
  topWasted: { name: string; qty: number }[];
  requestsCount: number;
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [range, setRange] = useState("30");

  useEffect(() => {
    fetch(`/api/store/reports?range=${range}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d);
      });
  }, [range]);

  return (
    <div className="bg-slate-100 h-screen pl-5 pt-8 pr-5 pb-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📊 Reports</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {!data ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-2xl font-bold text-green-600">
                {data.totalPurchaseCost.toFixed(2)} ETB
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Purchases</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-2xl font-bold text-red-500">
                {data.totalWasteCost.toFixed(2)} ETB
              </p>
              <p className="text-sm text-gray-500 mt-1">Waste Cost (est.)</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-2xl font-bold text-amber-600">
                {data.totalWasteQty}
              </p>
              <p className="text-sm text-gray-500 mt-1">Waste Quantity</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-2xl font-bold text-blue-600">
                {data.requestsCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">Kitchen Requests</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3">
                🛒 Top Purchased Items
              </h3>
              {data.topPurchased.length === 0 ? (
                <p className="text-gray-400 text-sm">No data</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.topPurchased.map((p, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b border-gray-50 pb-2"
                    >
                      <span>{p.name}</span>
                      <span className="text-green-600 font-medium">
                        {p.cost.toFixed(2)} ETB
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3">
                🗑️ Top Wasted Items
              </h3>
              {data.topWasted.length === 0 ? (
                <p className="text-gray-400 text-sm">No data</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.topWasted.map((w, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b border-gray-50 pb-2"
                    >
                      <span>{w.name}</span>
                      <span className="text-red-500 font-medium">
                        {w.qty}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
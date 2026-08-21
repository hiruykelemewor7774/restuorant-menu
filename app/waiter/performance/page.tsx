"use client";

import { useEffect, useState } from "react";

type Perf = {
  totalDelivered: number;
  totalRevenue: number;
  todayDelivered: number;
  todayRevenue: number;
};

export default function WaiterPerformancePage() {
  const [perf, setPerf] = useState<Perf | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/waiter/performance", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setPerf(data);
    }
    void load();
  }, []);

  return (
    <div className="text-gray-800 h-screen bg-gray-200 p-5 mt-3">
      <h1 className="text-xl font-bold mb-3 text-yellow-500">📊 My Performance</h1>

      {perf && (
        <div className="grid grid-cols-2 gap-4 max-w-xl">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-sm text-gray-400">የዛሬ የደረሱ ትዕዛዞች</p>
            <p className="text-3xl font-bold text-amber-400">{perf.todayDelivered}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-sm text-gray-400">የዛሬ ገቢ</p>
            <p className="text-3xl font-bold text-green-400">{perf.todayRevenue.toFixed(2)} ETB</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-sm text-gray-400">ጠቅላላ የደረሱ ትዕዛዞች</p>
            <p className="text-3xl font-bold text-amber-400">{perf.totalDelivered}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-sm text-gray-400">ጠቅላላ ገቢ</p>
            <p className="text-3xl font-bold text-green-400">{perf.totalRevenue.toFixed(2)} ETB</p>
          </div>
        </div>
      )}
    </div>
  );
}
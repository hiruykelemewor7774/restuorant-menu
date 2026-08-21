"use client";

import { useEffect, useState } from "react";

type ByMethod = Record<string, { count: number; total: number }>;

export default function CashReportPage() {
  const [byMethod, setByMethod] = useState<ByMethod>({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/receptionist/cash-report", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setByMethod(data.byMethod);
        setGrandTotal(data.grandTotal);
        setTotalTransactions(data.totalTransactions);
      }
    }
    void load();
  }, []);

  const methodLabels: Record<string, string> = {
    cash: "💵 Cash",
    chapa: "📱 Chapa/Mobile Money",
    manual: "💵 Manual",
    unknown: "❓ Unknown",
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 p-5 pt-10">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">🧮 Daily Cash Drawer Report</h1>
      <p className="text-gray-400 mb-6">{new Date().toLocaleDateString()}</p>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-xl">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">ጠቅላላ ግብይቶች</p>
          <p className="text-3xl font-bold text-amber-400">{totalTransactions}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">ጠቅላላ ገቢ</p>
          <p className="text-3xl font-bold text-green-400">{grandTotal.toFixed(2)} ETB</p>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-3 text-amber-400">በ Payment Method</h2>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden max-w-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-300 text-gray-500">
            <tr>
              <th className="text-left p-3">ዘዴ</th>
              <th className="text-right p-3">ብዛት</th>
              <th className="text-right p-3">ገቢ</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(byMethod).map(([method, data]) => (
              <tr key={method} className="border-t border-gray-800">
                <td className="p-3">{methodLabels[method] || method}</td>
                <td className="p-3 text-right">{data.count}</td>
                <td className="p-3 text-right text-amber-400 font-bold">{data.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {Object.keys(byMethod).length === 0 && <p className="text-gray-400 text-center p-6">ዛሬ ምንም ግብይት የለም</p>}
      </div>
    </div>
  );
}
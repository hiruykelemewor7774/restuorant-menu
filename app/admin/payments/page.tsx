"use client";

import { useEffect, useState } from "react";

type Payment = {
  id: string;
  tableNumber: string;
  paymentMethod: string | null;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/payments", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setPayments(data.payments);
      setLoading(false);
    }
    void load();
  }, []);

  const statusColor: Record<string, string> = {
    paid: "bg-green-900/50 text-green-400",
    unpaid: "bg-red-900/50 text-red-400",
    failed: "bg-gray-800 text-gray-400",
  };

  const totalPaid = payments
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="text-gray-800 bg-slate-100 p-3 pt-8">
      <h1 className="text-xl font-bold mb-2 text-yellow-500">💳 Payments & Finance</h1>
      <p className="text-gray-400 mb-6">ጠቅላላ የተከፈለ: <span className="text-amber-400 font-bold">{totalPaid.toFixed(2)} ETB</span></p>

      {loading ? (
        <p className="text-gray-400">እየጫነ ነው...</p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 shadow-sm rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-200 text-gray-300">
              <tr>
                <th className="text-left p-3">ጠረጴዛ</th>
                <th className="text-left p-3">ዘዴ</th>
                <th className="text-left p-3">ሁኔታ</th>
                <th className="text-right p-3">መጠን</th>
                <th className="text-right p-3">ቀን</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-800">
                  <td className="p-3">{p.tableNumber}</td>
                  <td className="p-3 text-gray-400">{p.paymentMethod || "-"}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[p.paymentStatus] || ""}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right text-amber-400 font-bold">{p.totalAmount.toFixed(2)}</td>
                  <td className="p-3 text-right text-gray-500 text-xs">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

type Receipt = {
  id: string;
  tableNumber: string;
  totalAmount: number;
  paymentMethod: string | null;
  updatedAt: string;
  items: { id: string; name: string; quantity: number }[];
};

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selected, setSelected] = useState<Receipt | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/receptionist/receipts", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setReceipts(data.receipts);
    }
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 p-5 pt-10">
      <h1 className="text-xl font-bold mb-3 text-yellow-400">🧾 Receipts & Invoices</h1>

      <div className="bg-gray-900 shadow-sm border border-gray-800 rounded-xl overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-slate-200 text-gray-300">
            <tr>
              <th className="text-left p-3">table</th>
              <th className="text-left p-3">method</th>
              <th className="text-right p-3">መጠን</th>
              <th className="text-right p-3">date</th>
              <th className="text-right p-3">Print</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((r) => (
              <tr key={r.id} className="border-t border-gray-800">
                <td className="p-3">{r.tableNumber}</td>
                <td className="p-3 text-gray-400">{r.paymentMethod || "-"}</td>
                <td className="p-3 text-right text-amber-400 font-bold">{r.totalAmount.toFixed(2)}</td>
                <td className="p-3 text-right text-gray-500 text-xs">{new Date(r.updatedAt).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setSelected(r)} className="text-blue-400 hover:underline text-xs">view</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {receipts.length === 0 && <p className="text-gray-400 text-center p-6">ምንም ደረሰኝ የለም</p>}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white text-black rounded-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-center mb-2">Kereami 🍽️</h2>
            <p className="text-xs text-center text-gray-500 mb-4">Receipt</p>
            <p className="text-sm mb-2">Table: {selected.tableNumber}</p>
            <div className="border-t border-b py-2 my-2 space-y-1">
              {selected.items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span>{i.name} x{i.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold mb-4">
              <span>Total</span>
              <span>{selected.totalAmount.toFixed(2)} ETB</span>
            </div>
            <button onClick={() => window.print()} className="w-full bg-slate-100 hover:bg-slate-200 text-gray-800 py-2 rounded-full text-sm">🖨️ Print</button>
          </div>
        </div>
      )}
    </div>
  );
}
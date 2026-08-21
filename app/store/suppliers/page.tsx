"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  async function loadSuppliers() {
    const res = await fetch("/api/store/suppliers", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setSuppliers(data.suppliers);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSuppliers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    await fetch("/api/store/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address }),
    });

    setName("");
    setPhone("");
    setAddress("");
    setShowForm(false);
    loadSuppliers();
  }

  return (
    <div className="bg-gray-200 text-gray-800 h-screen pl-5 pr-5 pb-5 pt-5">
      <div className="flex justify-between items-center mb-4 mt-3">
        <h2 className="text-xl font-bold text-gray-800">🚚 Suppliers</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {showForm ? "Cancel" : "+ Add Supplier"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
          >
            Save
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-300 text-gray-500 border-b border-gray-100">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Address</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-gray-50">
                <td className="py-3 px-4 font-medium">{s.name}</td>
                <td className="py-3 px-4 text-gray-500">{s.phone || "-"}</td>
                <td className="py-3 px-4 text-gray-500">
                  {s.address || "-"}
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">
                  No suppliers yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
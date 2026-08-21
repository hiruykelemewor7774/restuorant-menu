"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  guestName: string;
  guestPhone: string;
  tableNumber: string;
  reservedDate: string;
  reservedTime: string;
  guestCount: number;
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [form, setForm] = useState({
    guestName: "", guestPhone: "", tableNumber: "", reservedDate: "", reservedTime: "", guestCount: "1", notes: "",
  });
  const [message, setMessage] = useState("");

  async function loadReservations() {
    const res = await fetch("/api/receptionist/reservations", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setReservations(data.reservations);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadReservations();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/receptionist/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!data.success) {
      setMessage(data.message || "ስህተት ተፈጥሯል");
      return;
    }
    setMessage("✅ ማስያዝ ተፈጥሯል");
    setForm({ guestName: "", guestPhone: "", tableNumber: "", reservedDate: "", reservedTime: "", guestCount: "1", notes: "" });
    loadReservations();
  }

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 p-5 pt-10">
      <h1 className="text-xl font-bold mb-6 text-yellow-500">📅 Table Reservations</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl space-y-3 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="የደንበኛ ስም" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm" />
          <input required placeholder="ስልክ" value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} className="px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm" />
          <input required placeholder="ጠረጴዛ ቁጥር" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} className="px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm" />
          <input required type="number" min="1" placeholder="የእንግዶች ብዛት" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} className="px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm" />
          <input required type="date" value={form.reservedDate} onChange={(e) => setForm({ ...form, reservedDate: e.target.value })} className="px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm" />
          <input required type="time" value={form.reservedTime} onChange={(e) => setForm({ ...form, reservedTime: e.target.value })} className="px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm" />
        </div>
        <textarea placeholder="ማስታወሻ" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-sm" rows={2} />
        {message && <p className="text-sm text-amber-400">{message}</p>}
        <button className="bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-400">ማስያዝ ፍጠር</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map((r) => (
          <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="font-bold text-amber-400">{r.guestName}</p>
            <p className="text-sm text-gray-400">📞 {r.guestPhone}</p>
            <p className="text-sm text-gray-400">🪑 ጠረጴዛ {r.tableNumber} • 👥 {r.guestCount}</p>
            <p className="text-sm text-gray-400">📅 {new Date(r.reservedDate).toLocaleDateString()} • ⏰ {r.reservedTime}</p>
          </div>
        ))}
        {reservations.length === 0 && <p className="text-gray-400 col-span-full text-center py-10">ምንም ማስያዝ የለም</p>}
      </div>
    </div>
  );
}
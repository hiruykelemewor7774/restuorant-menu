"use client";

import { useState } from "react";

export type GuestInfo = {
  name: string;
  phone: string;
  email: string;
  address: string;
  idNumber: string;
};

export default function RoomIdForm({
  isOpen,
  onSubmit,
  onCancel,
}: {
  isOpen: boolean;
  onSubmit: (info: GuestInfo) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<"ask" | "form">("ask");
  const [form, setForm] = useState<GuestInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
    idNumber: "",
  });

  if (!isOpen) return null;

  function handleYes() {
    setStep("form");
  }

  function handleNo() {
    setStep("ask");
    onCancel();
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("ask");
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 bg-black/80 [z-100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-amber-500 rounded-2xl p-6 max-w-sm w-full">
        {step === "ask" ? (
          <>
            <div className="text-4xl text-center mb-4">🛎️</div>
            <h2 className="text-lg font-bold text-white text-center mb-2">
              Do you have an ID for check-in?
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              A valid ID is required to complete your room booking.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleNo}
                className="flex-1 border border-gray-700 text-white py-2.5 rounded-full hover:bg-gray-800 transition"
              >
                No
              </button>
              <button
                onClick={handleYes}
                className="flex-1 bg-amber-500 text-black font-bold py-2.5 rounded-full hover:bg-amber-400 transition"
              >
                Yes
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <h2 className="text-lg font-bold text-amber-400 mb-4">
              Guest Identification
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-white text-sm"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-white text-sm"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-white text-sm"
              />
              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-white text-sm"
              />
              <input
                type="text"
                required
                placeholder="ID Number"
                value={form.idNumber}
                onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                className="w-full px-3 py-2 bg-gray-200 border border-gray-500 rounded-lg text-white text-sm"
              />
            </div>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={handleNo}
                className="flex-1 border border-gray-500 text-white py-2.5 rounded-full hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-amber-500 text-black font-bold py-2.5 rounded-full hover:bg-amber-400 transition text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
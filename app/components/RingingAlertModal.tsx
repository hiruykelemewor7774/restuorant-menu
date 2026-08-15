"use client";

import { useEffect } from "react";
import { startRinging, stopRinging } from "@/lib/notifySound";

export default function RingingAlertModal({
  isOpen,
  title,
  message,
  onAcknowledge,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onAcknowledge: () => void;
}) {
  useEffect(() => {
    if (isOpen) {
      startRinging();
    } else {
      stopRinging();
    }
    return () => stopRinging();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 [z-100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-amber-500 rounded-2xl p-8 max-w-sm w-full text-center animate-pulse-slow">
        <div className="text-6xl mb-4">🔔</div>
        <h2 className="text-xl font-bold text-amber-400 mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <button
          onClick={() => {
            stopRinging();
            onAcknowledge();
          }}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-full transition">
          ✅ አረጋግጫለሁ
        </button>
      </div>
    </div>
  );
}
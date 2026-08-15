"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const [status, setStatus] = useState<"checking" | "paid" | "failed">("checking");

  useEffect(() => {
    if (!txRef) return;

    fetch(`/api/orders/verify?tx_ref=${txRef}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.success ? "paid" : "failed");
      });
  }, [txRef]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm text-center">
        {status === "checking" && (
          <>
            <p className="text-4xl mb-3">⏳</p>
            <p className="text-white font-semibold">ክፍያ በማረጋገጥ ላይ...</p>
          </>
        )}
        {status === "paid" && (
          <>
            <p className="text-4xl mb-3">✅</p>
            <p className="text-white font-bold text-lg mb-2">ክፍያ ተሳክቷል!</p>
            <p className="text-gray-400 text-sm mb-6">
              ትዕዛዝዎ ወደ ወጥ ቤት ተልኳል። ዌይተር በቅርቡ ያገለግልዎታል።
            </p>
          </>
        )}
        {status === "failed" && (
          <>
            <p className="text-4xl mb-3">❌</p>
            <p className="text-white font-bold text-lg mb-2">ክፍያ አልተሳካም</p>
            <p className="text-gray-400 text-sm mb-6">
              እባክዎ እንደገና ይሞክሩ ወይም ዌይተርን ያነጋግሩ።
            </p>
          </>
        )}
        <Link
          href="/"
          className="inline-block bg-amber-500 text-black font-semibold px-6 py-2 rounded-full hover:bg-amber-600">
          ወደ Menu ተመለስ
        </Link>
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div className="text-white text-center pt-20">Loading...</div>}>
      <OrderStatusContent />
    </Suspense>
  );
}
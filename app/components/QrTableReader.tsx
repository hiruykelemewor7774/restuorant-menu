"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";

function QrTableReaderInner() {
  const searchParams = useSearchParams();
  const { setTableNumber } = useCart();

  useEffect(() => {
    const table = searchParams.get("table");
    if (table) {
      setTableNumber(table);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}

export default function QrTableReader() {
  return (
    <Suspense fallback={null}>
      <QrTableReaderInner />
    </Suspense>
  );
}
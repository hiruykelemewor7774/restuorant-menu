"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/kitchen/me", { cache: "no-store" });
      if (!res.ok) router.replace("/kitchen/login");
    }
    check();
  }, [router]);

  return <>{children}</>;
}
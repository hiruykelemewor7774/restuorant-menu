"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/receptionist/me", { cache: "no-store" });
      if (!res.ok) router.replace("/receptionist/login");
    }
    check();
  }, [router]);

  return <>{children}</>;
}
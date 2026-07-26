"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 ደቂቃ

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function checkSession() {
    try {
      const res = await fetch("/api/waiter/me", { cache: "no-store" });
      if (!res.ok) {
        redirectToLogin();
      }
    } catch {
      redirectToLogin();
    }
  }

  function redirectToLogin() {
    router.replace("/waiter/login");
  }

  function resetInactivityTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await fetch("/api/waiter/logout", { method: "POST" });
      redirectToLogin();
    }, INACTIVITY_LIMIT_MS);
  }

  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        checkSession();
      }
    }
    window.addEventListener("pageshow", handlePageShow);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const activityEvents = ["click", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((evt) =>
      window.addEventListener(evt, resetInactivityTimer)
    );
    resetInactivityTimer();

    checkSession();

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      activityEvents.forEach((evt) =>
        window.removeEventListener(evt, resetInactivityTimer)
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
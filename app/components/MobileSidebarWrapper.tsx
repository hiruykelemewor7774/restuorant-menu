"use client";

import { useUI } from "../context/UIContext";

export default function MobileSidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen, closeSidebar } = useUI();

  return (
    <>
      {/* Mobile overlay backdrop - ተጫነው ሲዘጋ */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        ></div>
      )}

      {/* ሳይድባር - Mobile ላይ fixed drawer, Desktop ላይ ቋሚ (static) */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-full w-64 z-40 md:z-20
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {children}
      </aside>
    </>
  );
}
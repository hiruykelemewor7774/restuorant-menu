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
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        ></div>
      )}

      {/* ሳይድባር - ሁልጊዜ fixed፣ ከ Navbar በላይ (z-[60]) ስለሚሆን እስከ ላይ ይደርሳል */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 [z-60]
          overflow-y-auto
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
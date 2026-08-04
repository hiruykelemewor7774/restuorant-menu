"use client";

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      {/* Aurora 1 */}
      <div className="absolute left-[-10%] top-[-10%] [h-40rem] [w40rem] rounded-full bg-cyan-500/20 blur-[120px] animate-aurora"></div>

      {/* Aurora 2 */}
      <div className="absolute right-[-10%] top-[20%] [h-35rem] [w-35rem] rounded-full bg-purple-500/20 blur-[120px] animate-aurora animation-delay-3000"></div>

      {/* Aurora 3 */}
      <div className="absolute bottom-[-20%] left-[25%] [h-45rem] [w-45rem] rounded-full bg-pink-500/15 blur-[140px] animate-aurora animation-delay-6000"></div>

      {/* Aurora 4 */}
      <div className="absolute bottom-[10%] right-[20%] [h-30rem] [w-30rem] rounded-full bg-emerald-500/20 blur-[100px] animate-aurora animation-delay-9000"></div>
    </div>
  );
}
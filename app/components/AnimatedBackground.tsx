"use client";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* Blue Glow */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl animate-blob"></div>

      {/* Purple Glow */}
      <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl animate-blob animation-delay-2000"></div>

      {/* Pink Glow */}
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-500/30 blur-3xl animate-blob animation-delay-4000"></div>
    </div>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Make sure flex direction is row (side-by-side) and full height
    <div className="flex flex-row w-full text-white overflow-x-hidden items-center justify-center">
      {/* Sidebar stays fixed/sticky on the left */}
      <div className="w-64 shrink-0">
      </div>

      {/* Main content fills the remaining right side */}
      <main className="flex-1 p-8 mr-70">
        {children}
      </main>
    </div>
  );
}
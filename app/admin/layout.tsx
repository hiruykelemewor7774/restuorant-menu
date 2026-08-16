export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Make sure flex direction is row (side-by-side) and full height
<div>
   <div>
    
   </div>
      {/* Main content fills the remaining right side */}
      <main className="flex-1 p-8 ">
        {children}
      </main>
    </div>
  );
}
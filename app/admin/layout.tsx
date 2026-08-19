import { AdminAuth } from '../generated/prisma/browser';
// import AdminNavbar from '../components/AdminNavbar';
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Make sure flex direction is row (side-by-side) and full height
<div>
   <div>
    {/* <AdminNavbar /> */}
   </div>
      {/* Main content fills the remaining right side */}
      <main className="flex-1 p-8 ">
        {children}
      </main>
    </div>
  );
}
import SessionGuard from "@/app/waiter/components/SessionGuard";

export default function WaiterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionGuard>{children}</SessionGuard>;
}
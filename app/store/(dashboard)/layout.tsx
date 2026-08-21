import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyStoreToken, STORE_COOKIE_NAME } from "@/lib/store-auth";
import StoreTabs from "./StoreTabs";

export default async function StoreDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(STORE_COOKIE_NAME)?.value;
  const payload = token ? await verifyStoreToken(token) : null;

  if (!payload) {
    redirect("/store/login");
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <StoreTabs />
      <div className="p-6">{children}</div>
    </div>
  );
}
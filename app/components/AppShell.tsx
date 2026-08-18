"use client";

import { usePathname } from "next/navigation";
import Navbar from "./NavBar";
import StaffTopBar from "./StaffTopBar";

const staffPrefixes = ["/admin", "/waiter", "/kitchen", "/store", "/receptionist"];

export default function AppShell() {
  const pathname = usePathname();
  const isStaffRoute = staffPrefixes.some((p) => pathname.startsWith(p));

  return isStaffRoute ? <StaffTopBar /> : <Navbar />;
}
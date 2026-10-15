"use client";
import { usePathname } from "next/navigation";

const HIDDEN = ["/doctor", "/patient", "/dashboard", "/login", "/signup"];

export default function HideOnDashboard({ children }) {
  const path = usePathname();
  if (HIDDEN.some((p) => path === p || path.startsWith(p + "/"))) return null;
  return children;
}

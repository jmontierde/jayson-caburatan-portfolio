import { ReactNode } from "react";
import { AdminAuthProvider } from "./AdminAuth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0e] text-white">
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </div>
  );
}

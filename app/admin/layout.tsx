"use client";

import React from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear session
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_wallet");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-neutral-900/50 border-b border-cyan-900/30 flex items-center px-8">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">
              Platform Administration
            </h2>
          </div>
          <div className="text-sm text-neutral-400">
            Connected • Admin Mode Active
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}

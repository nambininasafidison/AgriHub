import type React from "react";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DbHealthCheck } from "@/components/db-health-check";
import { getSession } from "@/lib/actions/auth";
import { UserRole } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full border-r border-gray-200 bg-white md:w-64">
        <DashboardSidebar
          user={{ ...session, role: session.role as "admin" | UserRole }}
        />
      </aside>

      <main className="flex-1 p-6">
        <div className="mb-6">
          <DbHealthCheck />
        </div>

        {children}
      </main>
    </div>
  );
}

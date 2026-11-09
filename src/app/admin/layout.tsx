import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel Megga" },
  robots: { index: false },
};

/** A verificação de acesso (<RequireAuth role="admin">) fica em cada página — ver app/(site)/cliente/layout.tsx. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

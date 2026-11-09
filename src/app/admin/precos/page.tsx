import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { AdminPricing } from "@/components/admin/pricing";

export const metadata: Metadata = { title: "Preços" };

export default function AdminPricingPage() {
  return (
    <RequireAuth role="admin">
      <AdminPricing />
    </RequireAuth>
  );
}

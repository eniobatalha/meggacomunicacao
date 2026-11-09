import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { AdminOrders } from "@/components/admin/orders";

export const metadata: Metadata = { title: "Pedidos" };

export default function AdminOrdersPage() {
  return (
    <RequireAuth role="admin">
      <AdminOrders />
    </RequireAuth>
  );
}

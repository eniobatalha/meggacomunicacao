import { RequireAuth } from "@/components/auth/require-auth";
import { AdminOverview } from "@/components/admin/overview";

export default function AdminPage() {
  return (
    <RequireAuth role="admin">
      <AdminOverview />
    </RequireAuth>
  );
}

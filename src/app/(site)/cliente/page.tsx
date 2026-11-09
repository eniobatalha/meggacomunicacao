import { RequireAuth } from "@/components/auth/require-auth";
import { ClientDashboard } from "@/components/client/dashboard";

export default function ClientPage() {
  return (
    <RequireAuth role="client">
      <ClientDashboard />
    </RequireAuth>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { AdminGalleries } from "@/components/admin/galleries";

export const metadata: Metadata = { title: "Galerias" };

export default function AdminGalleriesPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-ink-850" />}>
      <RequireAuth role="admin">
        <AdminGalleries />
      </RequireAuth>
    </Suspense>
  );
}

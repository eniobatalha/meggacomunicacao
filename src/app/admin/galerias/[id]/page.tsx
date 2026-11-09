import { Suspense } from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { SEED_GALLERIES } from "@/lib/data/galleries";

export function generateStaticParams() {
  return SEED_GALLERIES.map((g) => ({ id: g.id }));
}

export default function AdminGalleryPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-ink-850" />}>
      <RequireAuth role="admin">
        <GalleryManager />
      </RequireAuth>
    </Suspense>
  );
}

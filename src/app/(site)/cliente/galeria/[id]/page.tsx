import { Suspense } from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { GalleryView } from "@/components/gallery/gallery-view";
import { SEED_GALLERIES } from "@/lib/data/galleries";

export function generateStaticParams() {
  return SEED_GALLERIES.map((g) => ({ id: g.id }));
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<GallerySkeleton />}>
      <RequireAuth role="client">
        <GalleryView />
      </RequireAuth>
    </Suspense>
  );
}

function GallerySkeleton() {
  return (
    <div className="container-page pt-32">
      <div className="h-10 w-72 animate-pulse rounded-xl bg-ink-850" />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-ink-850" />
        ))}
      </div>
    </div>
  );
}

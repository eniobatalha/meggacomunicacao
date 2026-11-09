import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderView } from "@/components/order/order-view";

export const metadata: Metadata = { title: "Pedido", robots: { index: false } };

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page pt-32">
          <div className="h-12 w-80 animate-pulse rounded-xl bg-ink-850" />
          <div className="mt-8 h-72 animate-pulse rounded-3xl bg-ink-850" />
        </div>
      }
    >
      <OrderView />
    </Suspense>
  );
}

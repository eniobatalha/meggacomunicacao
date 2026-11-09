"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "./auth";
import { useCart } from "./cart";
import { useOrders } from "./orders";
import { useFavorites, usePricing, useStudio } from "./studio";

type PersistApi = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
    rehydrate: () => Promise<void> | void;
  };
};

const STORES: PersistApi[] = [useAuth, useCart, useOrders, useStudio, usePricing, useFavorites];

/**
 * Os stores usam `skipHydration` para que o HTML do servidor e o primeiro
 * render do cliente sejam idênticos. Este componente lê o localStorage /
 * IndexedDB logo após a montagem.
 */
export function StoreHydration() {
  useEffect(() => {
    for (const s of STORES) void s.persist.rehydrate();
  }, []);
  return null;
}

/** `true` quando o(s) store(s) já foram carregados do armazenamento local. */
export function useHydrated(...stores: PersistApi[]) {
  const list = stores.length ? stores : STORES;
  return useSyncExternalStore(
    (cb) => {
      const unsubs = list.map((s) => s.persist.onFinishHydration(cb));
      return () => unsubs.forEach((u) => u());
    },
    () => list.every((s) => s.persist.hasHydrated()),
    () => false,
  );
}

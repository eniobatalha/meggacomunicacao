"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";

/**
 * Proteção de rota no navegador (modo demonstração).
 * Na versão com backend, a verificação acontece no servidor (proxy + sessão).
 */
export function RequireAuth({ role, children }: { role?: "client" | "admin"; children: ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated(useAuth);
  const user = useAuth((s) => s.user);
  const allowed = !!user && (!role || user.role === role || user.role === "admin");

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    } else if (!allowed) {
      router.replace(user.role === "admin" ? "/admin" : "/cliente");
    }
  }, [hydrated, user, allowed, router]);

  if (!hydrated || !allowed) {
    return (
      // Ocupa a tela toda: evita que o rodapé suba e "pule" quando o conteúdo aparecer
      <div className="grid min-h-svh place-items-center pt-18">
        <div className="flex flex-col items-center gap-4 text-mist">
          <span className="size-10 animate-spin rounded-full border-2 border-gold-500/20 border-t-gold-400" />
          <p className="text-sm">Verificando acesso…</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

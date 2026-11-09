"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { ExternalLink, Images, LayoutDashboard, LogOut, Receipt, Tag } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/store/auth";

const NAV = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/galerias", label: "Galerias", icon: Images },
  { href: "/admin/pedidos", label: "Pedidos", icon: Receipt },
  { href: "/admin/precos", label: "Preços", icon: Tag },
];

function NavLinks({ pathname = "", compact = false }: { pathname?: string; compact?: boolean }) {
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <>
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center rounded-xl font-medium transition-colors",
            // compacto (celular/tablet): 4 abas que cabem na largura, ícone sobre o texto no celular
            compact
              ? "min-h-12 flex-col justify-center gap-1 px-1 py-1.5 text-[0.72rem] sm:flex-row sm:gap-2 sm:text-sm"
              : "gap-3 px-4 py-3 text-sm",
            active(href) ? "bg-gold-500/12 text-gold-200" : "text-silver hover:bg-white/4 hover:text-bone",
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </>
  );
}

function NavWithPath({ compact }: { compact?: boolean }) {
  return <NavLinks pathname={usePathname()} compact={compact} />;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const signOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-svh bg-ink-900">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-white/6 bg-ink-950 p-5 lg:flex">
        <Logo href="/admin" className="h-8" />
        <p className="mt-3 text-[0.65rem] font-semibold tracking-[0.3em] text-gold-500 uppercase">Painel da equipe</p>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Painel">
          <Suspense fallback={<NavLinks />}>
            <NavWithPath />
          </Suspense>
        </nav>
        <div className="mt-auto space-y-3 border-t border-white/6 pt-5">
          <Link href="/" className="flex items-center gap-2 px-1 py-2 text-sm text-mist hover:text-gold-300">
            <ExternalLink className="size-4" /> Ver site
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-ink-850 p-3">
            <span className="grid size-9 place-items-center rounded-full bg-gold font-bold text-ink-950">{user?.name[0]}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-[0.7rem] text-smoke">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="-mr-1 grid size-9 shrink-0 place-items-center rounded-full text-smoke hover:bg-white/5 hover:text-danger"
              aria-label="Sair"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-white/6 bg-ink-950/90 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-2 sm:px-8">
            <Logo href="/admin" className="h-7" />
            <div className="flex items-center gap-1">
              <Link href="/" className="flex h-10 items-center gap-1.5 rounded-full px-3 text-xs text-mist hover:text-bone">
                <ExternalLink className="size-3.5" /> Ver site
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="flex h-10 items-center gap-1.5 rounded-full px-3 text-xs text-mist hover:text-danger"
              >
                <LogOut className="size-3.5" /> Sair
              </button>
            </div>
          </div>
          <nav className="grid grid-cols-4 gap-1 px-3 pb-2 sm:px-7" aria-label="Painel">
            <Suspense fallback={<NavLinks compact />}>
              <NavWithPath compact />
            </Suspense>
          </nav>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

export function AdminTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-display text-4xl font-medium sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-1 text-mist">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

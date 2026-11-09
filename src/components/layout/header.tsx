"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { NAV_LINKS, SITE, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/cn";
import { cartCount, useCart } from "@/lib/store/cart";
import { useAuth } from "@/lib/store/auth";
import { useHydrated } from "@/lib/store/hydration";

/** Usa o pathname para destacar o link ativo. Fica dentro de <Suspense>. */
export function HeaderWithPath() {
  const pathname = usePathname();
  return <Header pathname={pathname} />;
}

export function Header({ pathname = "" }: { pathname?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const hydrated = useHydrated(useCart, useAuth);
  const count = useCart((s) => cartCount(s.lines));
  const user = useAuth((s) => s.user);

  // Fecha o menu mobile ao trocar de página
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const overHero = pathname === "/" && !scrolled && !open;
  const accountHref = user?.role === "admin" ? "/admin" : user ? "/cliente" : "/login";
  const accountLabel = hydrated && user ? user.name.split(" ")[0] : "Área do cliente";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href) && !href.includes("#");

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo",
          overHero
            ? "bg-gradient-to-b from-black/70 to-transparent"
            : "border-b border-white/6 bg-ink-900/85 backdrop-blur-xl",
        )}
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
          <Logo className="h-8 sm:h-9" preload />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(l.href) ? "text-gold-300" : "text-silver hover:text-bone",
                )}
              >
                {l.label}
                {isActive(l.href) && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gold-400" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href={accountHref}
              className="hidden h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-medium text-silver transition-colors hover:border-gold-500/50 hover:text-bone sm:inline-flex"
            >
              <User className="size-4" />
              <span className="max-w-28 truncate">{accountLabel}</span>
            </Link>
            <Link
              href="/carrinho"
              className="relative grid size-10 place-items-center rounded-full border border-white/10 text-silver transition-colors hover:border-gold-500/50 hover:text-bone"
              aria-label={`Carrinho${hydrated && count ? `, ${count} itens` : ""}`}
            >
              <ShoppingBag className="size-[1.1rem]" />
              {hydrated && count > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[0.65rem] font-bold text-ink-950">
                  {count}
                </span>
              )}
            </Link>
            <a
              href={whatsappLink("Olá! Vim pelo site da Megga Comunicação e gostaria de um orçamento.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-ink-950 transition-all hover:bg-[position:100%_0] xl:inline-flex"
            >
              <WhatsAppIcon className="size-4" />
              Orçamento
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-full text-bone lg:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile — fica fora do <header>: o backdrop-filter dele viraria o bloco de
          contenção deste `fixed`, que ficaria preso à altura do cabeçalho (sem fundo). */}
      <div
        className={cn(
          "fixed inset-x-0 top-18 bottom-0 z-45 overflow-y-auto overscroll-contain bg-ink-900/98 backdrop-blur-xl transition-all duration-500 ease-out-expo lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav className="container-page flex h-full flex-col gap-1 pt-8 pb-10" aria-label="Menu mobile">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
              className={cn(
                "border-b border-white/6 py-4 font-display text-3xl transition-all duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                isActive(l.href) ? "text-gold-300" : "text-bone",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 border-b border-white/6 py-4 font-display text-3xl text-bone"
          >
            <User className="size-6 text-gold-400" /> {accountLabel}
          </Link>
          <div className="mt-auto space-y-3">
            <a
              href={whatsappLink("Olá! Vim pelo site da Megga Comunicação e gostaria de um orçamento.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-[#06210f]"
            >
              <WhatsAppIcon className="size-5" /> Falar no WhatsApp
            </a>
            <p className="text-center text-sm text-mist">{SITE.whatsappDisplay}</p>
          </div>
        </nav>
      </div>
    </>
  );
}

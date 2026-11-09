import Link from "next/link";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SERVICES } from "@/lib/data/services";
import { SITE, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/6 bg-ink-950">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-gold-500/7 blur-3xl" />
      <div className="container-page relative grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:py-20 lg:grid-cols-12">
        <div className="col-span-2 lg:col-span-4">
          <Image src="/brand/logo-vertical.png" alt="Megga Comunicação" width={814} height={645} sizes="160px" className="h-auto w-40" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-mist">{SITE.tagline}</p>
          <p className="mt-4 text-[0.7rem] tracking-[0.25em] text-smoke uppercase">{SITE.areas.join(" • ")}</p>
        </div>

        <div className="lg:col-span-3">
          <h3 className="eyebrow">Serviços</h3>
          <ul className="mt-4 space-y-1 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicos#${s.slug}`} className="inline-block py-1 text-silver transition-colors hover:text-gold-300">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="eyebrow">Navegação</h3>
          <ul className="mt-4 space-y-1 text-sm">
            {[
              ["/", "Início"],
              ["/sobre", "Sobre a Megga"],
              ["/portfolio", "Portfólio"],
              ["/servicos", "Serviços e preços"],
              ["/cliente", "Área do cliente"],
              ["/carrinho", "Carrinho"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-block py-1 text-silver transition-colors hover:text-gold-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 sm:max-w-sm lg:col-span-3 lg:max-w-none">
          <h3 className="eyebrow">Contratações</h3>
          <p className="mt-5 text-sm leading-relaxed text-mist">
            Orçamentos, agendamentos e dúvidas são atendidos pelo nosso WhatsApp.
          </p>
          <a
            href={whatsappLink("Olá! Gostaria de saber mais sobre os serviços da Megga Comunicação.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-850 px-4 py-3 transition-colors hover:border-[#25D366]/50"
          >
            <span className="grid size-10 place-items-center rounded-full bg-[#25D366] text-[#06210f]">
              <WhatsAppIcon className="size-5" />
            </span>
            <span>
              <span className="block text-[0.7rem] tracking-wider text-smoke uppercase">WhatsApp</span>
              <span className="block font-semibold whitespace-nowrap text-bone">{SITE.whatsappDisplay}</span>
            </span>
          </a>
        </div>
      </div>

      <div className="border-t border-white/6">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-smoke sm:flex-row">
          <p>© {SITE.name}. Todos os direitos reservados.</p>
          <p>Fotos e vídeos da área do cliente são protegidos por marca d&apos;água até a compra.</p>
        </div>
      </div>
    </footer>
  );
}

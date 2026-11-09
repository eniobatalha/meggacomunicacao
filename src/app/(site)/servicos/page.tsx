import type { Metadata } from "next";
import Image from "next/image";
import { CalendarCheck, CreditCard, MessageCircle, ShoppingBag } from "lucide-react";
import { ServiceIcon } from "@/components/services/service-icon";
import { ServicePackages } from "@/components/services/service-packages";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/layout/page-hero";
import { SERVICES } from "@/lib/data/services";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Serviços e pacotes",
  description:
    "Cobertura fotográfica, álbuns personalizados, vídeo clipes, storymaker, réplica escolar e transmissão ao vivo. Monte o seu pacote on-line.",
};

const HOW = [
  { icon: ShoppingBag, title: "Escolha o pacote", text: "Adicione um ou mais serviços ao carrinho." },
  { icon: CreditCard, title: "Pague on-line", text: "Pix, cartão em até 10x ou boleto." },
  { icon: CalendarCheck, title: "Confirmamos a data", text: "Nossa equipe fala com você em até 24h." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Serviços"
        title={
          <>
            Tudo o que o seu evento precisa, <em className="text-gold italic">em um só lugar</em>
          </>
        }
        image="/amostras/claquete.jpg"
      >
        Escolha o pacote ideal, adicione ao carrinho e finalize on-line. Prefere conversar antes? Chame a gente no
        WhatsApp.
      </PageHero>

      {/* Navegação rápida */}
      <nav
        aria-label="Serviços"
        className="sticky top-[4.5rem] z-30 border-y border-white/6 bg-ink-900/90 backdrop-blur-xl"
      >
        <div className="container-page flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {SERVICES.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-silver transition-colors hover:border-gold-500/50 hover:text-gold-200"
            >
              <ServiceIcon name={s.icon} className="size-3.5 text-gold-400" />
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      <section className="container-page grid gap-4 pt-12 sm:grid-cols-3">
        {HOW.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="flex items-center gap-4 rounded-2xl border border-white/6 bg-ink-850/60 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-500/10 text-gold-300">
              <Icon className="size-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-semibold text-bone">
                <span className="mr-1.5 text-gold-400">{i + 1}.</span>
                {title}
              </p>
              <p className="text-xs text-mist">{text}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="container-page divide-y divide-white/6 pb-24">
        {SERVICES.map((s) => (
          <section key={s.slug} id={s.slug} className="scroll-mt-36 py-16 sm:py-20">
            <Reveal className="grid grid-cols-1 gap-10 *:min-w-0 lg:grid-cols-[22rem_1fr] lg:gap-14">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-800">
                  <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 22rem, 100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-transparent" />
                  <span className="absolute bottom-4 left-5 font-display text-6xl text-white/85 italic">{s.number}</span>
                  <span className="absolute top-4 right-4 grid size-12 place-items-center rounded-2xl border border-gold-500/30 bg-ink-900/70 text-gold-300 backdrop-blur">
                    <ServiceIcon name={s.icon} className="size-5" />
                  </span>
                </div>
                <h2 className="mt-6 font-display text-4xl leading-tight font-medium text-bone">{s.title}</h2>
                <p className="mt-3 leading-relaxed text-mist">{s.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.idealFor.map((t) => (
                    <span key={t} className="rounded-full bg-white/4 px-3 py-1 text-xs text-silver ring-1 ring-white/8">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={whatsappLink(`Olá! Tenho interesse no serviço "${s.title}". Podem me ajudar?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold-300 underline-offset-4 hover:underline"
                >
                  <MessageCircle className="size-4" /> Tirar dúvidas sobre este serviço
                </a>
              </div>
              <ServicePackages service={s} />
            </Reveal>
          </section>
        ))}
      </div>

      <section className="border-t border-white/6 bg-ink-950 py-16">
        <div className="container-page flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <p className="font-display text-3xl text-bone">Precisa de um pacote personalizado?</p>
            <p className="mt-1 text-mist">Combinamos serviços e montamos um orçamento sob medida para o seu evento.</p>
          </div>
          <ButtonLink href={whatsappLink("Olá! Gostaria de um pacote personalizado para o meu evento.")} external variant="whatsapp" size="lg">
            <WhatsAppIcon className="size-5" /> Montar pacote no WhatsApp
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Download, Eye, Heart, Lock, ShoppingBag, Truck } from "lucide-react";
import { BrandSymbol } from "@/components/brand/logo";
import { Watermark } from "@/components/gallery/watermark";
import { ServiceIcon } from "@/components/services/service-icon";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CATEGORY_LABEL, PORTFOLIO, PORTFOLIO_CATEGORIES } from "@/lib/data/portfolio";
import { PRINT_SIZES } from "@/lib/data/pricing";
import { SERVICES, startingPrice } from "@/lib/data/services";
import { brl } from "@/lib/format";
import { SITE, whatsappLink } from "@/lib/site";

/* ───────────────────────── Marquee ───────────────────────── */

const EVENTS = ["Casamentos", "Formaturas", "Aniversários", "15 anos", "Eventos corporativos", "Eventos escolares", "Batizados", "Ensaios"];

export function EventMarquee() {
  const row = [...EVENTS, ...EVENTS];
  return (
    <div id="marquee" className="relative overflow-hidden border-y border-white/6 bg-ink-950 py-6">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((e, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-3xl text-silver/80 italic sm:text-4xl">
            {e}
            <BrandSymbol className="w-5 opacity-80" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950" />
    </div>
  );
}

/* ───────────────────────── Sobre (teaser) ───────────────────────── */

const VALUES = [
  { title: "Olhar sensível", text: "Atenção aos detalhes, às emoções e aos momentos espontâneos." },
  { title: "Equipe completa", text: "Fotografia, vídeo, conteúdo para redes e transmissão em um só lugar." },
  { title: "Entrega organizada", text: "Galeria on-line privada, com compra de fotos digitais e impressas." },
];

export function AboutTeaser() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-page grid items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-md lg:mx-0">
          <div className="absolute -inset-2 translate-x-2 translate-y-2 rounded-[2rem] border border-gold-500/40 sm:-inset-3 sm:translate-x-6 sm:translate-y-6" aria-hidden />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink-800">
            <Image
              src="/equipe/fundadora.jpg"
              alt="Fundadora da Megga Comunicação segurando uma câmera fotográfica"
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover object-[center_30%]"
            />
          </div>
          <div className="absolute -bottom-6 -left-3 rounded-2xl border border-white/10 bg-ink-850/95 px-5 py-4 shadow-2xl backdrop-blur sm:-left-10 lg:-left-6 2xl:-left-10">
            <p className="font-display text-2xl text-gold-200 italic">Por trás das lentes</p>
            <p className="text-xs tracking-wider text-mist uppercase">Fundadora · Megga Comunicação</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            eyebrow="Quem somos"
            title={
              <>
                Registramos histórias e <em className="text-gold italic">eternizamos emoções</em>
              </>
            }
          >
            <p>{SITE.description}</p>
          </SectionHeading>
          <ul className="mt-10 space-y-5">
            {VALUES.map((v) => (
              <li key={v.title} className="flex gap-4">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-300">
                  <Check className="size-3.5" />
                </span>
                <div>
                  <p className="font-semibold text-bone">{v.title}</p>
                  <p className="text-sm text-mist">{v.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <ButtonLink href="/sobre" variant="outline" className="mt-10">
            Conheça a Megga <ArrowUpRight className="size-4" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Serviços ───────────────────────── */

export function ServicesPreview() {
  return (
    <section className="relative bg-ink-950 py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Nossos serviços"
            title={
              <>
                Soluções audiovisuais <em className="text-gold italic">para cada momento</em>
              </>
            }
          >
            <p>Monte o seu pacote, adicione ao carrinho e garanta a sua data.</p>
          </SectionHeading>
          <ButtonLink href="/servicos" variant="outline" className="self-start md:self-auto">
            Ver todos os pacotes <ArrowUpRight className="size-4" />
          </ButtonLink>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 90}>
              <Link
                href={`/servicos#${s.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/7 bg-ink-850 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_30px_60px_-30px_rgba(212,164,65,0.35)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/20 to-transparent" />
                  <span className="absolute top-4 left-5 font-display text-5xl text-white/80 italic">{s.number}</span>
                </div>
                <div className="relative flex flex-1 flex-col p-6 pt-0">
                  <span className="-mt-7 mb-4 grid size-14 place-items-center rounded-2xl border border-gold-500/30 bg-ink-800 text-gold-300 shadow-lg">
                    <ServiceIcon name={s.icon} className="size-6" />
                  </span>
                  <h3 className="font-display text-2xl font-medium text-bone">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">{s.short}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/6 pt-4">
                    <p className="text-xs text-smoke">
                      a partir de <span className="text-base font-semibold text-gold-200">{brl(startingPrice(s))}</span>
                    </p>
                    <span className="grid size-9 place-items-center rounded-full border border-white/10 text-silver transition-all group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-ink-950">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Área do cliente ───────────────────────── */

const STEPS = [
  { title: "Registramos o seu evento", text: "Nossa equipe fotografa e filma cada detalhe." },
  { title: "Publicamos sua galeria", text: "Você recebe acesso a uma galeria privada, com prévias protegidas." },
  { title: "Você escolhe o formato", text: "Digital em alta resolução ou impressa no tamanho que quiser." },
  { title: "Paga on-line e recebe", text: "Pagamento seguro e instruções claras de entrega ou retirada." },
];

export function ClientAreaShowcase() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-gold-500/8 blur-3xl" />
      <div className="container-page grid grid-cols-1 items-center gap-16 *:min-w-0 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Área do cliente"
            title={
              <>
                Suas fotos, <em className="text-gold italic">do seu jeito</em>
              </>
            }
          >
            <p>
              Mais que um site: um espaço exclusivo para você reviver o seu evento e escolher como quer guardar cada
              lembrança.
            </p>
          </SectionHeading>
          <ol className="mt-10 space-y-1">
            {STEPS.map((s, i) => (
              <li key={s.title} className="group flex gap-5 rounded-2xl p-3 transition-colors hover:bg-white/3">
                <span className="w-9 shrink-0 font-display text-3xl text-gold-400/80 italic">{String(i + 1).padStart(2, "0")}</span>
                <div className="border-l border-white/10 pl-5">
                  <p className="font-semibold text-bone">{s.title}</p>
                  <p className="text-sm text-mist">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/login">
              <Lock className="size-4" /> Acessar minha galeria
            </ButtonLink>
          </div>
        </Reveal>

        {/* Mock da interface */}
        <Reveal delay={150} className="relative">
          <div className="relative rounded-[1.75rem] border border-white/10 bg-ink-850 p-3 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-1.5 px-3 pt-1 pb-3">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="ml-3 min-w-0 truncate rounded-full bg-ink-700 px-3 py-1 text-[0.65rem] text-smoke">
                megga.com.br/cliente/galeria/casamento-julia-rafael
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1.25fr_1fr]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-auto">
                <Image src="/amostras/casamento-11.jpg" alt="Prévia de foto com marca d'água" fill sizes="(min-width: 1024px) 22rem, 60vw" className="object-cover" />
                <Watermark />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur">
                    <Heart className="size-4 fill-gold-400 text-gold-400" />
                  </span>
                  <span className="grid size-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur">
                    <Eye className="size-4" />
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-ink-800 p-4">
                <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-smoke uppercase">Como você quer esta foto?</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/10 p-3">
                    <Download className="size-4 text-silver" />
                    <p className="mt-2 text-xs font-semibold">Digital</p>
                    <p className="text-[0.65rem] text-smoke">Alta resolução</p>
                  </div>
                  <div className="rounded-xl border border-gold-500/70 bg-gold-500/10 p-3">
                    <Truck className="size-4 text-gold-300" />
                    <p className="mt-2 text-xs font-semibold text-gold-100">Impressa</p>
                    <p className="text-[0.65rem] text-gold-200/70">Papel fotográfico</p>
                  </div>
                </div>
                <p className="mt-4 text-[0.65rem] font-semibold tracking-[0.2em] text-smoke uppercase">Tamanho</p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {PRINT_SIZES.slice(0, 6).map((s, i) => (
                    <div
                      key={s.id}
                      className={
                        i === 3
                          ? "rounded-lg border border-gold-500/70 bg-gold-500/10 px-2 py-1.5"
                          : "rounded-lg border border-white/8 px-2 py-1.5"
                      }
                    >
                      <p className="text-[0.68rem] font-semibold">{s.label}</p>
                      <p className="text-[0.62rem] text-smoke">{brl(s.price)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex h-10 items-center justify-center gap-2 rounded-full bg-gold text-xs font-bold text-ink-950">
                  <ShoppingBag className="size-3.5" /> Adicionar · {brl(PRINT_SIZES[3].price)}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-800/95 px-4 py-3 shadow-2xl backdrop-blur sm:-left-8">
            <span className="grid size-9 place-items-center rounded-full bg-success/15 text-success">
              <Check className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-bone">Pagamento aprovado</p>
              <p className="text-[0.65rem] text-mist">Arquivos liberados sem marca d&apos;água</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Portfólio ───────────────────────── */

const FEATURED = PORTFOLIO.filter((p) => p.featured).map((p) => ({ ...p, label: CATEGORY_LABEL[p.category] }));

export function Portfolio() {
  return (
    <section id="portfolio" className="scroll-mt-20 bg-ink-950 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Portfólio"
          title={
            <>
              Momentos que <em className="text-gold italic">ficam para sempre</em>
            </>
          }
        >
          <p>Uma amostra do nosso olhar em casamentos, formaturas, aniversários, eventos corporativos e shows.</p>
        </SectionHeading>
        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {FEATURED.map((p, i) => (
            <Reveal key={p.src} delay={(i % 3) * 80} className="break-inside-avoid">
              <figure className="group relative overflow-hidden rounded-2xl bg-ink-800">
                <Image
                  src={p.src}
                  alt={`Foto de ${p.label.toLowerCase()} — portfólio Megga`}
                  width={p.w}
                  height={p.h}
                  sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-12 transition-all duration-500 pointer-fine:translate-y-2 pointer-fine:opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="eyebrow text-gold-200">{p.label}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-mist">
            {PORTFOLIO.length} fotos em {PORTFOLIO_CATEGORIES.length} categorias
          </p>
          <ButtonLink href="/portfolio" variant="outline">
            Ver portfólio completo <ArrowUpRight className="size-4" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Equipe ───────────────────────── */

export function TeamSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-page grid grid-cols-1 items-center gap-14 *:min-w-0 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="order-2 lg:order-1">
          <SectionHeading
            eyebrow="Nossa equipe"
            title={
              <>
                Gente apaixonada por <em className="text-gold italic">contar histórias</em>
              </>
            }
          >
            <p>
              Fotógrafos, cinegrafistas e criadores de conteúdo que trabalham juntos para que nenhum momento importante
              passe despercebido — do primeiro clique à entrega final.
            </p>
          </SectionHeading>
          <dl className="mt-10 grid grid-cols-2 gap-4">
            {[
              ["Fotografia", "Cobertura e álbuns"],
              ["Filmagem", "Clipes e filmes"],
              ["Conteúdo", "Storymaker e redes"],
              ["Ao vivo", "Transmissões on-line"],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-white/7 bg-ink-850 p-5">
                <dt className="font-display text-2xl text-gold-200">{t}</dt>
                <dd className="mt-1 text-sm text-mist">{d}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-sm">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-ink-800">
              <Image
                src="/equipe/equipe.jpg"
                alt="Equipe Megga Comunicação reunida em um evento ao ar livre, com câmeras"
                fill
                sizes="(min-width: 1024px) 24rem, 90vw"
                className="object-cover object-[center_35%]"
              />
            </div>
            <div className="absolute -top-5 -right-5 grid size-24 place-items-center rounded-full border border-gold-500/40 bg-ink-900/90 backdrop-blur">
              <BrandSymbol className="w-11" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA final ───────────────────────── */

export function FinalCta() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold-500/25 bg-ink-850 px-6 py-16 text-center sm:px-16 sm:py-24">
            <Image src="/amostras/formatura-04.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-850/60 via-ink-850/80 to-ink-850" />
            <div className="relative">
              <BrandSymbol className="mx-auto w-14" />
              <h2 className="mx-auto mt-8 max-w-3xl font-display text-4xl leading-tight font-medium sm:text-6xl">
                Vamos eternizar o seu <em className="text-gold italic">próximo evento?</em>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-mist">
                Conte pra gente a data, o local e o que você imagina. Respondemos rapidinho pelo WhatsApp com um
                orçamento sob medida.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink
                  href={whatsappLink("Olá! Gostaria de um orçamento para o meu evento.")}
                  external
                  variant="whatsapp"
                  size="lg"
                >
                  <WhatsAppIcon className="size-5" /> {SITE.whatsappDisplay}
                </ButtonLink>
                <ButtonLink href="/servicos" variant="outline" size="lg">
                  Montar meu pacote
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

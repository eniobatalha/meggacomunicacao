import type { Metadata } from "next";
import Image from "next/image";
import { Aperture, HeartHandshake, Layers, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { FinalCta, TeamSection } from "@/components/home/sections";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre a Megga",
  description: SITE.description,
};

const PILLARS = [
  { icon: Aperture, title: "Olhar artístico", text: "Composição, luz e emoção em cada clique e em cada take." },
  { icon: HeartHandshake, title: "Atendimento próximo", text: "Do primeiro contato à entrega, você fala com quem faz." },
  { icon: Layers, title: "Soluções completas", text: "Foto, vídeo, redes sociais, álbuns e transmissão ao vivo." },
  { icon: ShieldCheck, title: "Entrega segura", text: "Galeria privada com prévias protegidas e compra on-line." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre a Megga"
        title={
          <>
            Comunicação, fotografia e <em className="text-gold italic">produção audiovisual</em>
          </>
        }
        image="/amostras/camera.jpg"
      >
        {SITE.tagline}
      </PageHero>

      <section className="py-24 sm:py-28">
        <div className="container-page grid grid-cols-1 items-center gap-16 *:min-w-0 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-ink-800">
              <Image
                src="/equipe/fundadora.jpg"
                alt="Fundadora da Megga Comunicação com sua câmera"
                fill
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover object-[center_25%]"
              />
            </div>
            <div className="absolute -right-3 -bottom-6 rounded-2xl border border-gold-500/30 bg-ink-850/95 px-5 py-4 backdrop-blur sm:-right-10 lg:-right-6 2xl:-right-10">
              <p className="font-display text-xl text-gold-200 italic">Fundadora</p>
              <p className="text-xs tracking-wider text-mist uppercase">{SITE.name}</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionHeading
              eyebrow="Nossa história"
              title={
                <>
                  Cada evento é uma história <em className="text-gold italic">única</em>
                </>
              }
            >
              <p>{SITE.description}</p>
              <p className="mt-4">
                Acreditamos que uma boa imagem vai além da técnica: ela guarda o sorriso espontâneo, o abraço
                apertado e os detalhes que fazem de cada celebração um momento só seu. É isso que buscamos em cada
                trabalho — e é por isso que cuidamos de tudo, da captação à entrega.
              </p>
            </SectionHeading>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink-950 py-24">
        <div className="container-page">
          <SectionHeading align="center" eyebrow="O que nos move" title="Nossos pilares" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-white/7 bg-ink-850 p-7">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gold-500/10 text-gold-300">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <p className="mt-6 font-display text-2xl text-bone">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />
      <FinalCta />
    </>
  );
}

import Image from "next/image";
import { ChevronDown, CreditCard, Images, Printer } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SITE, whatsappLink } from "@/lib/site";

const HIGHLIGHTS = [
  { icon: Images, title: "Galeria privada", text: "Suas fotos e vídeos on-line, só para você" },
  { icon: Printer, title: "Digital ou impressa", text: "Escolha o formato e o tamanho de cada foto" },
  { icon: CreditCard, title: "Pagamento on-line", text: "Pix, cartão ou boleto via Mercado Pago" },
];

export function Hero() {
  return (
    <section className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <Image
          src="/amostras/casamento-01.jpg"
          alt="Noiva segurando o buquê sob a luz do pôr do sol"
          fill
          preload
          sizes="100vw"
          className="animate-slow-zoom object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-950/40" />
      </div>

      <div className="container-page relative flex flex-1 flex-col justify-center pt-32 pb-16">
        <p className="eyebrow animate-fade-up">{SITE.areas.join(" • ")}</p>
        <h1 className="mt-6 max-w-4xl animate-fade-up font-display text-[2.9rem] leading-[0.98] font-medium text-bone [animation-delay:120ms] sm:text-7xl lg:text-[5.6rem]">
          Transformamos momentos especiais em{" "}
          <em className="text-gold pr-2 font-normal italic">lembranças eternas</em>
        </h1>
        <p className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-silver [animation-delay:240ms] sm:text-lg">
          Fotografia, filmagem e conteúdo para casamentos, formaturas, aniversários e eventos — com uma área exclusiva
          onde você vê, escolhe e compra suas fotos on-line.
        </p>
        <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:360ms] sm:flex-row">
          <ButtonLink
            href={whatsappLink("Olá! Vim pelo site e gostaria de um orçamento para o meu evento.")}
            external
            size="lg"
          >
            <WhatsAppIcon className="size-5" />
            Solicitar orçamento
          </ButtonLink>
          <ButtonLink href="/login" variant="outline" size="lg">
            Ver minhas fotos
          </ButtonLink>
        </div>
      </div>

      <div className="relative border-t border-white/7 bg-ink-950/50 backdrop-blur-md">
        <div className="container-page grid gap-6 py-6 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold-500/30 text-gold-300">
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-sm font-semibold text-bone">{title}</p>
                <p className="text-xs text-mist">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#marquee"
        className="absolute right-6 bottom-28 hidden flex-col items-center gap-2 text-[0.6rem] tracking-[0.3em] text-mist uppercase transition-colors hover:text-gold-300 lg:flex"
        aria-label="Rolar para baixo"
      >
        <span className="[writing-mode:vertical-rl]">Role</span>
        <ChevronDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}

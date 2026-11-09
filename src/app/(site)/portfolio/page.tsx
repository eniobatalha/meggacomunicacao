import type { Metadata } from "next";
import { FinalCta } from "@/components/home/sections";
import { PageHero } from "@/components/layout/page-hero";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "Casamentos, ensaios, formaturas, aniversários, eventos corporativos e shows: veja uma amostra do trabalho da Megga Comunicação.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfólio"
        title={
          <>
            Cada evento, <em className="text-gold italic">uma história</em>
          </>
        }
        image="/amostras/casamento-20.jpg"
      >
        Uma amostra do nosso olhar em casamentos, ensaios, formaturas, aniversários, eventos corporativos e shows.
        Toque numa foto para ampliar.
      </PageHero>

      <PortfolioGallery />

      <FinalCta />
    </>
  );
}

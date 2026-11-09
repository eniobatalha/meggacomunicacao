import { Hero } from "@/components/home/hero";
import {
  AboutTeaser,
  ClientAreaShowcase,
  EventMarquee,
  FinalCta,
  Portfolio,
  ServicesPreview,
  TeamSection,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EventMarquee />
      <AboutTeaser />
      <ServicesPreview />
      <ClientAreaShowcase />
      <Portfolio />
      <TeamSection />
      <FinalCta />
    </>
  );
}

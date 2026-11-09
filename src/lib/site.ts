export const SITE = {
  name: "Megga Comunicação",
  shortName: "Megga",
  tagline: "Transformamos momentos especiais em lembranças eternas!",
  areas: ["Comunicação", "Fotografia", "Filmagem", "Produção audiovisual"],
  description:
    "A Megga Comunicação é especializada em soluções audiovisuais, fotografia e produção de conteúdos para eventos. Registramos histórias, eternizamos emoções e criamos experiências únicas por meio de imagens, vídeos e projetos personalizados.",
  whatsapp: "5581988059297",
  whatsappDisplay: "(81) 98805-9297",
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/sobre", label: "Sobre" },
  { href: "/portfolio", label: "Portfólio" },
] as const;

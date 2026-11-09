/**
 * Catálogo de serviços — PREÇOS FICTÍCIOS para apresentação.
 * Quando o backend existir, esta lista virá do banco/painel administrativo.
 */

export type ServiceIcon =
  | "camera"
  | "album"
  | "film"
  | "story"
  | "school"
  | "live";

export type ServicePackage = {
  id: string;
  name: string;
  price: number;
  /** Ex.: "por aluno" — exibido ao lado do preço */
  unit?: string;
  highlight?: boolean;
  features: string[];
};

export type Service = {
  slug: string;
  number: string;
  title: string;
  icon: ServiceIcon;
  short: string;
  description: string;
  image: string;
  idealFor: string[];
  /** Serviços realizados em evento pedem a data no carrinho */
  needsEventDate: boolean;
  packages: ServicePackage[];
};

export const SERVICES: Service[] = [
  {
    slug: "cobertura-fotografica-digital",
    number: "01",
    title: "Cobertura Fotográfica Digital",
    icon: "camera",
    short:
      "Registro profissional dos melhores momentos, com fotos de alta qualidade.",
    description:
      "Registro profissional dos melhores momentos de cada evento, com fotografias de alta qualidade, capturando emoções, detalhes e momentos inesquecíveis.",
    image: "/amostras/servico-cobertura.jpg",
    idealFor: ["Casamentos", "Formaturas", "Aniversários", "Corporativo"],
    needsEventDate: true,
    packages: [
      {
        id: "essencial",
        name: "Essencial",
        price: 890,
        features: [
          "Até 3 horas de cobertura",
          "1 fotógrafo",
          "200+ fotos tratadas",
          "Galeria online privada",
        ],
      },
      {
        id: "completa",
        name: "Completa",
        price: 1490,
        highlight: true,
        features: [
          "Até 6 horas de cobertura",
          "1 fotógrafo + assistente",
          "400+ fotos tratadas",
          "Galeria online privada",
          "10 fotos impressas 15x21",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        price: 2490,
        features: [
          "Até 10 horas de cobertura",
          "2 fotógrafos",
          "700+ fotos tratadas",
          "Galeria online privada",
          "Making of + ensaio pré-evento",
        ],
      },
    ],
  },
  {
    slug: "albuns-personalizados",
    number: "02",
    title: "Álbuns Personalizados",
    icon: "album",
    short:
      "Álbuns exclusivos com diagramação personalizada e acabamento especial.",
    description:
      "Criação de álbuns fotográficos exclusivos, com diagramação personalizada e acabamento especial para guardar as melhores recordações.",
    image: "/amostras/servico-album.jpg",
    idealFor: ["Casamentos", "15 anos", "Formaturas", "Ensaios"],
    needsEventDate: false,
    packages: [
      {
        id: "classico",
        name: "Clássico 20x20",
        price: 690,
        features: [
          "20 lâminas (40 páginas)",
          "Capa em tecido",
          "Diagramação exclusiva",
          "1 rodada de ajustes",
        ],
      },
      {
        id: "signature",
        name: "Signature 30x30",
        price: 1190,
        highlight: true,
        features: [
          "30 lâminas (60 páginas)",
          "Capa em couro sintético",
          "Papel fotográfico premium",
          "2 rodadas de ajustes",
        ],
      },
      {
        id: "luxo",
        name: "Luxo 40x30",
        price: 1890,
        features: [
          "40 lâminas (80 páginas)",
          "Capa em acrílico ou couro",
          "Caixa de presente personalizada",
          "Mini álbum para os pais",
        ],
      },
    ],
  },
  {
    slug: "video-clipes-para-eventos",
    number: "03",
    title: "Vídeo Clipes para Eventos",
    icon: "film",
    short:
      "Filmes emocionantes para formaturas, casamentos, aniversários e mais.",
    description:
      "Produção e edição de vídeos especiais para formaturas, casamentos, aniversários e eventos em geral, transformando momentos marcantes em filmes emocionantes.",
    image: "/amostras/servico-video.jpg",
    idealFor: ["Casamentos", "Formaturas", "Aniversários", "Institucional"],
    needsEventDate: true,
    packages: [
      {
        id: "clipe",
        name: "Clipe",
        price: 1290,
        features: [
          "Clipe de 3 a 5 minutos",
          "1 cinegrafista",
          "Trilha sonora licenciada",
          "Entrega em Full HD",
        ],
      },
      {
        id: "filme",
        name: "Clipe + Filme",
        price: 2190,
        highlight: true,
        features: [
          "Clipe de 3 a 5 minutos",
          "Filme completo do evento",
          "2 cinegrafistas",
          "Entrega em 4K",
        ],
      },
      {
        id: "cinema",
        name: "Cinema",
        price: 3490,
        features: [
          "Clipe + filme + teaser para redes",
          "Imagens aéreas com drone",
          "Captação de áudio profissional",
          "Entrega em 4K + pen drive",
        ],
      },
    ],
  },
  {
    slug: "storymaker",
    number: "04",
    title: "Storymaker",
    icon: "story",
    short:
      "Conteúdo em tempo real para redes sociais: vídeos curtos e bastidores.",
    description:
      "Produção de conteúdos em tempo real para redes sociais, com registros criativos, vídeos curtos e bastidores dos eventos, aproximando o público de cada momento especial.",
    image: "/amostras/servico-storymaker.jpg",
    idealFor: ["Casamentos", "15 anos", "Lançamentos", "Corporativo"],
    needsEventDate: true,
    packages: [
      {
        id: "3h",
        name: "Story 3h",
        price: 690,
        features: [
          "Até 3 horas no evento",
          "Stories em tempo real",
          "5 reels editados no local",
          "Arquivos brutos via link",
        ],
      },
      {
        id: "5h",
        name: "Story 5h",
        price: 990,
        highlight: true,
        features: [
          "Até 5 horas no evento",
          "Stories em tempo real",
          "10 reels editados no local",
          "Retrospectiva no dia seguinte",
        ],
      },
      {
        id: "completo",
        name: "Evento completo",
        price: 1390,
        features: [
          "Do making of ao fim da festa",
          "Stories + reels ilimitados",
          "Gimbal e iluminação própria",
          "Retrospectiva em até 24h",
        ],
      },
    ],
  },
  {
    slug: "replica-escolar",
    number: "05",
    title: "Réplica Escolar",
    icon: "school",
    short:
      "Materiais personalizados para escolas, valorizando conquistas dos alunos.",
    description:
      "Produção de materiais personalizados para instituições de ensino e eventos escolares, valorizando as conquistas e criando recordações especiais para alunos e familiares.",
    image: "/amostras/servico-escolar.jpg",
    idealFor: ["Formaturas", "ABC", "Conclusão do 9º ano", "Ensino médio"],
    needsEventDate: false,
    packages: [
      {
        id: "kit-aluno",
        name: "Kit Aluno",
        price: 149,
        unit: "por aluno",
        features: [
          "Réplica de diploma emoldurada",
          "Foto individual com beca 20x25",
          "Arquivo digital da foto",
        ],
      },
      {
        id: "turma-30",
        name: "Turma até 30",
        price: 3900,
        highlight: true,
        features: [
          "Kit Aluno para até 30 alunos",
          "Foto oficial da turma 30x40",
          "Painel de homenagem para a escola",
        ],
      },
      {
        id: "turma-60",
        name: "Turma até 60",
        price: 6900,
        features: [
          "Kit Aluno para até 60 alunos",
          "Foto oficial da turma 30x40",
          "Vídeo homenagem da turma",
          "Painel de homenagem para a escola",
        ],
      },
    ],
  },
  {
    slug: "transmissao-ao-vivo",
    number: "06",
    title: "Transmissão ao Vivo",
    icon: "live",
    short:
      "Transmissão profissional pela internet para quem não pode estar presente.",
    description:
      "Transmissão profissional de eventos pela internet, permitindo que familiares, convidados e espectadores acompanhem tudo de qualquer lugar.",
    image: "/amostras/servico-transmissao.jpg",
    idealFor: ["Colações de grau", "Casamentos", "Cultos", "Palestras"],
    needsEventDate: true,
    packages: [
      {
        id: "basica",
        name: "Básica",
        price: 1190,
        features: [
          "1 câmera Full HD",
          "Até 3 horas de transmissão",
          "YouTube ou link privado",
          "Gravação entregue após o evento",
        ],
      },
      {
        id: "multicamera",
        name: "Multicâmera",
        price: 2290,
        highlight: true,
        features: [
          "3 câmeras com corte ao vivo",
          "Até 5 horas de transmissão",
          "Vinhetas e letreiros personalizados",
          "Gravação entregue após o evento",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        price: 3490,
        features: [
          "Até 5 câmeras + drone",
          "Transmissão em telão no local",
          "Link de internet dedicado",
          "Interação com convidados on-line",
        ],
      },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export function startingPrice(service: Service) {
  return Math.min(...service.packages.map((p) => p.price));
}

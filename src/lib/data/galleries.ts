/**
 * Galerias e usuários de DEMONSTRAÇÃO.
 * Fotos de exemplo: Unsplash (licença Unsplash). Vídeos de exemplo: MDN (CC0).
 */

export type MediaType = "photo" | "video";

export type MediaItem = {
  id: string;
  type: MediaType;
  /** Arquivo de prévia (na versão real: versão reduzida + marca d'água no servidor) */
  src: string;
  width: number;
  height: number;
  /** Para vídeos */
  poster?: string;
  duration?: string;
  title?: string;
};

export type EventType =
  | "Casamento"
  | "Formatura"
  | "Aniversário"
  | "15 anos"
  | "Corporativo"
  | "Escolar"
  | "Outro";

export type Gallery = {
  id: string;
  title: string;
  eventType: EventType;
  date: string;
  location: string;
  /** E-mail do cliente dono da galeria */
  ownerEmail?: string;
  /** Código para acesso compartilhado (ex.: formaturas) */
  accessCode: string;
  cover: string;
  expiresAt: string;
  /** Preço do pacote com todas as fotos em digital */
  digitalPackPrice: number;
  items: MediaItem[];
};

type Dim = [number, number];
/** Gera fotos `/amostras/{prefix}-NN.jpg` numeradas a partir de `start` */
const photos = (prefix: string, dims: Dim[], start = 1): MediaItem[] =>
  dims.map(([width, height], i) => {
    const n = String(start + i).padStart(2, "0");
    return {
      id: `${prefix}-${n}`,
      type: "photo",
      src: `/amostras/${prefix}-${n}.jpg`,
      width,
      height,
    };
  });

const L: Dim = [1400, 933];
const P: Dim = [933, 1400];

export const SEED_GALLERIES: Gallery[] = [
  {
    id: "casamento-julia-rafael",
    title: "Casamento Júlia & Rafael",
    eventType: "Casamento",
    date: "2026-09-19T16:00:00-03:00",
    location: "Espaço Jardim das Flores",
    ownerEmail: "cliente@demo.com",
    accessCode: "JULIA26",
    cover: "/amostras/casamento-05.jpg",
    expiresAt: "2027-03-19T23:59:00-03:00",
    digitalPackPrice: 99.9,
    items: [
      ...photos("casamento", [L, [1400, 935], L, L, P, P, P, [1400, 816], L, L, L, L]),
      // Vídeos no meio da galeria para aparecerem logo na aba "Todas"
      {
        id: "casamento-video-01",
        type: "video",
        src: "/videos/amostra-01.mp4",
        poster: "/amostras/casamento-11.jpg",
        width: 1400,
        height: 933,
        duration: "0:05",
        title: "Teaser do casamento",
      },
      {
        id: "casamento-video-02",
        type: "video",
        src: "/videos/amostra-02.mp4",
        poster: "/amostras/casamento-02.jpg",
        width: 1400,
        height: 933,
        duration: "0:03",
        title: "Entrada dos noivos",
      },
      ...photos(
        "casamento",
        [L, P, L, [1400, 934], [1400, 935], L, [1400, 935], L, [1400, 934], L, L, [1400, 905], P, L, P, L],
        13,
      ),
    ],
  },
  {
    id: "festa-30-anos-julia",
    title: "Festa de 30 anos da Júlia",
    eventType: "Aniversário",
    date: "2026-06-07T20:00:00-03:00",
    location: "Casa de Festas Lumière",
    ownerEmail: "cliente@demo.com",
    accessCode: "FESTA30",
    cover: "/amostras/aniversario-02.jpg",
    expiresAt: "2026-12-07T23:59:00-03:00",
    digitalPackPrice: 59.9,
    items: photos("aniversario", [
      [1400, 934], L, [1400, 1120], [1400, 935], L, [1400, 935],
      L, [1400, 935], [1400, 842], L, L, L, L, L, [1400, 997], L, L, L,
    ]),
  },
  {
    id: "formatura-colegio-horizonte-2026",
    title: "Baile de Formatura — 3º Ano 2026",
    eventType: "Formatura",
    date: "2026-10-24T21:00:00-03:00",
    location: "Centro de Convenções",
    accessCode: "FORMA26",
    cover: "/amostras/formatura-03.jpg",
    expiresAt: "2027-04-24T23:59:00-03:00",
    digitalPackPrice: 79.9,
    items: [
      ...photos("formatura", [
        P, [1083, 1400], [1400, 934], [1400, 844], [1400, 1050], [1400, 934], L, L, [1400, 1050],
        L, [1400, 1224], L, [1400, 935], L, L, L, L, P,
      ]),
      {
        id: "formatura-video-01",
        type: "video",
        src: "/videos/amostra-02.mp4",
        poster: "/amostras/formatura-04.jpg",
        width: 1400,
        height: 844,
        duration: "0:03",
        title: "Abertura do baile",
      },
    ],
  },
];

export type DemoUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "client" | "admin";
};

export const DEMO_USERS: DemoUser[] = [
  {
    name: "Júlia Andrade",
    email: "cliente@demo.com",
    password: "123456",
    phone: "(81) 99999-0000",
    role: "client",
  },
  {
    name: "Equipe Megga",
    email: "admin@demo.com",
    password: "admin123",
    phone: "(81) 98805-9297",
    role: "admin",
  },
];

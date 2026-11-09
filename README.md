# Megga Comunicação — site e área do cliente

Protótipo navegável do site da **Megga Comunicação** (fotografia, filmagem e produção audiovisual), feito para apresentação ao cliente.
Todo o layout e as funcionalidades estão prontos; **backend, pagamentos e uploads são simulados** no navegador.

## Como rodar

```bash
npm install
npm run dev          # http://localhost:3987
npm run build && npm start   # versão de produção
```

Requer Node.js 20.9+ (testado com Node 22).

**No celular:** com o celular no mesmo Wi-Fi, abra `http://<IP-do-computador>:3987` (o IP aparece como *Network* ao rodar `npm run dev`). O `next.config.ts` já libera IPs `192.168.x.x`; se mudar essa configuração, reinicie o `npm run dev`.

## Contas de demonstração

Na tela **Área do cliente** (`/login`) há atalhos de um clique:

| Perfil | E-mail | Senha | O que ver |
|---|---|---|---|
| Cliente | `cliente@demo.com` | `123456` | Galerias do casamento e da festa, compra de fotos, pedidos |
| Equipe Megga | `admin@demo.com` | `admin123` | Painel: galerias, upload, pedidos, preços |

Código de acesso de galeria para testar: **`FORMA26`** (adiciona a galeria da formatura na conta do cliente).

## Roteiro sugerido para a apresentação

1. **Home** → identidade visual, serviços, portfólio, equipe, WhatsApp.
   **Portfólio** (`/portfolio`) → 46 fotos com filtro por tipo de evento; toque para ampliar e deslize entre as fotos.
2. **Serviços** → escolher um pacote (com data do evento) → *Adicionar ao carrinho*.
3. **Área do cliente** → entrar como *Cliente* → abrir *Casamento Júlia & Rafael*.
4. Clicar numa foto → **Digital** ou **Impressa** (7 tamanhos, acabamento, quantidade) → adicionar.
5. Adicionar o **pacote digital completo** no topo da galeria.
6. **Carrinho** → **Checkout** → Pix (QR Code), cartão (até 10x) ou boleto → *Simular pagamento*.
7. **Página do pedido** → próximos passos por tipo de item (digital liberado, produção das impressas, agendamento do serviço).
8. Voltar à galeria → as fotos compradas aparecem **sem marca d'água** e com botão *Baixar*.
9. Sair e entrar como **Equipe Megga** → criar galeria → **enviar fotos/vídeos** → *Ver como cliente*.
10. **Pedidos** → mudar o status (o cliente vê na página do pedido) · **Preços** → alterar valores (refletem na galeria).

> Os dados ficam salvos **apenas no navegador** (localStorage + IndexedDB). Para "zerar" a demonstração, limpe os dados do site no navegador.

## Estrutura

```
src/
  app/
    (site)/             site público + área do cliente (cabeçalho e rodapé)
      page.tsx          home
      servicos/ sobre/ login/ carrinho/ checkout/
      cliente/          painel do cliente e galeria/[id]
      pedido/[id]/      confirmação e acompanhamento do pedido
    admin/              painel da equipe (galerias, upload, pedidos, preços)
  components/           UI por área (home, gallery, cart, checkout, admin…)
  lib/
    site.ts             nome, slogan, WhatsApp
    data/               serviços, preços, galerias, portfólio e usuários (mock)
    store/              estado (Zustand): sessão, carrinho, pedidos, estúdio, preços
    upload.ts           processamento de fotos/vídeos no navegador
public/
  brand/                logos (recortados de /Fotos)
  equipe/               fotos da fundadora e da equipe
  amostras/ videos/     fotos e vídeos de exemplo das galerias e dos serviços
  portfolio/            fotos de exemplo que só aparecem no portfólio
```

## O que está simulado e como vira produção

| Hoje (mock) | Arquivo | Na versão real |
|---|---|---|
| Login e sessão no `localStorage` | `lib/store/auth.ts`, `components/auth/require-auth.tsx` | Auth.js / Clerk / Supabase Auth + verificação no servidor (`proxy.ts`) |
| Galerias, pedidos e preços no navegador | `lib/store/*.ts`, `lib/data/*.ts` | Banco (ex.: Postgres + Prisma) e Server Actions |
| Upload convertido em data URL (IndexedDB) | `lib/upload.ts`, `components/admin/gallery-manager.tsx` | Upload direto para storage (S3/R2/Supabase) com URL assinada |
| Marca d'água aplicada por CSS sobre a imagem | `components/gallery/watermark.tsx` | Prévia em baixa resolução **com a marca gravada no arquivo** (gerada no servidor, ex.: `sharp`); original só após pagamento |
| Pagamento Pix/cartão/boleto simulado | `components/checkout/payment-modal.tsx` | **Mercado Pago** (Checkout Pro ou Checkout Transparente) + webhook confirmando o pagamento e atualizando o pedido |
| Download do arquivo original | `components/gallery/purchase-panel.tsx` | Link temporário assinado, liberado só para pedidos pagos |
| Avisos de pedido | — | E-mail transacional (Resend) e/ou WhatsApp Business API |

## Para confirmar com a Megga antes de publicar

- Preços dos serviços e da tabela de impressões (todos **fictícios**).
- Nome da fundadora, textos institucionais, Instagram e endereço do estúdio (não incluídos por falta da informação).
- Prazos de produção (5 dias úteis para impressas, 7 para pen drive) e valor de entrega.
- Fotos reais de portfólio para substituir as de exemplo.

## Créditos das amostras

Fotos de exemplo: [Unsplash](https://unsplash.com/license). Vídeos de exemplo: MDN Web Docs (CC0). Substitua pelo material da Megga antes de publicar.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha área",
  robots: { index: false },
};

/**
 * A proteção de acesso (<RequireAuth>) fica em cada página, não aqui:
 * um layout que segura os filhos impede o Next de validar a navegação
 * instantânea entre as páginas da área do cliente.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return children;
}

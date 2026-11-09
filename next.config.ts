import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite abrir o servidor de desenvolvimento pelo IP da rede local (ex.: no celular,
  // em http://192.168.x.x:3987). Sem isso o Next bloqueia a atualização ao vivo nesses acessos.
  allowedDevOrigins: ["192.168.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

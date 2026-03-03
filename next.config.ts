import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Otimizações para produção
  poweredByHeader: false,
  // Configuração experimental para melhor performance
  experimental: {
    // Otimização de pacotes
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;

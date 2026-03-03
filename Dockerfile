# ===========================================
# Dockerfile - Uranium Company
# Backup para deploy no EasyPanel
# ===========================================

FROM node:20-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache openssl

# ===========================================
# Estágio 1: Instalar dependências
# ===========================================
FROM base AS deps

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# ===========================================
# Estágio 2: Build da aplicação
# ===========================================
FROM base AS builder

WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar Prisma Client novamente (para garantir)
RUN npx prisma generate

# Build do Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ===========================================
# Estágio 3: Produção
# ===========================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Ajustar permissões
RUN chown -R nextjs:nodejs /app

USER nextjs

# Porta
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando de inicialização
CMD ["node", "server.js"]

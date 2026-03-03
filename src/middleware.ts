/**
 * Middleware de Autenticação - Uranium Company
 * Protege rotas autenticadas e permite acesso a rotas públicas
 */

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Se chegou aqui, o usuário está autenticado
    return NextResponse.next()
  },
  {
    callbacks: {
      // Função para determinar se o usuário tem acesso
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Rotas públicas (acesso sem autenticação)
        const publicPaths = [
          '/login',
          '/register',
          '/api/auth',
          '/p/view', // Visualização pública de apresentações
        ]

        // Verificar se é uma rota pública
        const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

        // Permitir acesso a rotas públicas
        if (isPublicPath) {
          return true
        }

        // Verificar se é a rota raiz (dashboard)
        if (pathname === '/') {
          return !!token // Requer autenticação
        }

        // Todas as outras rotas requerem autenticação
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Processar todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico (favicon)
     * - arquivos públicos
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

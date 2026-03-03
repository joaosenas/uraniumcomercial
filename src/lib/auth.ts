/**
 * Configuração do NextAuth.js - Uranium Company
 * Autenticação com Credentials Provider (email + senha)
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  // Usar JWT ao invés de sessões em banco de dados
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  
  // Provedores de autenticação
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        // Validar se as credenciais foram fornecidas
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Buscar usuário no banco
        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        // Verificar se usuário existe
        if (!user) {
          return null
        }

        // Verificar senha
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        // Retornar dados do usuário (sem a senha)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],

  // Callbacks para manipular dados da sessão
  callbacks: {
    async jwt({ token, user }) {
      // Adicionar ID do usuário ao token na primeira autenticação
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Adicionar ID do usuário à sessão
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },

  // Páginas customizadas
  pages: {
    signIn: '/login',
    error: '/login',
  },

  // Secret para assinar tokens JWT
  secret: process.env.NEXTAUTH_SECRET,
}

// Tipos para estender o NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}

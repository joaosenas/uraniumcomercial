/**
 * Seed do banco de dados - Uranium Company
 * Cria o usuário administrador inicial
 * 
 * Executar: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Verificar se já existe um admin
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@uranium.com' }
  })

  if (existingAdmin) {
    console.log('✅ Usuário admin já existe:', existingAdmin.email)
    return
  }

  // Criar hash da senha
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@uranium.com',
      name: 'Administrador',
      password: hashedPassword,
    }
  })

  console.log('✅ Usuário admin criado com sucesso!')
  console.log('📧 Email:', admin.email)
  console.log('🔑 Senha: admin123')
  console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

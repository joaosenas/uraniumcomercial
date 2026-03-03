/**
 * API de Apresentações - Uranium Company
 * GET: Listar apresentações do usuário
 * POST: Criar nova apresentação
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET - Listar apresentações
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Parâmetros de filtro
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const client = searchParams.get('client') || ''

    // Construir filtros
    const where: any = {
      createdBy: session.user.id
    }

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { projectTitle: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status && ['ACTIVE', 'DRAFT'].includes(status)) {
      where.status = status
    }

    if (client) {
      where.clientName = { equals: client, mode: 'insensitive' }
    }

    // Buscar apresentações
    const presentations = await db.presentation.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(presentations)

  } catch (error) {
    console.error('Erro ao buscar apresentações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar apresentações' },
      { status: 500 }
    )
  }
}

// POST - Criar apresentação
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { clientName, projectTitle, htmlCode, status } = body

    // Validação
    if (!clientName || !projectTitle) {
      return NextResponse.json(
        { error: 'Nome do cliente e título do projeto são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar apresentação
    const presentation = await db.presentation.create({
      data: {
        clientName: clientName.trim(),
        projectTitle: projectTitle.trim(),
        htmlCode: htmlCode || '',
        status: status || 'DRAFT',
        createdBy: session.user.id,
      }
    })

    return NextResponse.json(presentation, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar apresentação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar apresentação' },
      { status: 500 }
    )
  }
}

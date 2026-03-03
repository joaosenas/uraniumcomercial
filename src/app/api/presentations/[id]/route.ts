/**
 * API de Apresentação Individual - Uranium Company
 * GET: Buscar apresentação por ID
 * PUT: Atualizar apresentação
 * DELETE: Excluir apresentação
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Função auxiliar para verificar propriedade
async function checkOwnership(presentationId: string, userId: string) {
  const presentation = await db.presentation.findUnique({
    where: { id: presentationId }
  })
  return presentation?.createdBy === userId ? presentation : null
}

// GET - Buscar apresentação por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Buscar apresentação
    const presentation = await db.presentation.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!presentation) {
      return NextResponse.json(
        { error: 'Apresentação não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se é rota pública (p/view) ou autenticada
    const session = await getServerSession(authOptions)
    const isPublicRoute = request.headers.get('referer')?.includes('/p/view/')
    
    // Se não for rota pública, verificar autenticação
    if (!isPublicRoute && !session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    return NextResponse.json(presentation)

  } catch (error) {
    console.error('Erro ao buscar apresentação:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar apresentação' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar apresentação
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { clientName, projectTitle, htmlCode, status } = body

    // Verificar propriedade
    const existingPresentation = await checkOwnership(id, session.user.id)
    if (!existingPresentation) {
      return NextResponse.json(
        { error: 'Apresentação não encontrada ou sem permissão' },
        { status: 404 }
      )
    }

    // Atualizar apresentação
    const presentation = await db.presentation.update({
      where: { id },
      data: {
        clientName: clientName?.trim() ?? existingPresentation.clientName,
        projectTitle: projectTitle?.trim() ?? existingPresentation.projectTitle,
        htmlCode: htmlCode !== undefined ? htmlCode : existingPresentation.htmlCode,
        status: status || existingPresentation.status,
      }
    })

    return NextResponse.json(presentation)

  } catch (error) {
    console.error('Erro ao atualizar apresentação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar apresentação' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir apresentação
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verificar propriedade
    const existingPresentation = await checkOwnership(id, session.user.id)
    if (!existingPresentation) {
      return NextResponse.json(
        { error: 'Apresentação não encontrada ou sem permissão' },
        { status: 404 }
      )
    }

    // Excluir apresentação
    await db.presentation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao excluir apresentação:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir apresentação' },
      { status: 500 }
    )
  }
}

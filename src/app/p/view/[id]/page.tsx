/**
 * Visualização Pública de Apresentação - Uranium Company
 * Rota: /p/view/[id]
 * Acesso sem autenticação
 */

'use client'

import { Suspense, useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react'

// Componente principal
function PublicViewContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const [htmlCode, setHtmlCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Carregar apresentação
  useEffect(() => {
    const loadPresentation = async () => {
      try {
        const response = await fetch(`/api/presentations/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Apresentação não encontrada')
          } else {
            setError('Erro ao carregar apresentação')
          }
          return
        }

        const data = await response.json()
        
        // Verificar se está ativa
        if (data.status !== 'ACTIVE') {
          setError('Esta apresentação não está disponível publicamente')
          return
        }

        setHtmlCode(data.htmlCode || '')
      } catch (error) {
        console.error('Erro:', error)
        setError('Erro ao carregar apresentação')
      } finally {
        setLoading(false)
      }
    }

    loadPresentation()
  }, [id])

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 mb-4">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <p className="text-slate-400">Carregando apresentação...</p>
        </div>
      </div>
    )
  }

  // Erro
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Ops!</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  // Renderizar apresentação em tela cheia
  return (
    <iframe
      srcDoc={htmlCode}
      className="w-screen h-screen border-0"
      sandbox="allow-scripts allow-same-origin"
      title="Apresentação"
    />
  )
}

// Página com Suspense boundary
export default function PublicViewPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500">
          <Sparkles className="h-8 w-8 text-white animate-pulse" />
        </div>
      </div>
    }>
      <PublicViewContent params={params} />
    </Suspense>
  )
}

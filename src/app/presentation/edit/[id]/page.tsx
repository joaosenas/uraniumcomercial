/**
 * Página de Edição de Apresentação - Uranium Company
 */

'use client'

import { Suspense, useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Save,
  Eye,
  Code,
  Monitor,
  Sparkles,
  Loader2,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Componente principal
function EditPresentationContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { status } = useSession()
  const router = useRouter()
  
  const [clientName, setClientName] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [htmlCode, setHtmlCode] = useState('')
  const [statusValue, setStatusValue] = useState('DRAFT')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('code')

  // Carregar apresentação
  useEffect(() => {
    const loadPresentation = async () => {
      try {
        const response = await fetch(`/api/presentations/${id}`)
        if (response.ok) {
          const data = await response.json()
          setClientName(data.clientName)
          setProjectTitle(data.projectTitle)
          setHtmlCode(data.htmlCode || '')
          setStatusValue(data.status)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Erro:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      loadPresentation()
    }
  }, [id, status, router])

  // Salvar apresentação
  const handleSave = async (newStatus?: string) => {
    if (!clientName.trim() || !projectTitle.trim()) {
      alert('Preencha o nome do cliente e título do projeto')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/presentations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          projectTitle: projectTitle.trim(),
          htmlCode,
          status: newStatus || statusValue
        })
      })

      if (response.ok) {
        router.push('/')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao salvar apresentação')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar apresentação')
    } finally {
      setSaving(false)
    }
  }

  // Excluir apresentação
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/presentations/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Loading
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-white">Editar Apresentação</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Botão de excluir */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir apresentação?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. A apresentação será permanentemente removida.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                onClick={() => handleSave('DRAFT')}
                disabled={saving}
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar Rascunho
              </Button>
              <Button
                onClick={() => handleSave('ACTIVE')}
                disabled={saving}
                className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                Salvar e Ativar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campos de informações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-slate-300">Nome do Cliente *</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: Empresa ABC"
              required
              className="bg-slate-800/50 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectTitle" className="text-slate-300">Título do Projeto *</Label>
            <Input
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Ex: Proposta Comercial Q1"
              required
              className="bg-slate-800/50 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-slate-300">Status</Label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Rascunho</SelectItem>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Editor com Preview */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-slate-800/50 border-b border-slate-700/50 rounded-none p-0 h-12">
              <TabsTrigger 
                value="code" 
                className="flex-1 rounded-none h-12 data-[state=active]:bg-slate-700/50 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500"
              >
                <Code className="mr-2 h-4 w-4" />
                Código HTML
              </TabsTrigger>
              <TabsTrigger 
                value="preview"
                className="flex-1 rounded-none h-12 data-[state=active]:bg-slate-700/50 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500"
              >
                <Monitor className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="m-0">
              <Textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="Cole seu código HTML/CSS/JS aqui..."
                className="min-h-[600px] font-mono text-sm bg-slate-900/50 border-0 focus-visible:ring-0 resize-none rounded-none"
              />
            </TabsContent>

            <TabsContent value="preview" className="m-0">
              <div className="min-h-[600px] bg-white">
                <iframe
                  srcDoc={htmlCode}
                  className="w-full h-[600px] border-0"
                  sandbox="allow-scripts allow-same-origin"
                  title="Preview"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

// Página com Suspense boundary
export default function EditPresentationPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    }>
      <EditPresentationContent params={params} />
    </Suspense>
  )
}

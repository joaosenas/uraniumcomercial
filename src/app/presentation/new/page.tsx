/**
 * Página de Nova Apresentação - Uranium Company
 * Editor de código com preview ao vivo
 */

'use client'

import { Suspense, useState } from 'react'
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
  Loader2
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

// Componente principal
function NewPresentationContent() {
  const { status } = useSession()
  const router = useRouter()
  
  const [clientName, setClientName] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [htmlCode, setHtmlCode] = useState('')
  const [statusValue, setStatusValue] = useState('DRAFT')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('code')

  // Template HTML básico
  const defaultTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apresentação</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      text-align: center;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(to right, #22d3ee, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 1.25rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Sua Apresentação</h1>
    <p>Cole seu código HTML/CSS/JS aqui para criar uma apresentação incrível.</p>
  </div>
</body>
</html>`

  // Iniciar com template
  useState(() => {
    if (!htmlCode) {
      setHtmlCode(defaultTemplate)
    }
  })

  // Salvar apresentação
  const handleSave = async (newStatus?: string) => {
    if (!clientName.trim() || !projectTitle.trim()) {
      alert('Preencha o nome do cliente e título do projeto')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/presentations', {
        method: 'POST',
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
      setLoading(false)
    }
  }

  // Loading de autenticação
  if (status === 'loading') {
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
                <span className="font-semibold text-white">Nova Apresentação</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleSave('DRAFT')}
                disabled={loading}
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar Rascunho
              </Button>
              <Button
                onClick={() => handleSave('ACTIVE')}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
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
export default function NewPresentationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    }>
      <NewPresentationContent />
    </Suspense>
  )
}

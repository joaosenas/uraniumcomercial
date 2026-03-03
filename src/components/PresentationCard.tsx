/**
 * Card de Apresentação - Uranium Company
 * Exibe informações de uma apresentação com ações
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  MoreVertical,
  FileText,
  Calendar,
  User
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Presentation {
  id: string
  clientName: string
  projectTitle: string
  status: string
  createdAt: string
  updatedAt: string
}

interface PresentationCardProps {
  presentation: Presentation
  onDelete: (id: string) => void
}

export function PresentationCard({ presentation, onDelete }: PresentationCardProps) {
  const [copied, setCopied] = useState(false)

  // Copiar link público
  const copyPublicLink = () => {
    const url = `${window.location.origin}/p/view/${presentation.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Badge 
            variant={presentation.status === 'ACTIVE' ? 'default' : 'secondary'}
            className={`mb-2 ${presentation.status === 'ACTIVE' 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}
          >
            {presentation.status === 'ACTIVE' ? 'Ativo' : 'Rascunho'}
          </Badge>
          <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
            {presentation.projectTitle}
          </h3>
        </div>
        
        {/* Menu de ações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/p/view/${presentation.id}`} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/presentation/edit/${presentation.id}`} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyPublicLink} className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              {copied ? 'Copiado!' : 'Copiar Link'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(presentation.id)}
              className="cursor-pointer text-red-400 focus:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Informações */}
      <div className="space-y-2 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-violet-400" />
          <span className="truncate">{presentation.clientName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-cyan-400" />
          <span>{formatDate(presentation.updatedAt)}</span>
        </div>
      </div>

      {/* Ícone decorativo */}
      <div className="absolute bottom-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <FileText className="h-12 w-12 text-cyan-400" />
      </div>
    </div>
  )
}

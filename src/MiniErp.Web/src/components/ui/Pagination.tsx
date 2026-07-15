import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  pagina: number
  totalPaginas: number
  onChange: (pagina: number) => void
}

export function Pagination({ pagina, totalPaginas, onChange }: PaginationProps) {
  if (totalPaginas <= 1) return null

  return (
    <nav className="flex items-center justify-between border-t border-slate-200 px-2 py-3" aria-label="Paginação">
      <span className="text-sm text-slate-600">
        Página {pagina} de {totalPaginas}
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onChange(pagina - 1)}
          disabled={pagina <= 1}
          aria-label="Página anterior"
          className="inline-flex items-center rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onChange(pagina + 1)}
          disabled={pagina >= totalPaginas}
          aria-label="Próxima página"
          className="inline-flex items-center rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { clientesApi } from '../../api/clientesApi'
import { SearchInput } from '../ui/SearchInput'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import type { Cliente } from '../../types/cliente'

interface ClienteSelectorProps {
  clienteSelecionado: Cliente | null
  onSelecionar: (cliente: Cliente) => void
}

export function ClienteSelector({ clienteSelecionado, onSelecionar }: ClienteSelectorProps) {
  const [busca, setBusca] = useState('')
  const buscaDebounced = useDebouncedValue(busca)

  const { data, isLoading } = useQuery({
    queryKey: ['clientes', 'selector', buscaDebounced],
    queryFn: () => clientesApi.listar({ page: 1, pageSize: 8, busca: buscaDebounced || undefined }),
    enabled: buscaDebounced.length > 0,
  })

  if (clienteSelecionado) {
    return (
      <div className="flex items-center justify-between rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800">
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">{clienteSelecionado.nome}</p>
          <p className="text-slate-500 dark:text-slate-400">{clienteSelecionado.email}</p>
        </div>
        <button
          type="button"
          onClick={() => setBusca('')}
          className="text-sm font-medium text-slate-600 underline-offset-2 hover:underline dark:text-slate-300"
        >
          Trocar
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <SearchInput value={busca} onChange={setBusca} placeholder="Buscar cliente por nome..." />
      {busca ? (
        <div className="absolute z-10 mt-1 w-full max-w-sm rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Buscando...</p>
          ) : !data || data.itens.length === 0 ? (
            <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Nenhum cliente encontrado.</p>
          ) : (
            <ul className="max-h-56 overflow-y-auto">
              {data.itens.map((cliente) => (
                <li key={cliente.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelecionar(cliente)
                      setBusca('')
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-100">{cliente.nome}</p>
                    <p className="text-slate-500 dark:text-slate-400">{cliente.email}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}

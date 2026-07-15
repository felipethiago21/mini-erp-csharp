import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { produtosApi } from '../../api/produtosApi'
import { SearchInput } from '../ui/SearchInput'
import { CurrencyDisplay } from '../ui/CurrencyDisplay'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import type { Produto } from '../../types/produto'

interface ProdutoSelectorProps {
  onAdicionar: (produto: Produto) => void
}

export function ProdutoSelector({ onAdicionar }: ProdutoSelectorProps) {
  const [busca, setBusca] = useState('')
  const buscaDebounced = useDebouncedValue(busca)

  const { data, isLoading } = useQuery({
    queryKey: ['produtos', 'selector', buscaDebounced],
    queryFn: () => produtosApi.listar({ page: 1, pageSize: 8, busca: buscaDebounced || undefined }),
    enabled: buscaDebounced.length > 0,
  })

  return (
    <div className="relative">
      <SearchInput value={busca} onChange={setBusca} placeholder="Buscar produto para adicionar..." />
      {busca ? (
        <div className="absolute z-10 mt-1 w-full max-w-sm rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Buscando...</p>
          ) : !data || data.itens.length === 0 ? (
            <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Nenhum produto encontrado.</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {data.itens.map((produto) => (
                <li key={produto.id}>
                  <button
                    type="button"
                    disabled={produto.quantidadeEstoque <= 0}
                    onClick={() => onAdicionar(produto)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{produto.nome}</p>
                      <p className="text-slate-500 dark:text-slate-400">Estoque: {produto.quantidadeEstoque}</p>
                    </div>
                    <CurrencyDisplay value={produto.preco} className="font-medium text-slate-700 dark:text-slate-300" />
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

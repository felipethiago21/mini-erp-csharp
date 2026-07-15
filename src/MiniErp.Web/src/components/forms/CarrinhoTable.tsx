import { Trash2 } from 'lucide-react'
import { CurrencyDisplay } from '../ui/CurrencyDisplay'
import type { ItemCarrinho } from '../../hooks/useCarrinho'

interface CarrinhoTableProps {
  itens: ItemCarrinho[]
  onAtualizarQuantidade: (produtoId: number, quantidade: number) => void
  onRemover: (produtoId: number) => void
}

export function CarrinhoTable({ itens, onAtualizarQuantidade, onRemover }: CarrinhoTableProps) {
  if (itens.length === 0) {
    return <p className="rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">Nenhum item adicionado.</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
        <tr>
          <th scope="col" className="py-2">
            Produto
          </th>
          <th scope="col" className="py-2">
            Preço unit.
          </th>
          <th scope="col" className="py-2">
            Qtd.
          </th>
          <th scope="col" className="py-2">
            Subtotal
          </th>
          <th scope="col" className="py-2" />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {itens.map((item) => (
          <tr key={item.produtoId}>
            <td className="py-2 pr-2">
              <p className="font-medium text-slate-900">{item.produtoNome}</p>
              <p className="text-xs text-slate-500">Disponível: {item.estoqueDisponivel}</p>
            </td>
            <td className="py-2 pr-2">
              <CurrencyDisplay value={item.precoUnitario} />
            </td>
            <td className="py-2 pr-2">
              <label className="sr-only" htmlFor={`quantidade-${item.produtoId}`}>
                Quantidade de {item.produtoNome}
              </label>
              <input
                id={`quantidade-${item.produtoId}`}
                type="number"
                min={1}
                max={item.estoqueDisponivel}
                value={item.quantidade}
                onChange={(event) => onAtualizarQuantidade(item.produtoId, Number(event.target.value))}
                className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
            </td>
            <td className="py-2 pr-2 font-medium text-slate-900">
              <CurrencyDisplay value={item.precoUnitario * item.quantidade} />
            </td>
            <td className="py-2 text-right">
              <button
                type="button"
                onClick={() => onRemover(item.produtoId)}
                aria-label={`Remover ${item.produtoNome}`}
                className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

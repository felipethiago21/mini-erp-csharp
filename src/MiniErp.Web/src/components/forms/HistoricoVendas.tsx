import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { vendasApi } from '../../api/vendasApi'
import { Modal } from '../ui/Modal'
import { CurrencyDisplay } from '../ui/CurrencyDisplay'
import { LoadingSpinner } from '../feedback/LoadingSpinner'
import { ErrorState } from '../feedback/ErrorState'
import { EmptyState } from '../feedback/EmptyState'
import { formatarDataHora } from '../../utils/format'
import { extrairMensagemErro } from '../../utils/error'
import type { Venda } from '../../types/venda'

export function HistoricoVendas() {
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['vendas'],
    queryFn: vendasApi.listar,
  })

  if (isLoading) return <LoadingSpinner label="Carregando vendas..." />
  if (isError) return <ErrorState message={extrairMensagemErro(error)} onRetry={() => refetch()} />
  if (!data || data.length === 0) {
    return <EmptyState title="Nenhuma venda registrada" description={'Registre uma venda na aba "Nova venda".'} />
  }

  const vendasOrdenadas = [...data].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">
                ID
              </th>
              <th scope="col" className="px-4 py-3">
                Cliente
              </th>
              <th scope="col" className="px-4 py-3">
                Data
              </th>
              <th scope="col" className="px-4 py-3">
                Itens
              </th>
              <th scope="col" className="px-4 py-3">
                Total
              </th>
              <th scope="col" className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vendasOrdenadas.map((venda) => (
              <tr key={venda.id}>
                <td className="px-4 py-3 text-slate-500">#{venda.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{venda.clienteNome}</td>
                <td className="px-4 py-3">{formatarDataHora(venda.data)}</td>
                <td className="px-4 py-3">{venda.itens.length}</td>
                <td className="px-4 py-3 font-medium">
                  <CurrencyDisplay value={venda.total} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setVendaSelecionada(venda)}
                    className="text-sm font-medium text-slate-600 underline-offset-2 hover:underline"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vendaSelecionada ? (
        <Modal title={`Venda #${vendaSelecionada.id}`} isOpen onClose={() => setVendaSelecionada(null)}>
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium text-slate-900">Cliente:</span> {vendaSelecionada.clienteNome}
            </p>
            <p>
              <span className="font-medium text-slate-900">Data:</span> {formatarDataHora(vendaSelecionada.data)}
            </p>
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th scope="col" className="py-2">
                    Produto
                  </th>
                  <th scope="col" className="py-2">
                    Qtd.
                  </th>
                  <th scope="col" className="py-2">
                    Preço unit.
                  </th>
                  <th scope="col" className="py-2">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendaSelecionada.itens.map((item) => (
                  <tr key={item.produtoId}>
                    <td className="py-2">{item.produtoNome}</td>
                    <td className="py-2">{item.quantidade}</td>
                    <td className="py-2">
                      <CurrencyDisplay value={item.precoUnitario} />
                    </td>
                    <td className="py-2">
                      <CurrencyDisplay value={item.subtotal} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="flex justify-end gap-2 pt-2 text-base font-semibold text-slate-900">
              Total: <CurrencyDisplay value={vendaSelecionada.total} />
            </p>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

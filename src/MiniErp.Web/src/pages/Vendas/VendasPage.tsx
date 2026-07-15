import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { NovaVenda } from '../../components/forms/NovaVenda'
import { HistoricoVendas } from '../../components/forms/HistoricoVendas'

type Aba = 'historico' | 'nova'

export function VendasPage() {
  const [aba, setAba] = useState<Aba>('historico')

  return (
    <div>
      <PageHeader title="Vendas" description="Histórico de vendas e registro de novas vendas" />

      <div className="mb-5 flex gap-1 border-b border-slate-200" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={aba === 'historico'}
          onClick={() => setAba('historico')}
          className={`px-4 py-2 text-sm font-medium ${
            aba === 'historico' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Histórico
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={aba === 'nova'}
          onClick={() => setAba('nova')}
          className={`px-4 py-2 text-sm font-medium ${
            aba === 'nova' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Nova venda
        </button>
      </div>

      {aba === 'historico' ? <HistoricoVendas /> : <NovaVenda />}
    </div>
  )
}

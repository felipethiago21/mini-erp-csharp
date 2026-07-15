import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Package, Users, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react'
import { dashboardApi } from '../../api/dashboardApi'
import { PageHeader } from '../../components/ui/PageHeader'
import { ErrorState } from '../../components/feedback/ErrorState'
import { EmptyState } from '../../components/feedback/EmptyState'
import { Skeleton } from '../../components/feedback/Skeleton'
import { Badge } from '../../components/ui/Badge'
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay'
import { formatarDataHora } from '../../utils/format'
import { extrairMensagemErro } from '../../utils/error'

interface StatCardProps {
  label: string
  value: ReactNode
  icon: typeof Package
  tone?: 'default' | 'warning'
}

function StatCard({ label, value, icon: Icon, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <Icon className={`h-5 w-5 ${tone === 'warning' ? 'text-amber-500' : 'text-slate-400'}`} aria-hidden="true" />
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard', 'resumo'],
    queryFn: dashboardApi.obterResumo,
  })

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral do seu negócio" />

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <ErrorState message={extrairMensagemErro(error)} onRetry={() => refetch()} />
      ) : data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Produtos" value={data.totalProdutos.toString()} icon={Package} />
            <StatCard label="Clientes" value={data.totalClientes.toString()} icon={Users} />
            <StatCard label="Vendas" value={data.totalVendas.toString()} icon={ShoppingCart} />
            <StatCard label="Faturamento" value={<CurrencyDisplay value={data.faturamentoTotal} />} icon={DollarSign} />
            <StatCard
              label="Estoque baixo"
              value={data.quantidadeProdutosComEstoqueBaixo.toString()}
              icon={AlertTriangle}
              tone={data.quantidadeProdutosComEstoqueBaixo > 0 ? 'warning' : 'default'}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Produtos com menor estoque</h2>
              {data.produtosComMenorEstoque.length === 0 ? (
                <EmptyState title="Nenhum produto cadastrado" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.produtosComMenorEstoque} layout="vertical" margin={{ left: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="nome" type="category" width={110} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [value, 'Estoque']} />
                    <Bar dataKey="quantidadeEstoque" fill="#0f172a" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Vendas mais recentes</h2>
              {data.vendasMaisRecentes.length === 0 ? (
                <EmptyState title="Nenhuma venda registrada" />
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.vendasMaisRecentes.map((venda) => (
                    <li key={venda.id} className="flex items-center justify-between py-2.5 text-sm">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{venda.clienteNome}</p>
                        <p className="text-slate-500 dark:text-slate-400">{formatarDataHora(venda.data)}</p>
                      </div>
                      <div className="text-right">
                        <CurrencyDisplay value={venda.total} className="font-medium text-slate-900 dark:text-slate-100" />
                        <p className="text-slate-500">
                          <Badge>{venda.itens.length} item(ns)</Badge>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {isFetching ? <p className="text-xs text-slate-400 dark:text-slate-500">Atualizando...</p> : null}
        </div>
      ) : null}
    </div>
  )
}

import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboardApi'
import { ApiError } from '../../api/client'
import { DashboardPage } from './DashboardPage'
import type { DashboardResumo } from '../../types/dashboard'

vi.mock('../../api/dashboardApi', () => ({
  dashboardApi: { obterResumo: vi.fn() },
}))

const resumoMock: DashboardResumo = {
  totalProdutos: 12,
  totalClientes: 8,
  totalVendas: 20,
  faturamentoTotal: 1500.5,
  quantidadeProdutosComEstoqueBaixo: 2,
  produtosComMenorEstoque: [{ id: 1, nome: 'Produto A', preco: 10, quantidadeEstoque: 3 }],
  vendasMaisRecentes: [
    {
      id: 1,
      clienteId: 1,
      clienteNome: 'Cliente A',
      data: '2026-01-01T10:00:00Z',
      total: 100,
      itens: [{ produtoId: 1, produtoNome: 'Produto A', quantidade: 2, precoUnitario: 10, subtotal: 20 }],
    },
  ],
}

function renderComProviders() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.resetAllMocks()
})

describe('DashboardPage', () => {
  it('exibe os cards de resumo quando os dados carregam com sucesso', async () => {
    vi.mocked(dashboardApi.obterResumo).mockResolvedValueOnce(resumoMock)

    renderComProviders()

    expect(await screen.findByText('12')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('Cliente A')).toBeInTheDocument()
  })

  it('exibe estado de erro quando a API falha', async () => {
    vi.mocked(dashboardApi.obterResumo).mockRejectedValueOnce(new ApiError(500, 'Ocorreu um erro inesperado.', null))

    renderComProviders()

    expect(await screen.findByText('Ocorreu um erro inesperado.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })
})

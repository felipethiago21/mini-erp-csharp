import type { Produto } from './produto'
import type { Venda } from './venda'

export interface DashboardResumo {
  totalProdutos: number
  totalClientes: number
  totalVendas: number
  faturamentoTotal: number
  quantidadeProdutosComEstoqueBaixo: number
  produtosComMenorEstoque: Produto[]
  vendasMaisRecentes: Venda[]
}

import { apiClient } from './client'
import type { PaginacaoParams, PaginatedResponse } from '../types/common'
import type {
  AtualizarProdutoRequest,
  CriarProdutoRequest,
  MovimentarEstoqueRequest,
  Produto,
} from '../types/produto'

export const produtosApi = {
  listar: async (params: PaginacaoParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Produto>>('/produtos', { params })
    return data
  },

  obter: async (id: number) => {
    const { data } = await apiClient.get<Produto>(`/produtos/${id}`)
    return data
  },

  criar: async (request: CriarProdutoRequest) => {
    const { data } = await apiClient.post<Produto>('/produtos', request)
    return data
  },

  atualizar: async (id: number, request: AtualizarProdutoRequest) => {
    const { data } = await apiClient.put<Produto>(`/produtos/${id}`, request)
    return data
  },

  excluir: async (id: number) => {
    await apiClient.delete(`/produtos/${id}`)
  },

  entradaEstoque: async (id: number, request: MovimentarEstoqueRequest) => {
    const { data } = await apiClient.post<Produto>(`/produtos/${id}/entrada-estoque`, request)
    return data
  },

  saidaEstoque: async (id: number, request: MovimentarEstoqueRequest) => {
    const { data } = await apiClient.post<Produto>(`/produtos/${id}/saida-estoque`, request)
    return data
  },
}

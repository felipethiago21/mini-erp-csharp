import { apiClient } from './client'
import type { CriarVendaRequest, Venda } from '../types/venda'

export const vendasApi = {
  listar: async () => {
    const { data } = await apiClient.get<Venda[]>('/vendas')
    return data
  },

  obter: async (id: number) => {
    const { data } = await apiClient.get<Venda>(`/vendas/${id}`)
    return data
  },

  criar: async (request: CriarVendaRequest) => {
    const { data } = await apiClient.post<Venda>('/vendas', request)
    return data
  },
}

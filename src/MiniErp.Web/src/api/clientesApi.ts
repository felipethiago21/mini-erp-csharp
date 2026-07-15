import { apiClient } from './client'
import type { PaginacaoParams, PaginatedResponse } from '../types/common'
import type { AtualizarClienteRequest, Cliente, CriarClienteRequest } from '../types/cliente'

export const clientesApi = {
  listar: async (params: PaginacaoParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Cliente>>('/clientes', { params })
    return data
  },

  obter: async (id: number) => {
    const { data } = await apiClient.get<Cliente>(`/clientes/${id}`)
    return data
  },

  criar: async (request: CriarClienteRequest) => {
    const { data } = await apiClient.post<Cliente>('/clientes', request)
    return data
  },

  atualizar: async (id: number, request: AtualizarClienteRequest) => {
    const { data } = await apiClient.put<Cliente>(`/clientes/${id}`, request)
    return data
  },

  excluir: async (id: number) => {
    await apiClient.delete(`/clientes/${id}`)
  },
}

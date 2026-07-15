import axios, { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../types/common'

export class ApiError extends Error {
  status: number
  detalhes: string[] | null

  constructor(status: number, message: string, detalhes: string[] | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detalhes = detalhes
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data) {
      const { Status, Erro, Detalhes } = error.response.data
      return Promise.reject(
        new ApiError(Status ?? error.response.status, Erro ?? 'Ocorreu um erro inesperado.', Detalhes ?? null),
      )
    }

    if (error.request) {
      return Promise.reject(
        new ApiError(0, 'Não foi possível conectar à API. Verifique se o servidor está em execução.', null),
      )
    }

    return Promise.reject(new ApiError(0, error.message || 'Ocorreu um erro inesperado.', null))
  },
)

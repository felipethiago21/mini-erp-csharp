export interface PaginatedResponse<T> {
  itens: T[]
  pagina: number
  tamanhoPagina: number
  totalItens: number
  totalPaginas: number
}

export interface PaginacaoParams {
  page?: number
  pageSize?: number
  busca?: string
}

export interface ApiErrorResponse {
  Status: number
  Erro: string
  Detalhes: string[] | null
}

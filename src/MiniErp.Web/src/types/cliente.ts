export interface Cliente {
  id: number
  nome: string
  email: string
}

export interface CriarClienteRequest {
  nome: string
  email: string
}

export interface AtualizarClienteRequest {
  nome: string
  email: string
}

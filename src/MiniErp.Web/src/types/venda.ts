export interface ItemVenda {
  produtoId: number
  produtoNome: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export interface Venda {
  id: number
  clienteId: number
  clienteNome: string
  data: string
  total: number
  itens: ItemVenda[]
}

export interface CriarItemVendaRequest {
  produtoId: number
  quantidade: number
}

export interface CriarVendaRequest {
  clienteId: number
  itens: CriarItemVendaRequest[]
}

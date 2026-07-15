export interface Produto {
  id: number
  nome: string
  preco: number
  quantidadeEstoque: number
}

export interface CriarProdutoRequest {
  nome: string
  preco: number
  estoqueInicial: number
}

export interface AtualizarProdutoRequest {
  nome: string
  preco: number
}

export interface MovimentarEstoqueRequest {
  quantidade: number
}

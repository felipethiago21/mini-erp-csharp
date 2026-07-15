import { useState } from 'react'
import type { Produto } from '../types/produto'

export interface ItemCarrinho {
  produtoId: number
  produtoNome: string
  precoUnitario: number
  estoqueDisponivel: number
  quantidade: number
}

export function useCarrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([])

  function adicionarProduto(produto: Produto) {
    setItens((atual) => {
      const existente = atual.find((item) => item.produtoId === produto.id)
      if (existente) {
        const novaQuantidade = Math.min(existente.quantidade + 1, produto.quantidadeEstoque)
        return atual.map((item) => (item.produtoId === produto.id ? { ...item, quantidade: novaQuantidade } : item))
      }

      if (produto.quantidadeEstoque <= 0) return atual

      return [
        ...atual,
        {
          produtoId: produto.id,
          produtoNome: produto.nome,
          precoUnitario: produto.preco,
          estoqueDisponivel: produto.quantidadeEstoque,
          quantidade: 1,
        },
      ]
    })
  }

  function atualizarQuantidade(produtoId: number, quantidade: number) {
    setItens((atual) =>
      atual.map((item) =>
        item.produtoId === produtoId
          ? { ...item, quantidade: Math.max(1, Math.min(quantidade, item.estoqueDisponivel)) }
          : item,
      ),
    )
  }

  function removerItem(produtoId: number) {
    setItens((atual) => atual.filter((item) => item.produtoId !== produtoId))
  }

  function limpar() {
    setItens([])
  }

  const total = itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0)

  return { itens, adicionarProduto, atualizarQuantidade, removerItem, limpar, total }
}

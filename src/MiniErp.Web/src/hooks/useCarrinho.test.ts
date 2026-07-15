import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCarrinho } from './useCarrinho'
import type { Produto } from '../types/produto'

const produto: Produto = { id: 1, nome: 'Produto A', preco: 10, quantidadeEstoque: 5 }

describe('useCarrinho', () => {
  it('adiciona um produto ao carrinho e calcula o total', () => {
    const { result } = renderHook(() => useCarrinho())

    act(() => result.current.adicionarProduto(produto))

    expect(result.current.itens).toHaveLength(1)
    expect(result.current.itens[0].quantidade).toBe(1)
    expect(result.current.total).toBe(10)
  })

  it('incrementa a quantidade sem exceder o estoque disponível', () => {
    const { result } = renderHook(() => useCarrinho())

    act(() => result.current.adicionarProduto(produto))
    act(() => result.current.atualizarQuantidade(produto.id, 999))

    expect(result.current.itens[0].quantidade).toBe(5)
  })

  it('remove um item do carrinho', () => {
    const { result } = renderHook(() => useCarrinho())

    act(() => result.current.adicionarProduto(produto))
    act(() => result.current.removerItem(produto.id))

    expect(result.current.itens).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })
})

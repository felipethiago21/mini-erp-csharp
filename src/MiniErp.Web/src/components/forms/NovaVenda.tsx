import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { vendasApi } from '../../api/vendasApi'
import { Button } from '../ui/Button'
import { CurrencyDisplay } from '../ui/CurrencyDisplay'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { ClienteSelector } from './ClienteSelector'
import { ProdutoSelector } from './ProdutoSelector'
import { CarrinhoTable } from './CarrinhoTable'
import { useCarrinho } from '../../hooks/useCarrinho'
import { useToast } from '../../hooks/useToast'
import { extrairMensagemErro } from '../../utils/error'
import { formatarMoeda } from '../../utils/format'
import type { Cliente } from '../../types/cliente'

export function NovaVenda() {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const carrinho = useCarrinho()
  const queryClient = useQueryClient()
  const { exibirSucesso, exibirErro } = useToast()

  const criarVendaMutation = useMutation({
    mutationFn: vendasApi.criar,
    onSuccess: async () => {
      setConfirmando(false)
      setCliente(null)
      carrinho.limpar()
      exibirSucesso('Venda registrada com sucesso.')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['vendas'] }),
        queryClient.invalidateQueries({ queryKey: ['produtos'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
    onError: (erro) => {
      setConfirmando(false)
      exibirErro(extrairMensagemErro(erro))
    },
  })

  const podeFinalizar = Boolean(cliente) && carrinho.itens.length > 0

  function finalizarVenda() {
    if (!cliente) return
    criarVendaMutation.mutate({
      clienteId: cliente.id,
      itens: carrinho.itens.map((item) => ({ produtoId: item.produtoId, quantidade: item.quantidade })),
    })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">1. Cliente</h2>
        <ClienteSelector clienteSelecionado={cliente} onSelecionar={setCliente} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">2. Itens</h2>
        <ProdutoSelector onAdicionar={carrinho.adicionarProduto} />
        <div className="mt-4 overflow-x-auto">
          <CarrinhoTable
            itens={carrinho.itens}
            onAtualizarQuantidade={carrinho.atualizarQuantidade}
            onRemover={carrinho.removerItem}
          />
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total geral</p>
          <CurrencyDisplay value={carrinho.total} className="text-2xl font-semibold text-slate-900 dark:text-slate-100" />
        </div>
        <Button disabled={!podeFinalizar} onClick={() => setConfirmando(true)}>
          Finalizar venda
        </Button>
      </div>

      <ConfirmDialog
        isOpen={confirmando}
        title="Finalizar venda"
        message={`Confirma o registro da venda para ${cliente?.nome ?? ''} no valor total de ${formatarMoeda(carrinho.total)}?`}
        confirmLabel="Registrar venda"
        isLoading={criarVendaMutation.isPending}
        onConfirm={finalizarVenda}
        onCancel={() => setConfirmando(false)}
      />
    </div>
  )
}

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import { produtosApi } from '../../api/produtosApi'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { SearchInput } from '../../components/ui/SearchInput'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Badge } from '../../components/ui/Badge'
import { CurrencyDisplay } from '../../components/ui/CurrencyDisplay'
import { Pagination } from '../../components/ui/Pagination'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { ErrorState } from '../../components/feedback/ErrorState'
import { EmptyState } from '../../components/feedback/EmptyState'
import { CriarProdutoForm, EditarProdutoForm } from '../../components/forms/ProdutoForm'
import { MovimentarEstoqueForm } from '../../components/forms/MovimentarEstoqueForm'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { extrairMensagemErro } from '../../utils/error'
import type { Produto } from '../../types/produto'

const ESTOQUE_BAIXO_LIMITE = 10
const TAMANHO_PAGINA = 10

type ModalAberto =
  | { tipo: 'criar' }
  | { tipo: 'editar'; produto: Produto }
  | { tipo: 'excluir'; produto: Produto }
  | { tipo: 'entrada'; produto: Produto }
  | { tipo: 'saida'; produto: Produto }
  | null

export function ProdutosPage() {
  const [pagina, setPagina] = useState(1)
  const [busca, setBusca] = useState('')
  const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; mensagem: string } | null>(null)
  const [modal, setModal] = useState<ModalAberto>(null)
  const buscaDebounced = useDebouncedValue(busca)
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['produtos', pagina, buscaDebounced],
    queryFn: () => produtosApi.listar({ page: pagina, pageSize: TAMANHO_PAGINA, busca: buscaDebounced || undefined }),
    placeholderData: (previous) => previous,
  })

  function invalidarProdutos() {
    return queryClient.invalidateQueries({ queryKey: ['produtos'] })
  }

  function exibirSucesso(mensagem: string) {
    setFeedback({ tipo: 'sucesso', mensagem })
    setModal(null)
    setTimeout(() => setFeedback(null), 4000)
  }

  function exibirErro(erro: unknown) {
    setFeedback({ tipo: 'erro', mensagem: extrairMensagemErro(erro) })
  }

  const criarMutation = useMutation({
    mutationFn: produtosApi.criar,
    onSuccess: async () => {
      await invalidarProdutos()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      exibirSucesso('Produto cadastrado com sucesso.')
    },
    onError: exibirErro,
  })

  const atualizarMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: Parameters<typeof produtosApi.atualizar>[1] }) =>
      produtosApi.atualizar(id, request),
    onSuccess: async () => {
      await invalidarProdutos()
      exibirSucesso('Produto atualizado com sucesso.')
    },
    onError: exibirErro,
  })

  const excluirMutation = useMutation({
    mutationFn: produtosApi.excluir,
    onSuccess: async () => {
      await invalidarProdutos()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      exibirSucesso('Produto excluído com sucesso.')
    },
    onError: exibirErro,
  })

  const entradaMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: Parameters<typeof produtosApi.entradaEstoque>[1] }) =>
      produtosApi.entradaEstoque(id, request),
    onSuccess: async () => {
      await invalidarProdutos()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      exibirSucesso('Entrada de estoque registrada.')
    },
    onError: exibirErro,
  })

  const saidaMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: Parameters<typeof produtosApi.saidaEstoque>[1] }) =>
      produtosApi.saidaEstoque(id, request),
    onSuccess: async () => {
      await invalidarProdutos()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      exibirSucesso('Saída de estoque registrada.')
    },
    onError: exibirErro,
  })

  return (
    <div>
      <PageHeader
        title="Produtos"
        description="Gerencie seu catálogo e estoque"
        action={
          <Button onClick={() => setModal({ tipo: 'criar' })}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo produto
          </Button>
        }
      />

      {feedback ? (
        <div
          role="status"
          className={`mb-4 rounded-md px-4 py-2.5 text-sm ${
            feedback.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {feedback.mensagem}
        </div>
      ) : null}

      <div className="mb-4">
        <SearchInput
          value={busca}
          onChange={(valor) => {
            setBusca(valor)
            setPagina(1)
          }}
          placeholder="Buscar produtos..."
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <LoadingSpinner label="Carregando produtos..." />
        ) : isError ? (
          <div className="p-6">
            <ErrorState message={extrairMensagemErro(error)} onRetry={() => refetch()} />
          </div>
        ) : !data || data.itens.length === 0 ? (
          <div className="p-6">
            <EmptyState title="Nenhum produto encontrado" description="Cadastre um novo produto para começar." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Nome
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Preço
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Estoque
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.itens.map((produto) => (
                    <tr key={produto.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{produto.nome}</td>
                      <td className="px-4 py-3">
                        <CurrencyDisplay value={produto.preco} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{produto.quantidadeEstoque}</span>
                          {produto.quantidadeEstoque <= ESTOQUE_BAIXO_LIMITE ? (
                            <Badge tone="warning">Estoque baixo</Badge>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'entrada', produto })}
                            aria-label={`Entrada de estoque de ${produto.nome}`}
                            title="Entrada de estoque"
                            className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50"
                          >
                            <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'saida', produto })}
                            aria-label={`Saída de estoque de ${produto.nome}`}
                            title="Saída de estoque"
                            className="rounded-md p-1.5 text-amber-600 hover:bg-amber-50"
                          >
                            <ArrowUpFromLine className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'editar', produto })}
                            aria-label={`Editar ${produto.nome}`}
                            title="Editar"
                            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'excluir', produto })}
                            aria-label={`Excluir ${produto.nome}`}
                            title="Excluir"
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagina={data.pagina} totalPaginas={data.totalPaginas} onChange={setPagina} />
          </>
        )}
      </div>

      <Modal title="Novo produto" isOpen={modal?.tipo === 'criar'} onClose={() => setModal(null)}>
        <CriarProdutoForm
          isSubmitting={criarMutation.isPending}
          onSubmit={(values) => criarMutation.mutate(values)}
          onCancel={() => setModal(null)}
        />
      </Modal>

      {modal?.tipo === 'editar' ? (
        <Modal title="Editar produto" isOpen onClose={() => setModal(null)}>
          <EditarProdutoForm
            produto={modal.produto}
            isSubmitting={atualizarMutation.isPending}
            onSubmit={(values) => atualizarMutation.mutate({ id: modal.produto.id, request: values })}
            onCancel={() => setModal(null)}
          />
        </Modal>
      ) : null}

      {modal?.tipo === 'entrada' ? (
        <Modal title={`Entrada de estoque — ${modal.produto.nome}`} isOpen onClose={() => setModal(null)}>
          <MovimentarEstoqueForm
            estoqueAtual={modal.produto.quantidadeEstoque}
            isSubmitting={entradaMutation.isPending}
            onSubmit={(values) => entradaMutation.mutate({ id: modal.produto.id, request: values })}
            onCancel={() => setModal(null)}
          />
        </Modal>
      ) : null}

      {modal?.tipo === 'saida' ? (
        <Modal title={`Saída de estoque — ${modal.produto.nome}`} isOpen onClose={() => setModal(null)}>
          <MovimentarEstoqueForm
            estoqueAtual={modal.produto.quantidadeEstoque}
            isSubmitting={saidaMutation.isPending}
            onSubmit={(values) => saidaMutation.mutate({ id: modal.produto.id, request: values })}
            onCancel={() => setModal(null)}
          />
        </Modal>
      ) : null}

      {modal?.tipo === 'excluir' ? (
        <ConfirmDialog
          isOpen
          title="Excluir produto"
          message={`Tem certeza de que deseja excluir "${modal.produto.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          isLoading={excluirMutation.isPending}
          onConfirm={() => excluirMutation.mutate(modal.produto.id)}
          onCancel={() => setModal(null)}
        />
      ) : null}
    </div>
  )
}

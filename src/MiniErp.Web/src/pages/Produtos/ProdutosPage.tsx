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
import { useToast } from '../../hooks/useToast'
import { extrairMensagemErro } from '../../utils/error'
import type { Produto } from '../../types/produto'

const TAMANHO_PAGINA = 10

type ModalAberto =
  | { tipo: 'criar' }
  | { tipo: 'editar'; produto: Produto }
  | { tipo: 'excluir'; produto: Produto }
  | { tipo: 'entrada'; produto: Produto }
  | { tipo: 'saida'; produto: Produto }
  | null

function badgeEstoque(quantidade: number) {
  if (quantidade === 0) return <Badge tone="danger">Sem estoque</Badge>
  if (quantidade <= 5) return <Badge tone="warning">Estoque baixo</Badge>
  return <Badge tone="success">Em estoque</Badge>
}

export function ProdutosPage() {
  const [pagina, setPagina] = useState(1)
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState<ModalAberto>(null)
  const buscaDebounced = useDebouncedValue(busca)
  const queryClient = useQueryClient()
  const { exibirSucesso, exibirErro } = useToast()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['produtos', pagina, buscaDebounced],
    queryFn: () => produtosApi.listar({ page: pagina, pageSize: TAMANHO_PAGINA, busca: buscaDebounced || undefined }),
    placeholderData: (previous) => previous,
  })

  function invalidarProdutos() {
    return queryClient.invalidateQueries({ queryKey: ['produtos'] })
  }

  function tratarErro(erro: unknown) {
    exibirErro(extrairMensagemErro(erro))
  }

  const criarMutation = useMutation({
    mutationFn: produtosApi.criar,
    onSuccess: async () => {
      await invalidarProdutos()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setModal(null)
      exibirSucesso('Produto cadastrado com sucesso.')
    },
    onError: tratarErro,
  })

  const atualizarMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: Parameters<typeof produtosApi.atualizar>[1] }) =>
      produtosApi.atualizar(id, request),
    onSuccess: async () => {
      await invalidarProdutos()
      setModal(null)
      exibirSucesso('Produto atualizado com sucesso.')
    },
    onError: tratarErro,
  })

  const excluirMutation = useMutation({
    mutationFn: produtosApi.excluir,
    onSuccess: async () => {
      await invalidarProdutos()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setModal(null)
      exibirSucesso('Produto excluído com sucesso.')
    },
    onError: tratarErro,
  })

  const entradaMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: Parameters<typeof produtosApi.entradaEstoque>[1] }) =>
      produtosApi.entradaEstoque(id, request),
    onSuccess: async () => {
      await invalidarProdutos()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setModal(null)
      exibirSucesso('Entrada de estoque registrada.')
    },
    onError: tratarErro,
  })

  const saidaMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: Parameters<typeof produtosApi.saidaEstoque>[1] }) =>
      produtosApi.saidaEstoque(id, request),
    onSuccess: async () => {
      await invalidarProdutos()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setModal(null)
      exibirSucesso('Saída de estoque registrada.')
    },
    onError: tratarErro,
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

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
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
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.itens.map((produto) => (
                    <tr key={produto.id}>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{produto.nome}</td>
                      <td className="px-4 py-3 dark:text-slate-300">
                        <CurrencyDisplay value={produto.preco} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 dark:text-slate-300">
                          <span>{produto.quantidadeEstoque}</span>
                          {badgeEstoque(produto.quantidadeEstoque)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'entrada', produto })}
                            aria-label={`Entrada de estoque de ${produto.nome}`}
                            title="Entrada de estoque"
                            className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                          >
                            <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'saida', produto })}
                            aria-label={`Saída de estoque de ${produto.nome}`}
                            title="Saída de estoque"
                            className="rounded-md p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                          >
                            <ArrowUpFromLine className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'editar', produto })}
                            aria-label={`Editar ${produto.nome}`}
                            title="Editar"
                            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'excluir', produto })}
                            aria-label={`Excluir ${produto.nome}`}
                            title="Excluir"
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
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

      <Modal
        title="Novo produto"
        isOpen={modal?.tipo === 'criar'}
        onClose={() => setModal(null)}
        preventClose={criarMutation.isPending}
      >
        <CriarProdutoForm
          isSubmitting={criarMutation.isPending}
          onSubmit={(values) => criarMutation.mutate(values)}
          onCancel={() => setModal(null)}
        />
      </Modal>

      {modal?.tipo === 'editar' ? (
        <Modal title="Editar produto" isOpen onClose={() => setModal(null)} preventClose={atualizarMutation.isPending}>
          <EditarProdutoForm
            produto={modal.produto}
            isSubmitting={atualizarMutation.isPending}
            onSubmit={(values) => atualizarMutation.mutate({ id: modal.produto.id, request: values })}
            onCancel={() => setModal(null)}
          />
        </Modal>
      ) : null}

      {modal?.tipo === 'entrada' ? (
        <Modal
          title={`Entrada de estoque: ${modal.produto.nome}`}
          isOpen
          onClose={() => setModal(null)}
          preventClose={entradaMutation.isPending}
        >
          <MovimentarEstoqueForm
            estoqueAtual={modal.produto.quantidadeEstoque}
            isSubmitting={entradaMutation.isPending}
            onSubmit={(values) => entradaMutation.mutate({ id: modal.produto.id, request: values })}
            onCancel={() => setModal(null)}
          />
        </Modal>
      ) : null}

      {modal?.tipo === 'saida' ? (
        <Modal
          title={`Saída de estoque: ${modal.produto.nome}`}
          isOpen
          onClose={() => setModal(null)}
          preventClose={saidaMutation.isPending}
        >
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

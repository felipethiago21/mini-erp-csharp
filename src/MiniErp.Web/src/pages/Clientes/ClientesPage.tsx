import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { clientesApi } from '../../api/clientesApi'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { SearchInput } from '../../components/ui/SearchInput'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Pagination } from '../../components/ui/Pagination'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { ErrorState } from '../../components/feedback/ErrorState'
import { EmptyState } from '../../components/feedback/EmptyState'
import { ClienteForm } from '../../components/forms/ClienteForm'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useToast } from '../../hooks/useToast'
import { extrairMensagemErro } from '../../utils/error'
import type { Cliente } from '../../types/cliente'

const TAMANHO_PAGINA = 10

type ModalAberto = { tipo: 'criar' } | { tipo: 'editar'; cliente: Cliente } | { tipo: 'excluir'; cliente: Cliente } | null

export function ClientesPage() {
  const [pagina, setPagina] = useState(1)
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState<ModalAberto>(null)
  const buscaDebounced = useDebouncedValue(busca)
  const queryClient = useQueryClient()
  const { exibirSucesso, exibirErro } = useToast()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['clientes', pagina, buscaDebounced],
    queryFn: () => clientesApi.listar({ page: pagina, pageSize: TAMANHO_PAGINA, busca: buscaDebounced || undefined }),
    placeholderData: (previous) => previous,
  })

  function invalidarClientes() {
    return queryClient.invalidateQueries({ queryKey: ['clientes'] })
  }

  function tratarErro(erro: unknown) {
    exibirErro(extrairMensagemErro(erro))
  }

  const criarMutation = useMutation({
    mutationFn: clientesApi.criar,
    onSuccess: async () => {
      await invalidarClientes()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setModal(null)
      exibirSucesso('Cliente cadastrado com sucesso.')
    },
    onError: tratarErro,
  })

  const atualizarMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: Parameters<typeof clientesApi.atualizar>[1] }) =>
      clientesApi.atualizar(id, request),
    onSuccess: async () => {
      await invalidarClientes()
      setModal(null)
      exibirSucesso('Cliente atualizado com sucesso.')
    },
    onError: tratarErro,
  })

  const excluirMutation = useMutation({
    mutationFn: clientesApi.excluir,
    onSuccess: async () => {
      await invalidarClientes()
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setModal(null)
      exibirSucesso('Cliente excluído com sucesso.')
    },
    onError: tratarErro,
  })

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gerencie sua base de clientes"
        action={
          <Button onClick={() => setModal({ tipo: 'criar' })}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo cliente
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
          placeholder="Buscar clientes..."
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <LoadingSpinner label="Carregando clientes..." />
        ) : isError ? (
          <div className="p-6">
            <ErrorState message={extrairMensagemErro(error)} onRetry={() => refetch()} />
          </div>
        ) : !data || data.itens.length === 0 ? (
          <div className="p-6">
            <EmptyState title="Nenhum cliente encontrado" description="Cadastre um novo cliente para começar." />
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
                      E-mail
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.itens.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{cliente.nome}</td>
                      <td className="px-4 py-3 dark:text-slate-300">{cliente.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'editar', cliente })}
                            aria-label={`Editar ${cliente.nome}`}
                            title="Editar"
                            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setModal({ tipo: 'excluir', cliente })}
                            aria-label={`Excluir ${cliente.nome}`}
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
        title="Novo cliente"
        isOpen={modal?.tipo === 'criar'}
        onClose={() => setModal(null)}
        preventClose={criarMutation.isPending}
      >
        <ClienteForm
          isSubmitting={criarMutation.isPending}
          onSubmit={(values) => criarMutation.mutate(values)}
          onCancel={() => setModal(null)}
        />
      </Modal>

      {modal?.tipo === 'editar' ? (
        <Modal title="Editar cliente" isOpen onClose={() => setModal(null)} preventClose={atualizarMutation.isPending}>
          <ClienteForm
            cliente={modal.cliente}
            isSubmitting={atualizarMutation.isPending}
            onSubmit={(values) => atualizarMutation.mutate({ id: modal.cliente.id, request: values })}
            onCancel={() => setModal(null)}
          />
        </Modal>
      ) : null}

      {modal?.tipo === 'excluir' ? (
        <ConfirmDialog
          isOpen
          title="Excluir cliente"
          message={`Tem certeza de que deseja excluir "${modal.cliente.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          isLoading={excluirMutation.isPending}
          onConfirm={() => excluirMutation.mutate(modal.cliente.id)}
          onCancel={() => setModal(null)}
        />
      ) : null}
    </div>
  )
}

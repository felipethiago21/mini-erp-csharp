import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import {
  atualizarProdutoSchema,
  criarProdutoSchema,
  type AtualizarProdutoFormValues,
  type CriarProdutoFormValues,
} from '../../schemas/produtoSchema'
import type { Produto } from '../../types/produto'

interface FormActionsProps {
  isSubmitting: boolean
  onCancel: () => void
}

function FormActions({ isSubmitting, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
        Cancelar
      </Button>
      <Button type="submit" isLoading={isSubmitting}>
        Salvar
      </Button>
    </div>
  )
}

interface CriarProdutoFormProps {
  isSubmitting: boolean
  onSubmit: (values: CriarProdutoFormValues) => void
  onCancel: () => void
}

export function CriarProdutoForm({ isSubmitting, onSubmit, onCancel }: CriarProdutoFormProps) {
  const form = useForm<CriarProdutoFormValues>({
    resolver: zodResolver(criarProdutoSchema),
    defaultValues: { nome: '' },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome" autoFocus {...form.register('nome')} error={form.formState.errors.nome?.message} />
      <Input
        label="Preço"
        type="number"
        step="0.01"
        {...form.register('preco', { valueAsNumber: true })}
        error={form.formState.errors.preco?.message}
      />
      <Input
        label="Estoque inicial"
        type="number"
        {...form.register('estoqueInicial', { valueAsNumber: true })}
        error={form.formState.errors.estoqueInicial?.message}
      />
      <FormActions isSubmitting={isSubmitting} onCancel={onCancel} />
    </form>
  )
}

interface EditarProdutoFormProps {
  produto: Produto
  isSubmitting: boolean
  onSubmit: (values: AtualizarProdutoFormValues) => void
  onCancel: () => void
}

export function EditarProdutoForm({ produto, isSubmitting, onSubmit, onCancel }: EditarProdutoFormProps) {
  const form = useForm<AtualizarProdutoFormValues>({
    resolver: zodResolver(atualizarProdutoSchema),
    defaultValues: { nome: produto.nome, preco: produto.preco },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome" autoFocus {...form.register('nome')} error={form.formState.errors.nome?.message} />
      <Input
        label="Preço"
        type="number"
        step="0.01"
        {...form.register('preco', { valueAsNumber: true })}
        error={form.formState.errors.preco?.message}
      />
      <FormActions isSubmitting={isSubmitting} onCancel={onCancel} />
    </form>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { movimentarEstoqueSchema, type MovimentarEstoqueFormValues } from '../../schemas/produtoSchema'

interface MovimentarEstoqueFormProps {
  estoqueAtual: number
  isSubmitting: boolean
  onSubmit: (values: MovimentarEstoqueFormValues) => void
  onCancel: () => void
}

export function MovimentarEstoqueForm({ estoqueAtual, isSubmitting, onSubmit, onCancel }: MovimentarEstoqueFormProps) {
  const form = useForm<MovimentarEstoqueFormValues>({
    resolver: zodResolver(movimentarEstoqueSchema),
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">Estoque atual: {estoqueAtual}</p>
      <Input
        label="Quantidade"
        type="number"
        autoFocus
        {...form.register('quantidade', { valueAsNumber: true })}
        error={form.formState.errors.quantidade?.message}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Confirmar
        </Button>
      </div>
    </form>
  )
}

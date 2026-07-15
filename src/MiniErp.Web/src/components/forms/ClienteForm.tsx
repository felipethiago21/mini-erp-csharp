import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { clienteSchema, type ClienteFormValues } from '../../schemas/clienteSchema'
import type { Cliente } from '../../types/cliente'

interface ClienteFormProps {
  cliente?: Cliente
  isSubmitting: boolean
  onSubmit: (values: ClienteFormValues) => void
  onCancel: () => void
}

export function ClienteForm({ cliente, isSubmitting, onSubmit, onCancel }: ClienteFormProps) {
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { nome: cliente?.nome ?? '', email: cliente?.email ?? '' },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome" {...form.register('nome')} error={form.formState.errors.nome?.message} />
      <Input label="E-mail" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}

import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório.'),
  email: z.string().trim().min(1, 'E-mail é obrigatório.').email('Informe um e-mail válido.'),
})

export type ClienteFormValues = z.infer<typeof clienteSchema>

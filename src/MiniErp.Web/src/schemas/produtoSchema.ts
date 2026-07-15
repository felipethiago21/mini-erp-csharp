import { z } from 'zod'

export const criarProdutoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório.'),
  preco: z.number({ message: 'Preço é obrigatório.' }).positive('Preço deve ser maior que zero.'),
  estoqueInicial: z
    .number({ message: 'Estoque inicial é obrigatório.' })
    .int('Estoque deve ser um número inteiro.')
    .min(0, 'Estoque não pode ser negativo.'),
})

export const atualizarProdutoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório.'),
  preco: z.number({ message: 'Preço é obrigatório.' }).positive('Preço deve ser maior que zero.'),
})

export const movimentarEstoqueSchema = z.object({
  quantidade: z
    .number({ message: 'Quantidade é obrigatória.' })
    .int('Quantidade deve ser um número inteiro.')
    .positive('Quantidade deve ser maior que zero.'),
})

export type CriarProdutoFormValues = z.infer<typeof criarProdutoSchema>
export type AtualizarProdutoFormValues = z.infer<typeof atualizarProdutoSchema>
export type MovimentarEstoqueFormValues = z.infer<typeof movimentarEstoqueSchema>

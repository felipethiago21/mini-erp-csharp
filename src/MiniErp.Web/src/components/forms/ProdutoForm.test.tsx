import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CriarProdutoForm } from './ProdutoForm'

describe('CriarProdutoForm', () => {
  it('exibe erros de validação ao submeter valores inválidos', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<CriarProdutoForm isSubmitting={false} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Preço'), '-5')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('Nome é obrigatório.')).toBeInTheDocument()
    expect(await screen.findByText('Preço deve ser maior que zero.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('chama onSubmit com os valores informados quando válidos', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<CriarProdutoForm isSubmitting={false} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Nome'), 'Produto Teste')
    await user.type(screen.getByLabelText('Preço'), '19.9')
    await user.type(screen.getByLabelText('Estoque inicial'), '5')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('button', { name: 'Salvar' })).toBeEnabled()
    expect(onSubmit.mock.calls[0][0]).toEqual({ nome: 'Produto Teste', preco: 19.9, estoqueInicial: 5 })
  })
})

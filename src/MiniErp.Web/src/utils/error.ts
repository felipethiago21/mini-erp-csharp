import { ApiError } from '../api/client'

export function extrairMensagemErro(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.detalhes && error.detalhes.length > 0) {
      return `${error.message} ${error.detalhes.join(' ')}`
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocorreu um erro inesperado.'
}

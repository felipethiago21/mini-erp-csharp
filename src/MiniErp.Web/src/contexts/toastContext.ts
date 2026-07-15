import { createContext } from 'react'

export interface ToastContextValue {
  exibirSucesso: (mensagem: string) => void
  exibirErro: (mensagem: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { ToastContext, type ToastContextValue } from '../../contexts/toastContext'

type ToastTipo = 'sucesso' | 'erro'

interface Toast {
  id: number
  tipo: ToastTipo
  mensagem: string
}

let proximoId = 1
const DURACAO_MS = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remover = useCallback((id: number) => {
    setToasts((atual) => atual.filter((toast) => toast.id !== id))
  }, [])

  const adicionar = useCallback(
    (tipo: ToastTipo, mensagem: string) => {
      const id = proximoId++
      setToasts((atual) => [...atual, { id, tipo, mensagem }])
      setTimeout(() => remover(id), DURACAO_MS)
    },
    [remover],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      exibirSucesso: (mensagem: string) => adicionar('sucesso', mensagem),
      exibirErro: (mensagem: string) => adicionar('erro', mensagem),
    }),
    [adicionar],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${
              toast.tipo === 'sucesso'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
            }`}
          >
            {toast.tipo === 'sucesso' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <p className="flex-1">{toast.mensagem}</p>
            <button
              type="button"
              onClick={() => remover(toast.id)}
              aria-label="Fechar notificação"
              className="rounded p-0.5 opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

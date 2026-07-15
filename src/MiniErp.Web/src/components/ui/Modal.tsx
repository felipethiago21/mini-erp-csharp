import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  preventClose?: boolean
  children: ReactNode
}

export function Modal({ title, isOpen, onClose, preventClose = false, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !preventClose) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    const primeiroCampo = dialogRef.current?.querySelector<HTMLElement>('input, textarea, select')
    ;(primeiroCampo ?? dialogRef.current)?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, preventClose])

  if (!isOpen) return null

  function handleOverlayClick() {
    if (!preventClose) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
        onClick={handleOverlayClick}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl focus:outline-none dark:bg-slate-800"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 id="modal-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={preventClose}
            aria-label="Fechar"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}

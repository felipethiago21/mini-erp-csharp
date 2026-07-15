import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-svh bg-slate-50 dark:bg-slate-950">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
        <Sidebar />
      </aside>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-64 bg-white shadow-xl dark:bg-slate-900">
            <div className="flex justify-end px-3 pt-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fechar menu"
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
          <button
            type="button"
            aria-label="Fechar menu"
            className="flex-1 bg-slate-900/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

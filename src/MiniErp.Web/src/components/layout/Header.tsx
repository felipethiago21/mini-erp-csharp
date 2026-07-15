import { Menu, Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { navigationItems } from '../../routes/navigation'
import { useTheme } from '../../hooks/useTheme'

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const location = useLocation()
  const { tema, alternarTema } = useTheme()
  const current = navigationItems.find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to),
  )

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 lg:px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{current?.label ?? 'Mini ERP'}</h1>
      </div>
      <button
        type="button"
        onClick={alternarTema}
        aria-label={tema === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        title={tema === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        {tema === 'dark' ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
      </button>
    </header>
  )
}

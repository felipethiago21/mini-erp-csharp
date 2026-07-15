import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { navigationItems } from '../../routes/navigation'

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const location = useLocation()
  const current = navigationItems.find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to),
  )

  return (
    <header className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir menu"
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <h1 className="text-sm font-semibold text-slate-900">{current?.label ?? 'Mini ERP'}</h1>
    </header>
  )
}

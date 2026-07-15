import { NavLink } from 'react-router-dom'
import { Boxes } from 'lucide-react'
import { navigationItems } from '../../routes/navigation'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <Boxes className="h-6 w-6 text-slate-900" aria-hidden="true" />
        <span className="text-base font-semibold text-slate-900">Mini ERP</span>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Navegação principal">
        {navigationItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 text-xs text-slate-400">Mini ERP &mdash; portfólio</div>
    </div>
  )
}

import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react'

export const navigationItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Produtos', to: '/produtos', icon: Package },
  { label: 'Clientes', to: '/clientes', icon: Users },
  { label: 'Vendas', to: '/vendas', icon: ShoppingCart },
]

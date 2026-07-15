import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { ProdutosPage } from './pages/Produtos/ProdutosPage'
import { ClientesPage } from './pages/Clientes/ClientesPage'
import { VendasPage } from './pages/Vendas/VendasPage'
import { NotFoundPage } from './pages/NotFound/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="vendas" element={<VendasPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App

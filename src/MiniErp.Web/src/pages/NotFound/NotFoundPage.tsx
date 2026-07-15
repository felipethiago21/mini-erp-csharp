import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-5xl font-semibold text-slate-900">404</p>
      <p className="text-sm text-slate-500">A página que você procura não existe.</p>
      <Link to="/">
        <Button>Voltar ao início</Button>
      </Link>
    </div>
  )
}

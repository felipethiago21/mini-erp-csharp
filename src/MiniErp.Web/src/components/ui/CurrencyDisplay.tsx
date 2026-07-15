import { formatarMoeda } from '../../utils/format'

export function CurrencyDisplay({ value, className = '' }: { value: number; className?: string }) {
  return <span className={className}>{formatarMoeda(value)}</span>
}

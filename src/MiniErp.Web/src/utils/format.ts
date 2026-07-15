const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
})

export function formatarMoeda(valor: number): string {
  return currencyFormatter.format(valor)
}

export function formatarDataHora(valor: string | Date): string {
  return dateTimeFormatter.format(new Date(valor))
}

export function formatarData(valor: string | Date): string {
  return dateFormatter.format(new Date(valor))
}

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Tema, type ThemeContextValue } from '../../contexts/themeContext'

const STORAGE_KEY = 'minierp-theme'

function obterTemaInicial(): Tema {
  if (typeof window === 'undefined') return 'light'

  const armazenado = window.localStorage.getItem(STORAGE_KEY)
  if (armazenado === 'light' || armazenado === 'dark') return armazenado

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(obterTemaInicial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'dark')
    window.localStorage.setItem(STORAGE_KEY, tema)
  }, [tema])

  const alternarTema = useCallback(() => {
    setTema((atual) => (atual === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({ tema, alternarTema }), [tema, alternarTema])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

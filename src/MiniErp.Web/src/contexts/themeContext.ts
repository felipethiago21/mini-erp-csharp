import { createContext } from 'react'

export type Tema = 'light' | 'dark'

export interface ThemeContextValue {
  tema: Tema
  alternarTema: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

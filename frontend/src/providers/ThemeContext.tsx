'use client'

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
	theme: Theme
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>('light')

	useEffect(() => {
		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const savedTheme = localStorage.getItem('theme') as Theme | null

		if (savedTheme === 'dark' || (!savedTheme && darkModeMediaQuery.matches)) {
			setTheme('dark')
			document.documentElement.classList.add('dark')
		}

		const handler = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem('theme')) {
				const newTheme: Theme = e.matches ? 'dark' : 'light'
				setTheme(newTheme)
				if (e.matches) document.documentElement.classList.add('dark')
				else document.documentElement.classList.remove('dark')
			}
		}

		darkModeMediaQuery.addEventListener('change', handler)
		return () => darkModeMediaQuery.removeEventListener('change', handler)
	}, [])

	const toggleTheme = () => {
		const newTheme: Theme = theme === 'dark' ? 'light' : 'dark'
		setTheme(newTheme)

		if (newTheme === 'dark') {
			document.documentElement.classList.add('dark')
			localStorage.setItem('theme', 'dark')
		} else {
			document.documentElement.classList.remove('dark')
			localStorage.setItem('theme', 'light')
		}
	}

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (context === undefined)
		throw new Error('useTheme must be used within a ThemeProvider')
	return context
}

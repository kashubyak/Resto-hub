'use client'

import {
	DEFAULT_THEME_PREFERENCE,
	THEME_STORAGE_KEY,
	isThemePreference,
	type ResolvedTheme,
	type ThemePreference,
} from '@/constants/theme.constant'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react'

interface ThemeContextType {
	/** User-selected preference (light, dark, or follow system). */
	preference: ThemePreference
	/** Theme currently applied to the document. */
	theme: ResolvedTheme
	setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getSystemResolved(): ResolvedTheme {
	if (typeof window === 'undefined') return 'light'
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'
}

function readPreference(): ThemePreference {
	if (typeof window === 'undefined') return DEFAULT_THEME_PREFERENCE

	const saved = localStorage.getItem(THEME_STORAGE_KEY)
	if (isThemePreference(saved)) return saved

	return DEFAULT_THEME_PREFERENCE
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
	if (preference === 'dark') return 'dark'
	if (preference === 'light') return 'light'
	return getSystemResolved()
}

function applyResolvedToDocument(resolved: ResolvedTheme) {
	document.documentElement.classList.toggle('dark', resolved === 'dark')
	document.documentElement.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [preference, setPreferenceState] = useState<ThemePreference>(
		DEFAULT_THEME_PREFERENCE,
	)
	const [theme, setTheme] = useState<ResolvedTheme>('light')

	const applyPreference = useCallback((nextPreference: ThemePreference) => {
		const resolved = resolveTheme(nextPreference)
		setPreferenceState(nextPreference)
		setTheme(resolved)
		applyResolvedToDocument(resolved)
	}, [])

	useEffect(() => {
		applyPreference(readPreference())

		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

		const handler = () => {
			if (readPreference() !== 'system') return
			const resolved = getSystemResolved()
			setTheme(resolved)
			applyResolvedToDocument(resolved)
		}

		darkModeMediaQuery.addEventListener('change', handler)
		return () => darkModeMediaQuery.removeEventListener('change', handler)
	}, [applyPreference])

	const setPreference = useCallback(
		(nextPreference: ThemePreference) => {
			localStorage.setItem(THEME_STORAGE_KEY, nextPreference)
			applyPreference(nextPreference)
		},
		[applyPreference],
	)

	return (
		<ThemeContext.Provider value={{ preference, theme, setPreference }}>
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

export const THEME_STORAGE_KEY = 'theme' as const

export const THEME_PREFERENCE = {
	LIGHT: 'light',
	DARK: 'dark',
	SYSTEM: 'system',
} as const

export type ThemePreference =
	(typeof THEME_PREFERENCE)[keyof typeof THEME_PREFERENCE]

export type ResolvedTheme = 'light' | 'dark'

export const DEFAULT_THEME_PREFERENCE: ThemePreference = THEME_PREFERENCE.SYSTEM

export function isThemePreference(
	value: string | null,
): value is ThemePreference {
	return (
		value === THEME_PREFERENCE.LIGHT ||
		value === THEME_PREFERENCE.DARK ||
		value === THEME_PREFERENCE.SYSTEM
	)
}

export const THEME_SCRIPT = `(function(){try{var k='${THEME_STORAGE_KEY}';var t=localStorage.getItem(k);var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d){r.classList.add('dark');r.style.colorScheme='dark'}else{r.classList.remove('dark');r.style.colorScheme='light'}}catch(e){}})();`

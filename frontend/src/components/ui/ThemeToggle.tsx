'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/ThemeContext'

interface ThemeToggleProps {
	variant?: 'fixed' | 'inline'
}

export function ThemeToggle({ variant = 'fixed' }: ThemeToggleProps) {
	const { theme, toggleTheme } = useTheme()

	if (variant === 'inline') {
		return (
			<button
				type="button"
				onClick={toggleTheme}
				className="p-1.5 bg-input rounded-lg hover:bg-input/80 transition-colors"
				aria-label="Toggle theme"
			>
				{theme === 'dark' ? (
					<Sun className="w-4 h-4 text-muted-foreground" />
				) : (
					<Moon className="w-4 h-4 text-muted-foreground" />
				)}
			</button>
		)
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="fixed top-6 right-6 p-3 bg-card border border-border rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 z-50"
			aria-label="Toggle theme"
		>
			{theme === 'dark' ? (
				<Sun className="w-5 h-5 text-foreground" />
			) : (
				<Moon className="w-5 h-5 text-foreground" />
			)}
		</button>
	)
}

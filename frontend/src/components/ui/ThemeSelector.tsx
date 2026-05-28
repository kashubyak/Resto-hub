'use client'

import {
	THEME_PREFERENCE,
	type ThemePreference,
} from '@/constants/theme.constant'
import { useTheme } from '@/providers/ThemeContext'
import { cn } from '@/utils/cn'
import { Monitor, Moon, Sun } from 'lucide-react'
import { memo } from 'react'

interface ThemeSelectorProps {
	variant?: 'fixed' | 'inline'
}

const OPTIONS: {
	value: ThemePreference
	label: string
	Icon: typeof Sun
}[] = [
	{ value: THEME_PREFERENCE.LIGHT, label: 'Light theme', Icon: Sun },
	{ value: THEME_PREFERENCE.SYSTEM, label: 'System theme', Icon: Monitor },
	{ value: THEME_PREFERENCE.DARK, label: 'Dark theme', Icon: Moon },
]

function ThemeSelectorComponent({ variant = 'fixed' }: ThemeSelectorProps) {
	const { preference, setPreference } = useTheme()

	const group = (
		<div
			className={cn(
				'inline-flex items-center gap-0.5 rounded-lg border border-border bg-input p-0.5',
				variant === 'fixed' && 'shadow-lg',
			)}
			role="group"
			aria-label="Theme"
		>
			{OPTIONS.map(({ value, label, Icon }) => {
				const isActive = preference === value
				return (
					<button
						key={value}
						type="button"
						onClick={() => setPreference(value)}
						className={cn(
							'rounded-md p-1.5 transition-colors',
							isActive
								? 'bg-card text-foreground shadow-sm'
								: 'text-muted-foreground hover:text-foreground hover:bg-accent',
						)}
						aria-label={label}
						aria-pressed={isActive}
						title={label}
					>
						<Icon className="w-4 h-4" />
					</button>
				)
			})}
		</div>
	)

	if (variant === 'inline') return group

	return (
		<div className="fixed top-6 right-6 z-50">{group}</div>
	)
}

export const ThemeSelector = memo(ThemeSelectorComponent)

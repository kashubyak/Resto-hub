'use client'

import { Check, ChevronDown } from 'lucide-react'
import { type ComponentType, useEffect, useRef, useState } from 'react'

export interface IAnalyticsSelectOption {
	value: string
	label: string
	icon?: ComponentType<{ className?: string }>
}

interface ICustomSelectProps {
	label: string
	value: string
	options: IAnalyticsSelectOption[]
	onChange: (value: string) => void
}

export function CustomSelect({
	label,
	value,
	options,
	onChange,
}: ICustomSelectProps) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const selectedOption = options.find((opt) => opt.value === value)
	const SelectedIcon = selectedOption?.icon

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			)
				setIsOpen(false)
		}

		if (isOpen) document.addEventListener('mousedown', handleClickOutside)

		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen])

	return (
		<div className="relative" ref={dropdownRef}>
			<label className="text-muted-foreground mb-2 block text-xs">
				{label}
			</label>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`bg-input text-foreground flex h-10 w-full items-center justify-between rounded-xl border px-3 text-sm transition-all focus:outline-none ${
					isOpen
						? 'bg-background border-primary/50 shadow-sm'
						: 'border-border hover:bg-input/80 hover:border-border/80'
				}`}
			>
				<div className="flex min-w-0 flex-1 items-center gap-2">
					{SelectedIcon && (
						<SelectedIcon className="text-muted-foreground h-4 w-4 shrink-0" />
					)}
					<span className="truncate">{selectedOption?.label}</span>
				</div>
				<ChevronDown
					className={`text-muted-foreground ml-2 h-4 w-4 shrink-0 transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{isOpen && (
				<div className="border-border bg-popover animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border shadow-xl duration-200">
					<div className="scrollbar-thin max-h-64 overflow-y-auto">
						{options.map((option, index) => {
							const Icon = option.icon
							const isSelected = option.value === value
							return (
								<button
									type="button"
									key={option.value}
									onClick={() => {
										onChange(option.value)
										setIsOpen(false)
									}}
									style={{ animationDelay: `${index * 20}ms` }}
									className={`animate-in fade-in-0 slide-in-from-top-1 flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-all duration-150 ${
										isSelected
											? 'bg-primary/10 text-primary font-semibold'
											: 'text-foreground hover:bg-accent hover:pl-4'
									}`}
								>
									{Icon && (
										<Icon
											className={`h-4 w-4 shrink-0 transition-colors ${
												isSelected ? 'text-primary' : 'text-muted-foreground'
											}`}
										/>
									)}
									<span className="flex-1 truncate">{option.label}</span>
									{isSelected && (
										<Check className="text-primary h-4 w-4 shrink-0" />
									)}
								</button>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

'use client'

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ICustomDatePickerProps {
	label: string
	value: string
	onChange: (value: string) => void
}

export function CustomDatePicker({
	label,
	value,
	onChange,
}: ICustomDatePickerProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [currentMonth, setCurrentMonth] = useState(
		() => new Date(value || new Date()),
	)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const selectedDate = value ? new Date(value) : null

	useEffect(() => {
		if (value) setCurrentMonth(new Date(value))
	}, [value])

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

	const formatDisplayDate = (dateStr: string) => {
		if (!dateStr) return 'Select date'
		const date = new Date(dateStr)
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	}

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear()
		const month = date.getMonth()
		const firstDay = new Date(year, month, 1)
		const lastDay = new Date(year, month + 1, 0)
		const daysInMonth = lastDay.getDate()
		const startingDayOfWeek = firstDay.getDay()
		const days: (number | null)[] = []
		for (let i = 0; i < startingDayOfWeek; i++) days.push(null)
		for (let i = 1; i <= daysInMonth; i++) days.push(i)
		return days
	}

	const handlePrevMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
		)
	}

	const handleNextMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
		)
	}

	const handleDateSelect = (day: number) => {
		const newDate = new Date(
			currentMonth.getFullYear(),
			currentMonth.getMonth(),
			day,
		)
		const dateString = newDate.toISOString().split('T')[0]
		if (dateString) onChange(dateString)
		setIsOpen(false)
	}

	const isToday = (day: number) => {
		const today = new Date()
		return (
			day === today.getDate() &&
			currentMonth.getMonth() === today.getMonth() &&
			currentMonth.getFullYear() === today.getFullYear()
		)
	}

	const isSelected = (day: number) => {
		if (!selectedDate) return false
		return (
			day === selectedDate.getDate() &&
			currentMonth.getMonth() === selectedDate.getMonth() &&
			currentMonth.getFullYear() === selectedDate.getFullYear()
		)
	}

	const days = getDaysInMonth(currentMonth)
	const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

	return (
		<div className="relative" ref={dropdownRef}>
			<label className="text-muted-foreground mb-2 block text-xs">
				{label}
			</label>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`bg-input text-foreground flex h-10 w-full items-center gap-2 rounded-xl border px-3 text-sm transition-all focus:outline-none ${
					isOpen
						? 'bg-background border-primary/50 shadow-sm'
						: 'border-border hover:bg-input/80 hover:border-border/80'
				}`}
			>
				<Calendar
					className={`h-4 w-4 shrink-0 transition-colors ${
						isOpen ? 'text-primary' : 'text-muted-foreground'
					}`}
				/>
				<span className="flex-1 truncate text-left">
					{formatDisplayDate(value)}
				</span>
			</button>

			{isOpen && (
				<div className="border-border bg-popover animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 absolute top-full left-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border shadow-xl duration-200">
					<div className="border-border flex items-center justify-between border-b bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-3">
						<button
							type="button"
							onClick={handlePrevMonth}
							className="text-foreground hover:bg-primary/20 hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<div className="text-foreground flex items-center gap-2 text-sm font-bold">
							<Calendar className="text-primary h-4 w-4" />
							{currentMonth.toLocaleDateString('en-US', {
								month: 'long',
								year: 'numeric',
							})}
						</div>
						<button
							type="button"
							onClick={handleNextMonth}
							className="text-foreground hover:bg-primary/20 hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-110"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>

					<div className="p-3">
						<div className="mb-2 grid grid-cols-7 gap-1">
							{weekDays.map((day) => (
								<div
									key={day}
									className="text-muted-foreground flex h-8 items-center justify-center text-xs font-medium"
								>
									{day}
								</div>
							))}
						</div>

						<div className="grid grid-cols-7 gap-1">
							{days.map((day, index) => {
								if (day === null)
									return <div key={`empty-${index}`} className="h-9" />

								const selected = isSelected(day)
								const today = isToday(day)

								return (
									<button
										type="button"
										key={day}
										onClick={() => handleDateSelect(day)}
										className={`relative h-9 rounded-lg text-sm font-semibold transition-all ${
											selected
												? 'bg-primary text-primary-foreground ring-primary/30 scale-105 shadow-lg ring-2'
												: today
													? 'bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105'
													: 'text-foreground hover:bg-accent hover:scale-105'
										}`}
									>
										{day}
										{today && !selected && (
											<div className="bg-primary absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full" />
										)}
									</button>
								)
							})}
						</div>
					</div>

					<div className="border-border from-muted/20 to-muted/40 border-t bg-gradient-to-r px-3 py-2.5">
						<div className="mb-2 grid grid-cols-3 gap-2">
							<button
								type="button"
								onClick={() => {
									const today = new Date().toISOString().split('T')[0]
									if (today) onChange(today)
									setIsOpen(false)
								}}
								className="text-primary bg-primary/10 hover:bg-primary/20 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all hover:scale-105"
							>
								Today
							</button>
							<button
								type="button"
								onClick={() => {
									const yesterday = new Date()
									yesterday.setDate(yesterday.getDate() - 1)
									const d = yesterday.toISOString().split('T')[0]
									if (d) onChange(d)
									setIsOpen(false)
								}}
								className="text-foreground bg-accent hover:bg-accent/80 rounded-lg px-2 py-1.5 text-xs font-medium transition-all hover:scale-105"
							>
								Yesterday
							</button>
							<button
								type="button"
								onClick={() => {
									const lastWeek = new Date()
									lastWeek.setDate(lastWeek.getDate() - 7)
									const d = lastWeek.toISOString().split('T')[0]
									if (d) onChange(d)
									setIsOpen(false)
								}}
								className="text-foreground bg-accent hover:bg-accent/80 rounded-lg px-2 py-1.5 text-xs font-medium transition-all hover:scale-105"
							>
								-7 days
							</button>
						</div>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="text-muted-foreground hover:text-foreground w-full text-xs font-medium transition-colors"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

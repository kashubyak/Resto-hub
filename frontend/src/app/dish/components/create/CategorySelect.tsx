'use client'

import { useCategories } from '@/hooks/useCategories'
import type { ICategory } from '@/types/category.interface'
import { Check, ChevronDown, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const GRADIENTS = [
	'from-green-500/10 to-emerald-500/10',
	'from-orange-500/10 to-red-500/10',
	'from-pink-500/10 to-rose-500/10',
	'from-blue-500/10 to-cyan-500/10',
	'from-lime-500/10 to-green-500/10',
	'from-amber-500/10 to-yellow-500/10',
	'from-purple-500/10 to-pink-500/10',
	'from-teal-500/10 to-blue-500/10',
] as const

function getGradientById(id: number) {
	return GRADIENTS[id % GRADIENTS.length]
}

type CategorySelectProps = {
	value: number | null
	onChange: (value: number | null) => void
	error?: string
}

export function CategorySelect({ value, onChange, error }: CategorySelectProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState('')
	const dropdownRef = useRef<HTMLDivElement>(null)
	const { allCategories } = useCategories()

	const selectedCategory = allCategories.find((c) => c.id === value)
	const filtered = search.trim()
		? allCategories.filter((c) =>
				c.name.toLowerCase().includes(search.toLowerCase()),
			)
		: allCategories

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
				setSearch('')
			}
		}
		if (isOpen) document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen])

	return (
		<div className="space-y-2 relative" ref={dropdownRef}>
			<label className="block text-sm font-medium text-foreground">
				Category <span className="text-red-500">*</span>
			</label>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full h-14 px-4 bg-background border-2 rounded-xl text-left flex items-center gap-3 transition-all duration-200 ${
					error
						? 'border-red-500'
						: isOpen
							? 'border-primary ring-2 ring-primary'
							: 'border-border hover:border-primary/50'
				}`}
			>
				{selectedCategory && (
					<div
						className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getGradientById(selectedCategory.id)} flex items-center justify-center text-lg shrink-0`}
					>
						{selectedCategory.icon || selectedCategory.name.charAt(0)}
					</div>
				)}
				{selectedCategory ? (
					<span className="text-foreground font-medium flex-1 text-left">
						{selectedCategory.name}
					</span>
				) : (
					<span className="text-muted-foreground flex-1 text-left">
						Select category
					</span>
				)}
				<ChevronDown
					className={`w-5 h-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
					<div className="p-3 border-b border-border">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search categories..."
								className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
					</div>

					<div className="max-h-64 overflow-y-auto py-2">
						<button
							type="button"
							onClick={() => {
								onChange(null)
								setIsOpen(false)
								setSearch('')
							}}
							className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors text-left"
						>
							<span className="text-sm font-medium text-muted-foreground">
								None
							</span>
						</button>
						{filtered.length > 0 ? (
							filtered.map((cat: ICategory) => (
								<button
									key={cat.id}
									type="button"
									onClick={() => {
										onChange(cat.id)
										setIsOpen(false)
										setSearch('')
									}}
									className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors group ${
										value === cat.id ? 'bg-accent' : ''
									}`}
								>
									<div
										className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradientById(cat.id)} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}
									>
										{cat.icon || cat.name.charAt(0)}
									</div>
									<span className="flex-1 text-left text-sm font-medium text-foreground">
										{cat.name}
									</span>
									{value === cat.id && (
										<Check className="w-5 h-5 text-primary" />
									)}
								</button>
							))
						) : (
							<div className="px-4 py-8 text-center text-sm text-muted-foreground">
								No categories found
							</div>
						)}
					</div>
				</div>
			)}

			{error && (
				<span className="text-sm text-red-500 mt-1 block">{error}</span>
			)}
		</div>
	)
}

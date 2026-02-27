'use client'

import { categoryFilters } from '@/components/elements/Filters/category.filters'
import type { FilterValues } from '@/types/filter.interface'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CategoryListItem } from './CategoryListItem'
import { CategoryModal } from './CategoryModal'

const DEBOUNCE_MS = 500

export default function CategoryPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchInputValue, setSearchInputValue] = useState('')
	const [filters, setFilters] = useState<FilterValues>({})
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const handleModalOpen = useCallback(() => setIsModalOpen(true), [])
	const handleModalClose = useCallback(() => setIsModalOpen(false), [])

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => {
			setSearchQuery(searchInputValue.trim())
			debounceRef.current = null
		}, DEBOUNCE_MS)
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [searchInputValue])

	const handleFilterChange = useCallback((key: string, value: string) => {
		setFilters((prev) =>
			value ? { ...prev, [key]: value } : { ...prev, [key]: undefined },
		)
	}, [])

	const handleClearFilters = useCallback(() => {
		setFilters({})
	}, [])

	const handleClearSearch = useCallback(() => {
		setSearchInputValue('')
		setFilters({})
	}, [])

	const hasActiveFilters = Object.keys(filters).length > 0
	const sortByConfig = categoryFilters.find((f) => f.key === 'sortBy')
	const hasDishesConfig = categoryFilters.find((f) => f.key === 'hasDishes')

	return (
		<div className="max-w-7xl mx-auto space-y-4 px-4 sm:px-6">
			<div className="flex flex-col sm:flex-row gap-3">
				<button
					type="button"
					onClick={handleModalOpen}
					className="group flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 font-medium order-first sm:order-first"
				>
					<Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
					<span>Create new category</span>
				</button>

				<div className="relative flex-1 order-last sm:order-none">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
					<input
						type="text"
						placeholder="Search categories..."
						value={searchInputValue}
						onChange={(e) => setSearchInputValue(e.target.value)}
						className="w-full h-12 pl-12 pr-4 bg-card border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
					/>
				</div>

				<button
					type="button"
					onClick={() => setIsFilterOpen((open) => !open)}
					className={`flex items-center justify-center gap-2 px-5 h-12 rounded-xl border-2 font-medium transition-all duration-300 hover:-translate-y-0.5 order-2 sm:order-last ${
						isFilterOpen || hasActiveFilters
							? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
							: 'bg-card text-foreground border-border hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10'
					}`}
				>
					<SlidersHorizontal className="w-5 h-5" />
					<span className="hidden sm:inline">Filters</span>
				</button>
			</div>

			{isFilterOpen && (
				<div className="bg-card border-2 border-border rounded-2xl overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-300">
					<div className="bg-gradient-to-br from-primary/5 to-primary/10 px-5 py-4 border-b-2 border-border flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
								<SlidersHorizontal className="w-4 h-4 text-primary" />
							</div>
							<h3 className="text-lg font-bold text-foreground">Filters</h3>
						</div>
						<button
							type="button"
							onClick={handleClearFilters}
							className="text-sm text-primary hover:underline font-semibold"
						>
							Clear all
						</button>
					</div>
					<div className="p-5">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{sortByConfig && sortByConfig.type === 'select' && (
								<div className="space-y-2">
									<label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
										{sortByConfig.label}
									</label>
									<div className="relative">
										<select
											value={(filters.sortBy as string) ?? ''}
											onChange={(e) =>
												handleFilterChange('sortBy', e.target.value)
											}
											className="w-full h-10 px-3 bg-background border-2 border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
										>
											<option value="">{sortByConfig.placeholder}</option>
											{sortByConfig.options.map((opt) => (
												<option key={opt.value} value={opt.value}>
													{opt.label}
												</option>
											))}
										</select>
										<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
											<svg
												className="w-4 h-4 text-muted-foreground"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</div>
									</div>
								</div>
							)}
							{hasDishesConfig && hasDishesConfig.type === 'select' && (
								<div className="space-y-2">
									<label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
										Dish Count
									</label>
									<div className="relative">
										<select
											value={(filters.hasDishes as string) ?? ''}
											onChange={(e) =>
												handleFilterChange('hasDishes', e.target.value)
											}
											className="w-full h-10 px-3 bg-background border-2 border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
										>
											<option value="">All</option>
											{hasDishesConfig.options.map((opt) => (
												<option key={opt.value} value={opt.value}>
													{opt.label}
												</option>
											))}
										</select>
										<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
											<svg
												className="w-4 h-4 text-muted-foreground"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			<CategoryModal open={isModalOpen} onClose={handleModalClose} />
			<CategoryListItem
				searchQuery={searchQuery}
				filters={filters}
				onOpenCreateModal={handleModalOpen}
				onClearSearch={handleClearSearch}
			/>
		</div>
	)
}

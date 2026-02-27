'use client'

import { BooleanFilter } from '@/components/elements/Filters/BooleanFilter'
import { dishFilters } from '@/components/elements/Filters/dish.filters'
import { RangeFilter } from '@/components/elements/Filters/RangeFilter'
import { SelectFilter } from '@/components/elements/Filters/SelectFilter'
import { ROUTES } from '@/constants/pages.constant'
import { useDishes } from '@/hooks/useDishes'
import type {
	FilterConfig,
	FilterValue,
	FilterValues,
} from '@/types/filter.interface'
import { Plus, Search, SlidersHorizontal, UtensilsCrossed } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ViewModeToggle, type ViewMode } from '@/components/ui/ViewModeToggle'
import { DishEmptyState } from './DishEmptyState'
import { DishList } from './DishList'

export default function DishesPage() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')
	const [localSearch, setLocalSearch] = useState('')
	const [filters, setFilters] = useState<FilterValues>({})
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const { allDishes, isLoading } = useDishes(undefined, searchQuery, filters)
	const isEmpty =
		!isLoading &&
		!searchQuery &&
		Object.keys(filters).length === 0 &&
		allDishes.length === 0

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => setSearchQuery(localSearch), 500)
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [localSearch])

	const handleNavigateToCreate = useCallback(
		() => router.push(ROUTES.PRIVATE.ADMIN.DISH_CREATE),
		[router],
	)

	const handleFilterChange = useCallback((key: string, value: FilterValue) => {
		setFilters((prev) => ({ ...prev, [key]: value }))
	}, [])

	const handleClearFilters = useCallback(() => setFilters({}), [])

	const renderFilter = useCallback(
		(config: FilterConfig) => {
			switch (config.type) {
				case 'range':
					return (
						<RangeFilter
							key={config.key}
							config={config}
							values={filters}
							onChange={handleFilterChange}
						/>
					)
				case 'boolean':
					return (
						<BooleanFilter
							key={config.key}
							config={config}
							values={filters}
							onChange={handleFilterChange}
						/>
					)
				case 'select':
					return (
						<SelectFilter
							key={config.key}
							config={config}
							values={filters}
							onChange={handleFilterChange}
						/>
					)
				default:
					return null
			}
		},
		[filters, handleFilterChange],
	)

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			{isEmpty ? (
				<DishEmptyState onAddManual={handleNavigateToCreate} />
			) : (
				<>
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center gap-3">
								<UtensilsCrossed className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
								Dish List
								{!isLoading && (
									<span className="text-lg sm:text-xl text-muted-foreground font-normal">
										({allDishes.length}{' '}
										{allDishes.length === 1 ? 'item' : 'items'})
									</span>
								)}
							</h1>
							<p className="text-sm sm:text-base text-muted-foreground mt-1">
								Manage your restaurant menu items
							</p>
						</div>

						<button
							type="button"
							onClick={handleNavigateToCreate}
							className="group flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 font-medium"
						>
							<Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
							<span>Create new dish</span>
						</button>
					</div>

					{/* Search and View Controls */}
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
							<input
								type="text"
								placeholder="Search dishes..."
								value={localSearch}
								onChange={(e) => setLocalSearch(e.target.value)}
								className="w-full h-12 pl-12 pr-4 bg-card border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
							/>
						</div>

						<ViewModeToggle
							viewMode={viewMode}
							onViewModeChange={setViewMode}
						/>

						<button
							type="button"
							onClick={() => setIsFilterOpen(!isFilterOpen)}
							className={`flex items-center justify-center gap-2 px-5 h-12 rounded-xl border-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
								isFilterOpen
									? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
									: 'bg-card text-foreground border-border hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10'
							}`}
						>
							<SlidersHorizontal className="w-5 h-5" />
							<span className="hidden sm:inline">Filters</span>
						</button>
					</div>

					{/* Inline Filter Panel */}
					{isFilterOpen && (
						<div className="bg-card border-2 border-border rounded-xl p-6 animate-in fade-in-0 slide-in-from-top-2 duration-300">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-foreground">
									Filters
								</h3>
								<button
									type="button"
									onClick={handleClearFilters}
									className="text-sm text-primary hover:underline font-medium"
								>
									Clear all
								</button>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{dishFilters.map(renderFilter)}
							</div>
						</div>
					)}

					<DishList
						searchQuery={searchQuery}
						filters={filters}
						viewMode={viewMode}
					/>
				</>
			)}
		</div>
	)
}

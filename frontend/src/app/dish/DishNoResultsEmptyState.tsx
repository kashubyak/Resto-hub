'use client'

import { Plus, UtensilsCrossed } from 'lucide-react'
import { memo } from 'react'

interface DishNoResultsEmptyStateProps {
	hasSearchOrFilters: boolean
	onClearFilters: () => void
	onCreateDish: () => void
}

function DishNoResultsEmptyStateComponent({
	hasSearchOrFilters,
	onClearFilters,
	onCreateDish,
}: DishNoResultsEmptyStateProps) {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-24rem)] py-12">
			<div className="w-full max-w-md text-center space-y-6 px-4">
				<div className="flex justify-center">
					<div className="relative">
						<div
							className="w-24 h-24 rounded-2xl flex items-center justify-center border-2 border-primary/20"
							style={{
								background:
									'linear-gradient(to bottom right, color-mix(in oklab, var(--primary) 12%, transparent), color-mix(in oklab, var(--primary) 6%, transparent))',
							}}
						>
							<UtensilsCrossed
								className="w-12 h-12 text-primary opacity-50"
								aria-hidden
							/>
						</div>
						<div
							className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse"
							style={{
								backgroundColor:
									'color-mix(in oklab, var(--primary) 22%, transparent)',
							}}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<h3 className="text-2xl font-bold text-foreground">
						No Dishes Found
					</h3>
					<p className="text-sm text-muted-foreground max-w-xs mx-auto">
						{hasSearchOrFilters
							? 'No dishes match your search or filters. Try adjusting your criteria.'
							: 'Start by creating your first dish to build your menu.'}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
					{hasSearchOrFilters && (
						<button
							type="button"
							onClick={onClearFilters}
							className="clear-filters-btn px-5 py-2.5 bg-background border-2 border-border text-foreground rounded-xl font-medium transition-all duration-200"
						>
							Clear Filters
						</button>
					)}
					<button
						type="button"
						onClick={onCreateDish}
						className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
					>
						<Plus className="w-4 h-4" />
						Create Dish
					</button>
				</div>
			</div>
		</div>
	)
}

export const DishNoResultsEmptyState = memo(DishNoResultsEmptyStateComponent)

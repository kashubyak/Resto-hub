'use client'

import { LayoutGrid } from 'lucide-react'
import { memo } from 'react'

interface TableNoResultsProps {
	onClearSearch: () => void
}

const TableNoResultsComponent = ({ onClearSearch }: TableNoResultsProps) => {
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
							<LayoutGrid
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
						No Tables Found
					</h3>
					<p className="text-sm text-muted-foreground max-w-xs mx-auto">
						No tables match your search. Try a different keyword or clear filters.
					</p>
				</div>
				<button
					type="button"
					onClick={onClearSearch}
					className="px-5 py-2.5 bg-background hover:bg-accent border-2 border-border hover:border-primary text-foreground rounded-xl font-medium transition-all"
				>
					Clear Search
				</button>
			</div>
		</div>
	)
}

export const TableNoResults = memo(TableNoResultsComponent)

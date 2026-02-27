'use client'

import { ChefHat, Import, Plus, Sparkles, Upload } from 'lucide-react'
import { memo } from 'react'

interface DishEmptyStateProps {
	onAddManual: () => void
	onImport?: () => void
}

function DishEmptyStateComponent({ onAddManual, onImport }: DishEmptyStateProps) {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
			<div className="w-full max-w-3xl text-center space-y-8 px-4">
				<div className="flex justify-center">
					<div className="relative">
						<div
							className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/25 animate-float"
							style={{
								background:
									'linear-gradient(to bottom right, var(--primary), transparent)',
							}}
						>
							<ChefHat className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-sparkle" />
						</div>
						<div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary/20 animate-pulse-smooth" />
						<div
							className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-primary/10 animate-pulse-smooth"
							style={{ animationDelay: '1s' }}
						/>
					</div>
				</div>

				<div className="space-y-3">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
						Your Menu Awaits! 🍽️
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
						Start building your restaurant's menu by adding your first dishes.
						You can create them manually or import from a file.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-6">
					<button
						type="button"
						onClick={onAddManual}
						className="group border-2 border-primary rounded-2xl p-6 sm:p-7 hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300 text-left"
						style={{
							background:
								'linear-gradient(to bottom right, var(--primary), transparent)',
						}}
					>
						<div className="flex flex-col items-center sm:items-start text-center sm:text-left">
							<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
								<Plus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
							</div>
							<h3 className="text-base sm:text-lg font-semibold text-white mb-2">
								Add Manually
							</h3>
							<p className="text-xs sm:text-sm text-white/80 mb-4 flex-1">
								Create dishes one by one with full control
							</p>
							<div className="flex items-center gap-2 text-white text-sm font-medium">
								Start creating
								<Sparkles className="w-4 h-4" />
							</div>
						</div>
					</button>

					<button
						type="button"
						onClick={onImport}
						className="group bg-card border-2 border-border rounded-2xl p-6 sm:p-7 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 text-left"
					>
						<div className="flex flex-col items-center sm:items-start text-center sm:text-left">
							<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
								<Upload className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
							</div>
							<h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
								Import Dishes
							</h3>
							<p className="text-xs sm:text-sm text-muted-foreground mb-4 flex-1">
								Upload CSV or Excel file with your menu
							</p>
							<div className="flex items-center gap-2 text-primary text-sm font-medium">
								Browse files
								<Import className="w-4 h-4" />
							</div>
						</div>
					</button>
				</div>

				<div className="pt-6 space-y-4">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full text-sm text-muted-foreground">
						<Sparkles className="w-4 h-4 text-primary" />
						<span>Pro tip: Organize dishes with categories for better navigation</span>
					</div>

					<p className="text-xs sm:text-sm text-muted-foreground">
						Need help?{' '}
						<a href="#" className="text-primary hover:underline font-medium">
							View sample CSV template
						</a>{' '}
						or{' '}
						<a href="#" className="text-primary hover:underline font-medium">
							watch tutorial
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}

export const DishEmptyState = memo(DishEmptyStateComponent)
DishEmptyState.displayName = 'DishEmptyState'

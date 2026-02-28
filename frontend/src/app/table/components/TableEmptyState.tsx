'use client'

import { LayoutGrid, Plus, Sparkles, Upload } from 'lucide-react'
import { memo } from 'react'

interface TableEmptyStateProps {
	onCreateClick: () => void
}

const TableEmptyStateComponent = ({ onCreateClick }: TableEmptyStateProps) => {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
			<div className="w-full max-w-4xl text-center space-y-8 px-4">
				<div className="flex justify-center">
					<div className="relative">
						<div
							className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/25 animate-float"
							style={{
								backgroundImage:
									'linear-gradient(to bottom right, var(--primary), transparent)',
							}}
						>
							<LayoutGrid className="w-16 h-16 text-white" />
						</div>
						<div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary/30 animate-pulse-smooth" />
						<div
							className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-primary/20 animate-pulse-smooth"
							style={{ animationDelay: '1s' }}
						/>
					</div>
				</div>

				<div className="space-y-3">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
						Start Managing Your Tables!
					</h1>
					<p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
						Set up your restaurant tables and seating arrangements. You can
						create them manually or import from a file.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto pt-4">
					<button
						type="button"
						onClick={onCreateClick}
						className="group relative rounded-2xl p-6 sm:p-8 text-left overflow-hidden hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
						style={{
							backgroundImage:
								'linear-gradient(to bottom right, var(--primary), transparent)',
						}}
					>
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
						<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
						<div className="relative z-10 space-y-4">
							<div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
								<Plus className="w-6 h-6 text-white" />
							</div>
							<div>
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
									Create Manually
								</h3>
								<p className="text-sm sm:text-base text-white/80">
									Create tables one by one with full control
								</p>
							</div>
							<div className="flex items-center gap-2 text-white font-medium pt-2">
								<span className="text-sm sm:text-base">Start creating</span>
								<Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
							</div>
						</div>
					</button>

					<button
						type="button"
						className="group relative bg-card border-2 border-border rounded-2xl p-6 sm:p-8 text-left overflow-hidden hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-not-allowed opacity-80"
						disabled
						aria-label="Import tables (coming soon)"
					>
						<div className="relative z-10 space-y-4">
							<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
								<Upload className="w-6 h-6 text-primary" />
							</div>
							<div>
								<h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
									Import Tables
								</h3>
								<p className="text-sm sm:text-base text-muted-foreground">
									Upload CSV or Excel file with your tables (Coming soon)
								</p>
							</div>
							<div className="flex items-center gap-2 text-primary font-medium pt-2 group-hover:gap-3 transition-all">
								<span className="text-sm sm:text-base">Browse files</span>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						</div>
					</button>
				</div>

				<div className="pt-4 space-y-3">
					<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<Sparkles className="w-4 h-4 text-primary" />
						<span>
							Pro tip: Use tables to organize seating by capacity and location
						</span>
					</div>
					<div className="flex flex-wrap items-center justify-center gap-4 text-sm">
						<button
							type="button"
							className="text-primary hover:underline font-medium cursor-default"
						>
							View sample CSV template
						</button>
						<span className="text-muted-foreground">or</span>
						<button
							type="button"
							className="text-primary hover:underline font-medium cursor-default"
						>
							watch tutorial
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export const TableEmptyState = memo(TableEmptyStateComponent)

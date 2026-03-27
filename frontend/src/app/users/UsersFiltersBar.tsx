'use client'

import { UserRole } from '@/constants/pages.constant'
import type { UsersSortOption } from '@/hooks/useUsers'
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useCallback, useState } from 'react'

export type UsersRoleFilter = '' | UserRole

const SORT_OPTIONS: { value: UsersSortOption; label: string }[] = [
	{ value: 'default', label: 'Default sorting' },
	{ value: 'name-asc', label: 'Name (A-Z)' },
	{ value: 'name-desc', label: 'Name (Z-A)' },
	{ value: 'created-newest', label: 'Created (Newest)' },
	{ value: 'created-oldest', label: 'Created (Oldest)' },
	{ value: 'updated-newest', label: 'Updated (Newest)' },
	{ value: 'updated-oldest', label: 'Updated (Oldest)' },
]

const ROLE_OPTIONS: { value: UsersRoleFilter; label: string }[] = [
	{ value: '', label: 'All' },
	{ value: UserRole.ADMIN, label: 'ADMIN' },
	{ value: UserRole.WAITER, label: 'WAITER' },
	{ value: UserRole.COOK, label: 'COOK' },
]

interface UsersFiltersBarProps {
	localSearch: string
	onSearchChange: (value: string) => void
	sortOption: UsersSortOption
	onSortOptionChange: (value: UsersSortOption) => void
	selectedRole: UsersRoleFilter
	onRoleChange: (value: UsersRoleFilter) => void
}

export const UsersFiltersBar = ({
	localSearch,
	onSearchChange,
	sortOption,
	onSortOptionChange,
	selectedRole,
	onRoleChange,
}: UsersFiltersBarProps) => {
	const [showFiltersPanel, setShowFiltersPanel] = useState(false)
	const [showSortDropdown, setShowSortDropdown] = useState(false)
	const [showRoleDropdown, setShowRoleDropdown] = useState(false)

	const clearFilters = useCallback(() => {
		onSortOptionChange('default')
		onRoleChange('')
	}, [onSortOptionChange, onRoleChange])

	const filtersActive = sortOption !== 'default' || selectedRole !== ''

	return (
		<div className="bg-card rounded-2xl border border-border p-4">
			<div className="flex flex-col sm:flex-row gap-3 mb-3">
				<div className="flex-1 flex items-center gap-2 bg-input rounded-xl px-4 py-2.5 border border-border focus-within:border-primary/50 focus-within:bg-background transition-all">
					<Search className="w-4 h-4 text-muted-foreground shrink-0" />
					<input
						type="text"
						placeholder="Search by name or email..."
						value={localSearch}
						onChange={(e) => onSearchChange(e.target.value)}
						className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
					/>
					{localSearch ? (
						<button
							type="button"
							onClick={() => onSearchChange('')}
							className="text-muted-foreground hover:text-foreground"
							aria-label="Clear search"
						>
							<X className="w-4 h-4" />
						</button>
					) : null}
				</div>

				<button
					type="button"
					onClick={() => setShowFiltersPanel(!showFiltersPanel)}
					className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-medium text-sm ${
						showFiltersPanel || filtersActive
							? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
							: 'bg-input border-border hover:bg-input/80 text-foreground'
					}`}
				>
					<SlidersHorizontal className="w-4 h-4" />
					<span>Filters</span>
					{filtersActive ? (
						<span className="px-1.5 py-0.5 bg-primary-foreground/20 rounded text-xs">
							{(sortOption !== 'default' ? 1 : 0) + (selectedRole ? 1 : 0)}
						</span>
					) : null}
				</button>
			</div>

			{showFiltersPanel ? (
				<div className="pt-3 border-t border-border space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
							<SlidersHorizontal className="w-4 h-4" />
							Filters
						</h3>
						{filtersActive ? (
							<button
								type="button"
								onClick={clearFilters}
								className="text-xs text-primary hover:text-primary-hover font-medium"
							>
								Clear all
							</button>
						) : null}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<label className="block text-xs font-medium text-muted-foreground mb-2">
								SORT BY
							</label>
							<div className="relative">
								<button
									type="button"
									onClick={() => setShowSortDropdown(!showSortDropdown)}
									className="w-full flex items-center justify-between px-4 py-2.5 bg-input border border-border rounded-xl hover:bg-input/80 transition-colors text-sm text-foreground"
								>
									<span>
										{SORT_OPTIONS.find((o) => o.value === sortOption)?.label}
									</span>
									<ChevronDown className="w-4 h-4 text-muted-foreground" />
								</button>

								{showSortDropdown ? (
									<>
										<button
											type="button"
											className="fixed inset-0 z-40 cursor-default bg-transparent border-0 p-0"
											aria-label="Close sort menu"
											onClick={() => setShowSortDropdown(false)}
										/>
										<div className="absolute left-0 right-0 top-full mt-2 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
											{SORT_OPTIONS.map((option) => (
												<button
													key={option.value}
													type="button"
													onClick={() => {
														onSortOptionChange(option.value)
														setShowSortDropdown(false)
													}}
													className={`w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors ${
														sortOption === option.value
															? 'bg-accent font-medium'
															: ''
													}`}
												>
													{option.label}
												</button>
											))}
										</div>
									</>
								) : null}
							</div>
						</div>

						<div>
							<label className="block text-xs font-medium text-muted-foreground mb-2">
								ROLE FILTER
							</label>
							<div className="relative">
								<button
									type="button"
									onClick={() => setShowRoleDropdown(!showRoleDropdown)}
									className="w-full flex items-center justify-between px-4 py-2.5 bg-input border border-border rounded-xl hover:bg-input/80 transition-colors text-sm text-foreground"
								>
									<span>
										{ROLE_OPTIONS.find((o) => o.value === selectedRole)?.label}
									</span>
									<ChevronDown className="w-4 h-4 text-muted-foreground" />
								</button>

								{showRoleDropdown ? (
									<>
										<button
											type="button"
											className="fixed inset-0 z-40 cursor-default bg-transparent border-0 p-0"
											aria-label="Close role menu"
											onClick={() => setShowRoleDropdown(false)}
										/>
										<div className="absolute left-0 right-0 top-full mt-2 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
											{ROLE_OPTIONS.map((option) => (
												<button
													key={option.value || 'all'}
													type="button"
													onClick={() => {
														onRoleChange(option.value)
														setShowRoleDropdown(false)
													}}
													className={`w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors ${
														selectedRole === option.value
															? 'bg-accent font-medium'
															: ''
													}`}
												>
													{option.label}
												</button>
											))}
										</div>
									</>
								) : null}
							</div>
						</div>
					</div>
				</div>
			) : null}

			{localSearch || selectedRole || sortOption !== 'default' ? (
				<div className="flex items-center gap-2 mt-3 pt-3 border-t border-border flex-wrap">
					<span className="text-xs text-muted-foreground">Active filters:</span>
					{localSearch ? (
						<span className="inline-flex items-center gap-1 px-2 py-1 bg-accent rounded-lg text-xs">
							Search: &quot;{localSearch}&quot;
							<button
								type="button"
								onClick={() => onSearchChange('')}
								className="hover:text-foreground"
								aria-label="Remove search filter"
							>
								<X className="w-3 h-3" />
							</button>
						</span>
					) : null}
					{selectedRole ? (
						<span className="inline-flex items-center gap-1 px-2 py-1 bg-accent rounded-lg text-xs">
							Role: {selectedRole}
							<button
								type="button"
								onClick={() => onRoleChange('')}
								className="hover:text-foreground"
								aria-label="Remove role filter"
							>
								<X className="w-3 h-3" />
							</button>
						</span>
					) : null}
					{sortOption !== 'default' ? (
						<span className="inline-flex items-center gap-1 px-2 py-1 bg-accent rounded-lg text-xs">
							Sort: {SORT_OPTIONS.find((o) => o.value === sortOption)?.label}
							<button
								type="button"
								onClick={() => onSortOptionChange('default')}
								className="hover:text-foreground"
								aria-label="Remove sort filter"
							>
								<X className="w-3 h-3" />
							</button>
						</span>
					) : null}
				</div>
			) : null}
		</div>
	)
}

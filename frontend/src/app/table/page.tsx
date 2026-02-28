'use client'

import { useAlert } from '@/providers/AlertContext'
import { createTableService } from '@/services/table/create-table.service'
import { deleteTableService } from '@/services/table/delete-table.service'
import { getTablesService } from '@/services/table/get-tables.service'
import { updateTableService } from '@/services/table/update-table.service'
import type { ITable } from '@/types/table.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import {
	ArrowUpDown,
	ChevronDown,
	Edit2,
	MoreVertical,
	Plus,
	Power,
	Search,
	Trash2,
	Users,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TableModal } from './components/TableModal'
import { TableEmptyState } from './components/TableEmptyState'
import { TableNoResults } from './components/TableNoResults'
import { DeleteConfirmDialog } from '@/app/category/components/DeleteConfirmDialog'

type FilterType = 'all' | 'available' | 'occupied'
type SortType = 'number' | 'seats' | 'status'

export default function TablesPage() {
	const queryClient = useQueryClient()
	const { showError, showSuccess } = useAlert()
	const [searchQuery, setSearchQuery] = useState('')
	const [localSearch, setLocalSearch] = useState('')
	const [filter, setFilter] = useState<FilterType>('all')
	const [sortBy, setSortBy] = useState<SortType>('number')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
	const [selectedTable, setSelectedTable] = useState<ITable | null>(null)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
	const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const { data: tablesResponse, isLoading: isLoadingTables } = useQuery({
		queryKey: ['tables'],
		queryFn: () => getTablesService(),
	})

	const tables: ITable[] = tablesResponse?.data ?? []

	const createMutation = useMutation({
		mutationFn: (data: { number: number; seats: number }) =>
			createTableService(data),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['tables'] })
			showSuccess('Table created successfully')
			setIsModalOpen(false)
			setSelectedTable(null)
		},
		onError: (err) =>
			showError(parseBackendError(err as unknown as IAxiosError).join('\n')),
	})

	const updateMutation = useMutation({
		mutationFn: (data: { id: number; number: number; seats: number }) =>
			updateTableService(data.id, { number: data.number, seats: data.seats }),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['tables'] })
			showSuccess('Table updated successfully')
			setIsModalOpen(false)
			setSelectedTable(null)
		},
		onError: (err) =>
			showError(parseBackendError(err as unknown as IAxiosError).join('\n')),
	})

	const toggleActiveMutation = useMutation({
		mutationFn: (data: { id: number; active: boolean }) =>
			updateTableService(data.id, { active: data.active }),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['tables'] })
			setActiveMenuId(null)
		},
		onError: (err) =>
			showError(parseBackendError(err as unknown as IAxiosError).join('\n')),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteTableService(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['tables'] })
			showSuccess('Table deleted successfully')
			setIsDeleteDialogOpen(false)
			setSelectedTable(null)
		},
		onError: (err) =>
			showError(parseBackendError(err as unknown as IAxiosError).join('\n')),
	})

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => {
			setSearchQuery(localSearch.trim())
			debounceRef.current = null
		}, 500)
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [localSearch])

	const getTableStatus = (table: ITable): 'available' | 'occupied' => {
		return table.active ? 'available' : 'occupied'
	}

	const handleCreateTable = useCallback(() => {
		setModalMode('create')
		setSelectedTable(null)
		setIsModalOpen(true)
	}, [])

	const handleEditTable = useCallback((table: ITable) => {
		setModalMode('edit')
		setSelectedTable(table)
		setIsModalOpen(true)
		setActiveMenuId(null)
	}, [])

	const handleDeleteTable = useCallback((table: ITable) => {
		setSelectedTable(table)
		setIsDeleteDialogOpen(true)
		setActiveMenuId(null)
	}, [])

	const handleToggleActive = useCallback(
		(table: ITable) => {
			toggleActiveMutation.mutate({ id: table.id, active: !table.active })
		},
		[toggleActiveMutation],
	)

	const handleModalSubmit = useCallback(
		(number: number, seats: number) => {
			if (modalMode === 'create') {
				createMutation.mutate({ number, seats })
			} else if (selectedTable) {
				updateMutation.mutate({
					id: selectedTable.id,
					number,
					seats,
				})
			}
		},
		[modalMode, selectedTable, createMutation, updateMutation],
	)

	const handleConfirmDelete = useCallback(() => {
		if (selectedTable) {
			deleteMutation.mutate(selectedTable.id)
		}
	}, [selectedTable, deleteMutation])

	const handleClearSearch = useCallback(() => {
		setLocalSearch('')
		setFilter('all')
	}, [])

	const filteredTables = tables.filter((table) => {
		const matchesSearch =
			table.number.toString().includes(searchQuery) ||
			table.seats.toString().includes(searchQuery)

		if (!matchesSearch) return false

		const status = getTableStatus(table)
		if (filter === 'all') return true
		return status === filter
	})

	const sortedTables = [...filteredTables].sort((a, b) => {
		if (sortBy === 'number') return a.number - b.number
		if (sortBy === 'seats') return b.seats - a.seats
		if (sortBy === 'status') {
			const statusOrder = { available: 1, occupied: 2 }
			return statusOrder[getTableStatus(a)] - statusOrder[getTableStatus(b)]
		}
		return 0
	})

	const getStatusBadge = (status: string) => {
		const styles = {
			available: 'bg-green-500/10 text-green-500 border-green-500/20',
			occupied: 'bg-red-500/10 text-red-500 border-red-500/20',
		}

		const labels = {
			available: 'Available',
			occupied: 'Occupied',
		}

		return (
			<span
				className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
					styles[status as keyof typeof styles]
				}`}
			>
				<span className="w-1.5 h-1.5 rounded-full bg-current" />
				{labels[status as keyof typeof labels]}
			</span>
		)
	}

	const filterOptions = [
		{
			value: 'all',
			label: 'All Tables',
			count: tables.length,
		},
		{
			value: 'available',
			label: 'Available',
			count: tables.filter((t) => getTableStatus(t) === 'available').length,
		},
		{
			value: 'occupied',
			label: 'Occupied',
			count: tables.filter((t) => getTableStatus(t) === 'occupied').length,
		},
	]

	const sortOptions = [
		{ value: 'number', label: 'Table Number', icon: '123' },
		{ value: 'seats', label: 'Seats', icon: '👥' },
		{ value: 'status', label: 'Status', icon: '🔄' },
	]

	const currentSortLabel =
		sortOptions.find((opt) => opt.value === sortBy)?.label ?? 'Sort'

	const isEmpty =
		!isLoadingTables && tables.length === 0 && !searchQuery && filter === 'all'

	if (isLoadingTables) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="text-muted-foreground">Loading tables...</div>
			</div>
		)
	}

	return (
		<>
			{isEmpty ? (
				<TableEmptyState onCreateClick={handleCreateTable} />
			) : (
				<div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-foreground">Tables</h1>
							<p className="text-sm text-muted-foreground mt-1">
								Manage your restaurant tables and seating
							</p>
						</div>
						<button
							onClick={handleCreateTable}
							className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
						>
							<Plus className="w-5 h-5" />
							<span>Add Table</span>
						</button>
					</div>

					{/* Filters & Search */}
					<div className="flex flex-col lg:flex-row gap-4">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
								<input
									type="text"
									placeholder="Search by table number or seats..."
									value={localSearch}
									onChange={(e) => setLocalSearch(e.target.value)}
									className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
								/>
							</div>
						</div>

						{/* Filter Pills */}
						<div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
							{filterOptions.map((option) => (
								<button
									key={option.value}
									onClick={() => setFilter(option.value as FilterType)}
									className={`
                flex items-center gap-2 h-12 px-4 rounded-xl font-medium whitespace-nowrap transition-all
                ${
									filter === option.value
										? 'bg-primary text-primary-foreground shadow-md'
										: 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
								}
              `}
								>
									<span>{option.label}</span>
									<span
										className={`
                min-w-[24px] h-6 px-2 rounded-md text-xs font-bold flex items-center justify-center
                ${
									filter === option.value
										? 'bg-white/20 text-primary-foreground'
										: 'bg-muted text-muted-foreground'
								}
              `}
									>
										{option.count}
									</span>
								</button>
							))}
						</div>

						{/* Sort Dropdown */}
						<div className="relative">
							<button
								onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
								className="h-12 pl-4 pr-10 bg-card border border-border rounded-xl text-foreground font-medium hover:border-primary/50 transition-all flex items-center gap-2 min-w-[180px]"
							>
								<ArrowUpDown className="w-4 h-4 text-muted-foreground" />
								<span className="flex-1 text-left">{currentSortLabel}</span>
								<ChevronDown
									className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
										isSortDropdownOpen ? 'rotate-180' : ''
									}`}
								/>
							</button>

							{isSortDropdownOpen && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setIsSortDropdownOpen(false)}
									/>
									<div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
										{sortOptions.map((option) => (
											<button
												key={option.value}
												onClick={() => {
													setSortBy(option.value as SortType)
													setIsSortDropdownOpen(false)
												}}
												className={`
                      w-full flex items-center gap-3 px-4 py-3 transition-colors text-left
                      ${
												sortBy === option.value
													? 'bg-primary/10 text-primary'
													: 'hover:bg-accent text-foreground'
											}
                    `}
											>
												<span className="text-lg">{option.icon}</span>
												<span className="text-sm font-medium flex-1">
													{option.label}
												</span>
												{sortBy === option.value && (
													<div className="w-2 h-2 rounded-full bg-primary" />
												)}
											</button>
										))}
									</div>
								</>
							)}
						</div>
					</div>

					{/* Tables Grid */}
					{sortedTables.length === 0 ? (
						<TableNoResults onClearSearch={handleClearSearch} />
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
							{sortedTables.map((table) => {
								const status = getTableStatus(table)
								const isMenuOpen = activeMenuId === table.id

								return (
									<div
										key={table.id}
										className={`
                  group relative bg-card border rounded-2xl p-6 transition-all duration-300
                  hover:shadow-xl hover:-translate-y-1
                  ${
										status === 'available'
											? 'border-green-500/20 hover:border-green-500/40'
											: ''
									}
                  ${
										status === 'occupied'
											? 'border-red-500/20 hover:border-red-500/40'
											: ''
									}
                `}
									>
										{/* Header with Actions */}
										<div className="flex items-start justify-between mb-4">
											<div
												className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl
                    ${status === 'available' ? 'bg-green-500/10 text-green-500' : ''}
                    ${status === 'occupied' ? 'bg-red-500/10 text-red-500' : ''}
                  `}
											>
												{table.number}
											</div>

											{/* Actions Menu */}
											<div className="relative">
												<button
													onClick={() =>
														setActiveMenuId(isMenuOpen ? null : table.id)
													}
													className="w-9 h-9 rounded-lg hover:bg-input flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
												>
													<MoreVertical className="w-4 h-4 text-muted-foreground" />
												</button>

												{isMenuOpen && (
													<>
														<div
															className="fixed inset-0 z-40"
															onClick={() => setActiveMenuId(null)}
														/>
														<div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
															<button
																onClick={() => handleEditTable(table)}
																className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
															>
																<Edit2 className="w-4 h-4 text-muted-foreground" />
																<span className="text-sm font-medium text-foreground">
																	Edit Table
																</span>
															</button>
															<button
																onClick={() => handleToggleActive(table)}
																disabled={toggleActiveMutation.isPending}
																className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
															>
																<Power className="w-4 h-4 text-muted-foreground" />
																<span className="text-sm font-medium text-foreground">
																	{table.active
																		? 'Mark as Occupied'
																		: 'Mark as Available'}
																</span>
															</button>
															<div className="border-t border-border" />
															<button
																onClick={() => handleDeleteTable(table)}
																className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left text-red-600 dark:text-red-400"
															>
																<Trash2 className="w-4 h-4" />
																<span className="text-sm font-medium">
																	Delete Table
																</span>
															</button>
														</div>
													</>
												)}
											</div>
										</div>

										{/* Table Info */}
										<div className="space-y-3">
											<div className="flex items-center gap-2 text-muted-foreground">
												<Users className="w-4 h-4" />
												<span className="text-sm font-medium">
													{table.seats} {table.seats === 1 ? 'Seat' : 'Seats'}
												</span>
											</div>

											{/* Status Badge */}
											<div>{getStatusBadge(status)}</div>
										</div>

										{/* Footer with timestamp */}
										<div className="mt-4 pt-4 border-t border-border">
											<p className="text-xs text-muted-foreground">
												Updated {new Date(table.updatedAt).toLocaleDateString()}
											</p>
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			)}

			{/* Modals */}
			<TableModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false)
					setSelectedTable(null)
				}}
				onSubmit={handleModalSubmit}
				mode={modalMode}
				initialNumber={selectedTable?.number}
				initialSeats={selectedTable?.seats}
				isLoading={createMutation.isPending || updateMutation.isPending}
			/>

			<DeleteConfirmDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => {
					setIsDeleteDialogOpen(false)
					setSelectedTable(null)
				}}
				onConfirm={handleConfirmDelete}
				title="Delete Table"
				message={`Are you sure you want to delete Table #${selectedTable?.number}? This action cannot be undone.`}
				isLoading={deleteMutation.isPending}
			/>
		</>
	)
}

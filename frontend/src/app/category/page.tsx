'use client'

import { categoryFilters } from '@/components/elements/Filters/category.filters'
import { SelectFilter } from '@/components/elements/Filters/SelectFilter'
import { useAlert } from '@/providers/AlertContext'
import { useCategories } from '@/hooks/useCategories'
import { createCategory } from '@/services/category/create-category.service'
import { deleteCategoryService } from '@/services/category/delete-category.service'
import { updateCategoryService } from '@/services/category/update-category.service'
import type { ICategoryWithDishes } from '@/types/category.interface'
import type { FilterValue, FilterValues } from '@/types/filter.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { ENTITY_FOCUS_QUERY_PARAM } from '@/constants/pages.constant'
import { Folder, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { CategoryListItem } from './CategoryListItem'
import { CategoryModal } from './CategoryModal'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'

const DEBOUNCE_MS = 500

function CategoryPageFallback() {
	return (
		<div className="max-w-7xl mx-auto space-y-6 animate-pulse">
			<div className="h-10 w-64 bg-muted rounded-lg" />
			<div className="h-12 bg-muted rounded-xl" />
			<div className="h-48 bg-muted rounded-2xl" />
		</div>
	)
}

function CategoryPageContent() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] =
		useState<ICategoryWithDishes | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchInputValue, setSearchInputValue] = useState('')
	const [filters, setFilters] = useState<FilterValues>({})
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const focusHandledRef = useRef(false)
	const searchParams = useSearchParams()
	const focusIdParam = searchParams.get(ENTITY_FOCUS_QUERY_PARAM)

	const {
		allCategories,
		isLoading: isLoadingCategories,
		refetchCategories,
	} = useCategories(searchQuery, filters)
	const { showError, showSuccess } = useAlert()

	useEffect(() => {
		focusHandledRef.current = false
	}, [focusIdParam])

	useEffect(() => {
		if (focusHandledRef.current || !focusIdParam || isLoadingCategories) return

		const focusId = Number(focusIdParam)
		if (!Number.isInteger(focusId) || focusId < 1) return

		const category = allCategories.find((c) => c.id === focusId)
		if (!category) return

		focusHandledRef.current = true
		setSelectedCategory(category)
		setIsEditModalOpen(true)
	}, [focusIdParam, allCategories, isLoadingCategories])

	const handleCreateModalOpen = useCallback(
		() => setIsCreateModalOpen(true),
		[],
	)
	const handleCreateModalClose = useCallback(
		() => setIsCreateModalOpen(false),
		[],
	)

	const handleEditModalOpen = useCallback((category: ICategoryWithDishes) => {
		setSelectedCategory(category)
		setIsEditModalOpen(true)
	}, [])
	const handleEditModalClose = useCallback(() => {
		setIsEditModalOpen(false)
		setSelectedCategory(null)
	}, [])

	const handleDeleteDialogOpen = useCallback(
		(category: ICategoryWithDishes) => {
			setSelectedCategory(category)
			setIsDeleteDialogOpen(true)
		},
		[],
	)
	const handleDeleteDialogClose = useCallback(() => {
		setIsDeleteDialogOpen(false)
		setSelectedCategory(null)
	}, [])

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

	const handleFilterChange = useCallback((key: string, value: FilterValue) => {
		setFilters((prev) =>
			value !== undefined && value !== null && value !== ''
				? { ...prev, [key]: value }
				: { ...prev, [key]: undefined },
		)
	}, [])

	const handleClearFilters = useCallback(() => {
		setFilters({})
	}, [])

	const handleClearSearch = useCallback(() => {
		setSearchInputValue('')
		setFilters({})
	}, [])

	const handleCreateCategory = useCallback(
		async (name: string, icon: string) => {
			setIsLoading(true)
			try {
				const response = await createCategory({ name, icon })
				if (response.status === 201) {
					showSuccess('Category created successfully')
					refetchCategories()
					setIsCreateModalOpen(false)
				}
			} catch (err) {
				showError(parseBackendError(err as IAxiosError).join('\n'))
			} finally {
				setIsLoading(false)
			}
		},
		[showSuccess, showError, refetchCategories],
	)

	const handleEditCategory = useCallback(
		async (name: string, icon: string) => {
			if (!selectedCategory) return
			setIsLoading(true)
			try {
				await updateCategoryService(selectedCategory.id, { name, icon })
				showSuccess('Category updated successfully')
				refetchCategories()
				handleEditModalClose()
			} catch (err) {
				showError(parseBackendError(err as IAxiosError).join('\n'))
			} finally {
				setIsLoading(false)
			}
		},
		[
			selectedCategory,
			showSuccess,
			showError,
			refetchCategories,
			handleEditModalClose,
		],
	)

	const handleDeleteCategory = useCallback(async () => {
		if (!selectedCategory) return
		setIsLoading(true)
		try {
			await deleteCategoryService(selectedCategory.id)
			showSuccess('Category deleted successfully')
			refetchCategories()
			handleDeleteDialogClose()
		} catch (err) {
			showError(parseBackendError(err as IAxiosError).join('\n'))
		} finally {
			setIsLoading(false)
		}
	}, [
		selectedCategory,
		showSuccess,
		showError,
		refetchCategories,
		handleDeleteDialogClose,
	])

	const hasActiveFilters = Object.keys(filters).length > 0

	const isEmpty =
		!isLoadingCategories &&
		allCategories.length === 0 &&
		!searchQuery &&
		Object.keys(filters).length === 0

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			{!isEmpty && (
				<>
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center gap-3">
								<Folder className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
								Categories
								{!isLoadingCategories && (
									<span className="text-lg sm:text-xl text-muted-foreground font-normal">
										({allCategories.length}{' '}
										{allCategories.length === 1 ? 'item' : 'items'})
									</span>
								)}
							</h1>
							<p className="text-sm sm:text-base text-muted-foreground mt-1">
								Organize your menu categories
							</p>
						</div>

						<button
							type="button"
							onClick={handleCreateModalOpen}
							className="group flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 font-medium"
						>
							<Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
							<span>Create new category</span>
						</button>
					</div>

					{/* Search and Filters */}
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="relative flex-1">
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
							className={`flex items-center justify-center gap-2 px-5 h-12 rounded-xl border-2 font-medium transition-all duration-300 hover:-translate-y-0.5 relative ${
								isFilterOpen || hasActiveFilters
									? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
									: 'bg-card text-foreground border-border hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10'
							}`}
						>
							<SlidersHorizontal className="w-5 h-5" />
							<span className="hidden sm:inline">Filters</span>
							{hasActiveFilters && (
								<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
									!
								</span>
							)}
						</button>
					</div>

					{/* Filter Panel */}

					{isFilterOpen && (
						<div className="bg-card border-2 border-border rounded-2xl overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-300">
							<div className="bg-gradient-to-br from-primary/5 to-primary/10 px-5 py-4 border-b-2 border-border flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
										<SlidersHorizontal className="w-4 h-4 text-primary" />
									</div>
									<h3 className="text-lg font-bold text-foreground">Filters</h3>
									{hasActiveFilters && (
										<span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded-full">
											Active
										</span>
									)}
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
									{categoryFilters.map((config) =>
										config.type === 'select' ? (
											<SelectFilter
												key={config.key}
												config={config}
												values={filters}
												onChange={handleFilterChange}
											/>
										) : null,
									)}
								</div>
							</div>
						</div>
					)}
				</>
			)}

			<CategoryModal
				isOpen={isCreateModalOpen}
				onClose={handleCreateModalClose}
				onSubmit={(name, icon) => {
					void handleCreateCategory(name, icon)
				}}
				mode="create"
				isLoading={isLoading}
			/>

			<CategoryModal
				isOpen={isEditModalOpen}
				onClose={handleEditModalClose}
				onSubmit={(name, icon) => {
					void handleEditCategory(name, icon)
				}}
				mode="edit"
				initialName={selectedCategory?.name}
				initialEmoji={selectedCategory?.icon}
				isLoading={isLoading}
			/>

			<DeleteConfirmDialog
				isOpen={isDeleteDialogOpen}
				onClose={handleDeleteDialogClose}
				onConfirm={() => {
					void handleDeleteCategory()
				}}
				categoryName={selectedCategory?.name ?? ''}
				dishCount={selectedCategory?.dishes?.length ?? 0}
				isLoading={isLoading}
			/>

			<CategoryListItem
				searchQuery={searchQuery}
				filters={filters}
				onOpenCreateModal={handleCreateModalOpen}
				onEditClick={handleEditModalOpen}
				onDeleteClick={handleDeleteDialogOpen}
				onClearSearch={handleClearSearch}
			/>
		</div>
	)
}

export default function CategoryPage() {
	return (
		<Suspense fallback={<CategoryPageFallback />}>
			<CategoryPageContent />
		</Suspense>
	)
}

'use client'

import { DISHES_QUERY_KEY } from '@/constants/query-keys.constant'
import { useAlert } from '@/providers/AlertContext'
import { getCategoriesService } from '@/services/category/get-categories.service'
import { updateDishService } from '@/services/dish/update-dish.service'
import type { ICategoryWithDishes } from '@/types/category.interface'
import type { IDish } from '@/types/dish.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Search, Tag, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

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

function getGradientByIndex(index: number) {
	return GRADIENTS[index % GRADIENTS.length]
}

interface AssignCategoryModalProps {
	open: boolean
	onClose: () => void
	dishId: number
	currentCategoryId: number | null
	onAssigned: (updatedDish: IDish) => void
}

export function AssignCategoryModal({
	open,
	onClose,
	dishId,
	currentCategoryId,
	onAssigned,
}: AssignCategoryModalProps) {
	const queryClient = useQueryClient()
	const { showSuccess, showError } = useAlert()
	const [search, setSearch] = useState('')

	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [open])

	const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
		queryKey: ['categories', 'assign', search],
		queryFn: async () => {
			const res = await getCategoriesService({
				limit: 50,
				search: search.trim() || undefined,
			})
			return res.data
		},
		enabled: open,
	})

	const assignMutation = useMutation({
		mutationFn: (categoryId: number) =>
			updateDishService({ id: dishId, categoryId }),
		onSuccess: (response) => {
			const updatedDish = response.data
			onAssigned(updatedDish)
			queryClient.invalidateQueries({
				queryKey: [DISHES_QUERY_KEY.DETAIL, dishId],
			})
			showSuccess('Category assigned successfully')
			onClose()
		},
		onError: (err) =>
			showError(parseBackendError(err as IAxiosError).join('\n')),
	})

	const categories: ICategoryWithDishes[] = categoriesResponse?.data ?? []

	const handleSelect = useCallback(
		(category: ICategoryWithDishes) => {
			assignMutation.mutate(category.id)
		},
		[assignMutation],
	)

	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Close modal"
				onClick={onClose}
				className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300"
			/>
			<div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 overflow-hidden">
				<div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b-2 border-border">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
							<Tag className="w-6 h-6 text-primary" />
						</div>
						<div className="flex-1">
							<h3 className="text-xl font-bold text-foreground">
								Assign Category
							</h3>
							<p className="text-sm text-muted-foreground">
								Select a category for this dish
							</p>
						</div>
						<button
							type="button"
							onClick={onClose}
							aria-label="Close"
							className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
						>
							<X className="w-5 h-5 text-muted-foreground" />
						</button>
					</div>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search categories..."
							className="w-full h-11 pl-10 pr-4 bg-background border-2 border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>
				<div className="p-6 max-h-96 overflow-y-auto">
					{isLoadingCategories ? (
						<div className="text-center py-12 text-muted-foreground text-sm">
							Loading categories...
						</div>
					) : (
						<div className="grid grid-cols-2 gap-3">
							{categories.map((cat, index) => (
								<button
									key={cat.id}
									type="button"
									onClick={() => handleSelect(cat)}
									disabled={assignMutation.isPending}
									className="group relative p-4 bg-background hover:bg-accent border-2 border-border hover:border-primary rounded-xl transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradientByIndex(index)} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
										{cat.icon || '🍴'}
									</div>
									<p className="text-sm font-semibold text-foreground mb-1">
										{cat.name}
									</p>
									<p className="text-xs text-muted-foreground">ID: {cat.id}</p>
									{currentCategoryId === cat.id && (
										<div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
											<Check className="w-4 h-4 text-primary-foreground" />
										</div>
									)}
								</button>
							))}
						</div>
					)}
					{!isLoadingCategories && categories.length === 0 && (
						<div className="text-center py-12">
							<p className="text-sm text-muted-foreground">
								No categories found
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

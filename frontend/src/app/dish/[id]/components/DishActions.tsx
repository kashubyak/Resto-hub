'use client'

import { AssignCategoryModal } from '@/app/dish/[id]/components/AssignCategoryModal'
import { DeleteDishModal } from '@/app/dish/[id]/components/DeleteDishModal'
import { RemoveCategoryModal } from '@/app/dish/[id]/components/RemoveCategoryModal'
import { dishUpdateConfig } from '@/components/elements/UpdateDrawer/dish.update-config'
import { UpdateDrawer } from '@/components/elements/UpdateDrawer/UpdateDrawer'
import { DISHES_QUERY_KEY } from '@/constants/query-keys.constant'
import { useDishes } from '@/hooks/useDishes'
import type { IDish } from '@/types/dish.interface'
import { Edit, Tag, Trash2, XCircle } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

export const DishActions = ({ id }: { id: number }) => {
	const queryClient = useQueryClient()
	const {
		deleteDishMutation,
		deleteCategoryFromDishMutation,
		dishQuery,
		updateDishCache,
	} = useDishes(id)
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
	const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false)
	const [isRemoveCategoryModalOpen, setRemoveCategoryModalOpen] =
		useState(false)
	const [isAssignCategoryModalOpen, setAssignCategoryModalOpen] =
		useState(false)

	const openUpdateDrawer = useCallback(() => setUpdateDrawerOpen(true), [])
	const closeUpdateDrawer = useCallback(() => setUpdateDrawerOpen(false), [])

	const handleAssigned = useCallback(
		(data: IDish) => {
			updateDishCache(queryClient, data)
			void queryClient.invalidateQueries({
				queryKey: [DISHES_QUERY_KEY.DETAIL, id],
			})
			setAssignCategoryModalOpen(false)
		},
		[updateDishCache, queryClient, id],
	)

	return (
		<>
			<h3 className="text-sm font-semibold text-foreground">Actions</h3>
			<div className="space-y-2.5">
				<button
					type="button"
					onClick={openUpdateDrawer}
					className="h-11 w-full rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white border-2 border-primary/20 hover:border-primary font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
				>
					<Edit className="w-4 h-4" />
					Update Dish
				</button>
				<button
					type="button"
					onClick={() => setAssignCategoryModalOpen(true)}
					className="h-11 w-full rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white border-2 border-primary/20 hover:border-primary font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
				>
					<Tag className="w-4 h-4" />
					Assign Category
				</button>
				<button
					type="button"
					onClick={() => setRemoveCategoryModalOpen(true)}
					disabled={deleteCategoryFromDishMutation.isPending}
					className="h-11 w-full rounded-xl bg-background hover:bg-accent text-foreground border-2 border-border hover:border-primary font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<XCircle className="w-4 h-4" />
					Remove Category
				</button>

				<button
					type="button"
					onClick={() => setDeleteModalOpen(true)}
					disabled={deleteDishMutation.isPending}
					className="h-11 w-full rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500/20 hover:border-red-500 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Trash2 className="w-4 h-4" />
					{deleteDishMutation.isPending ? 'Deleting...' : 'Delete Dish'}
				</button>
			</div>

			<UpdateDrawer
				open={updateDrawerOpen}
				onClose={closeUpdateDrawer}
				title="Update Dish"
				sections={dishUpdateConfig}
				dishData={dishQuery.data}
				isLoading={false}
			/>

			<AssignCategoryModal
				open={isAssignCategoryModalOpen}
				onClose={() => setAssignCategoryModalOpen(false)}
				dishId={id}
				currentCategoryId={
					dishQuery.data?.categoryId ?? dishQuery.data?.category?.id ?? null
				}
				onAssigned={handleAssigned}
			/>

			<RemoveCategoryModal
				open={isRemoveCategoryModalOpen}
				onClose={() => setRemoveCategoryModalOpen(false)}
				dish={dishQuery.data}
				onConfirm={() => {
					deleteCategoryFromDishMutation.mutate(id)
					setRemoveCategoryModalOpen(false)
				}}
				isPending={deleteCategoryFromDishMutation.isPending}
			/>

			<DeleteDishModal
				open={isDeleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				dish={dishQuery.data}
				onConfirm={() => {
					deleteDishMutation.mutate(id)
					setDeleteModalOpen(false)
				}}
				isPending={deleteDishMutation.isPending}
			/>
		</>
	)
}

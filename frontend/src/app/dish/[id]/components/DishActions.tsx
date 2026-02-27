'use client'

import { dishUpdateConfig } from '@/components/elements/UpdateDrawer/dish.update-config'
import { UpdateDrawer } from '@/components/elements/UpdateDrawer/UpdateDrawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ROUTES } from '@/constants/pages.constant'
import { useDishes } from '@/hooks/useDishes'
import { Edit, Tag, Trash2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

export const DishActions = ({ id }: { id: number }) => {
	const router = useRouter()
	const { deleteDishMutation, deleteCategoryFromDishMutation, dishQuery } =
		useDishes(id)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false)
	const [openRemoveCategoryConfirm, setOpenRemoveCategoryConfirm] =
		useState(false)

	const openUpdateDrawer = useCallback(() => setUpdateDrawerOpen(true), [])
	const closeUpdateDrawer = useCallback(() => setUpdateDrawerOpen(false), [])

	const handleDeleteConfirm = useCallback(() => {
		deleteDishMutation.mutate(id, {
			onSuccess: () => {
				setShowDeleteConfirm(false)
				router.push(ROUTES.PRIVATE.ADMIN.DISH)
			},
		})
	}, [id, deleteDishMutation, router])

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
					onClick={() => {}}
					className="h-11 w-full rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white border-2 border-primary/20 hover:border-primary font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
				>
					<Tag className="w-4 h-4" />
					Assign Category
				</button>
				<button
					type="button"
					onClick={() => setOpenRemoveCategoryConfirm(true)}
					disabled={deleteCategoryFromDishMutation.isPending}
					className="h-11 w-full rounded-xl bg-background hover:bg-accent text-foreground border-2 border-border hover:border-primary font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<XCircle className="w-4 h-4" />
					Remove Category
				</button>

				{!showDeleteConfirm ? (
					<button
						type="button"
						onClick={() => setShowDeleteConfirm(true)}
						disabled={deleteDishMutation.isPending}
						className="h-11 w-full rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500/20 hover:border-red-500 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<Trash2 className="w-4 h-4" />
						{deleteDishMutation.isPending ? 'Deleting...' : 'Delete Dish'}
					</button>
				) : (
					<div className="space-y-2 p-3 bg-red-500/5 border-2 border-red-500/20 rounded-xl">
						<p className="text-sm font-medium text-foreground text-center">
							Delete this dish permanently?
						</p>
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => setShowDeleteConfirm(false)}
								className="h-9 bg-background hover:bg-accent text-foreground border border-border rounded-lg font-medium text-sm transition-all"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleDeleteConfirm}
								disabled={deleteDishMutation.isPending}
								className="h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
							>
								<Trash2 className="w-3.5 h-3.5" />
								Confirm
							</button>
						</div>
					</div>
				)}
			</div>

			<UpdateDrawer
				open={updateDrawerOpen}
				onClose={closeUpdateDrawer}
				title="Update Dish"
				sections={dishUpdateConfig}
				dishData={dishQuery.data}
				isLoading={false}
			/>

			<ConfirmDialog
				open={openRemoveCategoryConfirm}
				onClose={() => setOpenRemoveCategoryConfirm(false)}
				onConfirm={() => {
					deleteCategoryFromDishMutation.mutate(id)
					setOpenRemoveCategoryConfirm(false)
				}}
				title="Remove Category"
				message="Do you really want to remove this category from the dish?"
				confirmText="Remove"
				cancelText="Cancel"
				type="warning"
			/>
		</>
	)
}

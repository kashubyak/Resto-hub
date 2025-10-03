'use client'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useDishes } from '@/hooks/useDishes'
import { Category, Delete, Edit, RemoveCircle } from '@mui/icons-material'
import { useState } from 'react'

export const DishActions = ({ id }: { id: number }) => {
	const { deleteDishMutation, deleteCategoryFromDishMutation } = useDishes()
	const [openConfirm, setOpenConfirm] = useState({
		deleteDish: false,
		removeCategory: false,
	})

	return (
		<div className='px-4 lg:px-6 lg:pr-0 py-6 bg-muted/30'>
			<div className='space-y-4'>
				<h3 className='text-base font-semibold text-foreground mb-4'>Actions</h3>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2'>
					<Button
						className='h-10 inline-flex items-center justify-center font-semibold'
						onClick={() => console.log('Update dish')}
					>
						<Edit className='w-4 h-4 mr-2' />
						Update Dish
					</Button>
					<Button
						className='h-10 inline-flex items-center justify-center font-semibold'
						onClick={() => console.log('Assign category')}
					>
						<Category className='w-4 h-4 mr-2' />
						Assign Category
					</Button>
					<Button
						className='h-10 inline-flex items-center justify-center font-semibold'
						onClick={() => console.log('Remove category')}
					>
						<RemoveCircle className='w-4 h-4 mr-2' />
						Remove Category
					</Button>
					<Button
						className='h-10 inline-flex items-center justify-center font-semibold bg-destructive hover:bg-destructive'
						onClick={() => setOpenConfirm(prev => ({ ...prev, deleteDish: true }))}
						disabled={deleteDishMutation.isPending}
					>
						<Delete className='w-4 h-4 mr-2' />
						{deleteDishMutation.isPending ? 'Deleting...' : 'Delete Dish'}
					</Button>
				</div>
			</div>
			<ConfirmDialog
				open={openConfirm.deleteDish}
				onClose={() => setOpenConfirm(prev => ({ ...prev, deleteDish: false }))}
				onConfirm={() => deleteDishMutation.mutate(id)}
				title='⚠️ Delete Dish'
				message='Are you sure you want to delete this dish?'
				confirmText='Delete'
				cancelText='Cancel'
				danger
			/>

			<ConfirmDialog
				open={openConfirm.removeCategory}
				onClose={() => setOpenConfirm(prev => ({ ...prev, removeCategory: false }))}
				onConfirm={() => deleteCategoryFromDishMutation.mutate(id)}
				title='⚠️ Remove Category'
				message='Do you really want to remove this category from the dish?'
				confirmText='Remove'
				cancelText='Cancel'
				danger={false}
			/>
		</div>
	)
}

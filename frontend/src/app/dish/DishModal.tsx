'use client'

import { UploadImage } from '@/components/elements/UploadImage'
import { Button } from '@/components/ui/Button'
import { IngredientsInput } from '@/components/ui/IngredientsInput'
import { Input } from '@/components/ui/Input'
import { useDishModal } from '@/hooks/useDishModal'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type DishModalProps = {
	open: boolean
	onClose: () => void
}

export const DishModal = ({ open, onClose }: DishModalProps) => {
	const { onSubmit, register, errors, handleSubmit, setValue } = useDishModal(onClose)

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			sx={{
				'& .MuiBackdrop-root': {
					backdropFilter: 'blur(3px)',
					backgroundColor: 'rgba(var(--background-rgb), 0.3)',
				},
				'& .MuiPaper-root': {
					maxWidth: 'none',
					minHeight: '90vh',
					borderRadius: '.625rem',
					backgroundColor: 'var(--secondary)',
					color: 'var(--foreground)',
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			<DialogTitle
				sx={{
					fontSize: '1.25rem',
					fontWeight: 'bold',
					borderBottom: '1px solid var(--border)',
				}}
			>
				Create dish
			</DialogTitle>

			<form onSubmit={handleSubmit(onSubmit)} className='flex flex-1 flex-col'>
				<DialogContent
					sx={{
						flex: 1,
						padding: '1.5rem',
						overflowY: 'auto',
						display: 'flex',
						flexDirection: 'column',
						'& > *:not(:last-child)': {
							marginBottom: '1rem',
						},
					}}
				>
					<Input
						register={register('name', {
							required: 'Dish name is required',
							minLength: { value: 2, message: 'At least 2 characters' },
							maxLength: { value: 100, message: 'Max 100 characters' },
						})}
						label='Dish name'
						error={errors.name?.message}
						type='text'
					/>

					<Input
						register={register('description', {
							required: 'Dish description is required',
							minLength: { value: 5, message: 'At least 5 characters' },
						})}
						label='Dish description'
						error={errors.description?.message}
						type='text'
					/>

					<Input
						register={register('price', {
							required: 'Dish price is required',
							valueAsNumber: true,
							min: { value: 1, message: 'Price must be greater than 0' },
						})}
						label='Price'
						type='number'
						error={errors.price?.message}
					/>

					<Input
						register={register('categoryId', {
							required: 'Dish category is required',
							valueAsNumber: true,
						})}
						label='Category ID'
						type='number'
						error={errors.categoryId?.message}
					/>
					<IngredientsInput
						setValue={setValue}
						error={errors.ingredients?.message}
						label='Ingredients'
					/>
					<UploadImage
						label='Dish image'
						register={register('imageUrl', {
							required: 'Dish image is required',
						})}
						error={errors.imageUrl?.message}
					/>

					<Input
						register={register('weightGr', {
							required: 'Dish weight is required',
							valueAsNumber: true,
							min: { value: 1, message: 'Weight must be greater than 0' },
						})}
						label='Weight (g)'
						type='number'
						error={errors.weightGr?.message}
					/>

					<Input
						register={register('calories', {
							required: 'Calories are required',
							valueAsNumber: true,
							min: { value: 1, message: 'Calories must be greater than 0' },
						})}
						label='Calories'
						type='number'
						error={errors.calories?.message}
					/>
				</DialogContent>

				<DialogActions
					sx={{
						display: 'flex',
						gap: '.75rem',
						padding: '1rem 1.5rem',
						borderTop: '1px solid var(--border)',
					}}
				>
					<Button type='button' text='Cancel' onClick={onClose} />
					<Button
						type='submit'
						text='Create'
						className='w-auto px-4 py-2 bg-success text-foreground hover:bg-success'
					/>
				</DialogActions>
			</form>
		</Dialog>
	)
}

'use client'

import { UploadImage } from '@/components/elements/UploadImage'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDishModal } from '@/hooks/useDishModal'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type DishModalProps = {
	open: boolean
	onClose: () => void
}

export const DishModal = ({ open, onClose }: DishModalProps) => {
	const { onSubmit, register, errors, handleSubmit } = useDishModal()
	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			sx={{
				'& .MuiBackdrop-root': {
					backdropFilter: 'blur(.1875rem)',
				},
				'& .MuiPaper-root': {
					maxWidth: 'none',
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
				}}
			>
				Create dish
			</DialogTitle>
			<DialogContent
				sx={{
					flex: 1,
					padding: '0 1.5rem',
					overflowY: 'auto',
				}}
			>
				<form className='py-1.5' onSubmit={handleSubmit(onSubmit)}>
					<Input
						register={register('name', {
							required: 'Dish name is required',
							validate: {},
						})}
						label='Dish name'
						error={errors.name?.message}
						type='text'
					/>
					<Input
						register={register('description', {
							required: 'Dish description is required',
							validate: {},
						})}
						label='Dish description'
						error={errors.description?.message}
						type='text'
					/>
					<Input
						register={register('price', {
							required: 'Dish price is required',
							validate: {},
						})}
						label='Dish price'
						error={errors.price?.message}
						type='text'
					/>
					<Input
						register={register('categoryId', {
							required: 'Dish category is required',
							validate: {},
						})}
						label='Dish category'
						error={errors.categoryId?.message}
						type='text'
					/>
					<UploadImage
						label='Dish Image'
						register={register('imageUrl')}
						error={errors.imageUrl?.message}
						// onDataChange={(preview, file) => handleImageData('image', preview, file)}
					/>
					<Input
						register={register('weightGr', {
							required: 'Dish weight is required',
							validate: {},
						})}
						label='Dish weight'
						error={errors.weightGr?.message}
						type='text'
					/>
					<Input
						register={register('calories', {
							required: 'Dish calories are required',
							validate: {},
						})}
						label='Dish calories'
						error={errors.calories?.message}
						type='text'
					/>
					<Input
						register={register('available', {
							required: 'Dish availability is required',
							validate: {},
						})}
						label='Dish availability'
						error={errors.available?.message}
						type='text'
					/>
					<DialogActions
						sx={{
							display: 'flex',
							gap: '.75rem',
							padding: '1rem 1.5rem',
							justifyContent: 'flex-end',
						}}
					>
						<Button type='button' text='Cancel' onClick={onClose} />
						<Button
							type='button'
							text='Create'
							onClick={() => {
								onClose()
							}}
							className='w-auto px-4 py-2 bg-success text-foreground hover:bg-success'
						/>
					</DialogActions>
				</form>
			</DialogContent>
		</Dialog>
	)
}

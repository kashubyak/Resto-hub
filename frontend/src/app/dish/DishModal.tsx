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
			maxWidth='md'
			sx={{
				'& .MuiBackdrop-root': {
					backdropFilter: 'blur(8px)',
					backgroundColor: 'rgba(var(--background-rgb), 0.3)',
				},
				'& .MuiPaper-root': {
					borderRadius: '16px',
					backgroundColor: 'var(--secondary)',
					color: 'var(--foreground)',
					maxHeight: '90vh',
				},
			}}
		>
			<DialogTitle
				sx={{
					fontSize: '1.5rem',
					fontWeight: 'bold',
					borderBottom: '1px solid var(--border)',
					padding: '1.5rem 2rem',
					background: 'linear-gradient(135deg, var(--secondary) 0%, var(--muted) 100%)',
				}}
			>
				🍽️ Create New Dish
			</DialogTitle>

			<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
				<DialogContent
					sx={{
						padding: '2rem',
						overflowY: 'auto',
						maxHeight: 'calc(90vh - 140px)',
					}}
				>
					<div className='mb-8'>
						<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
							📝 Basic Information
						</h3>
						<div className='grid grid-cols-1 gap-6'>
							<Input
								register={register('name', {
									required: 'Dish name is required',
									validate: {
										minLength: v =>
											v.trim().length >= 2 || 'Dish name must be at least 2 characters',
										maxLength: v =>
											v.trim().length <= 100 || 'Dish name can be at most 100 characters',
										noOnlySpaces: v =>
											v.trim().length > 0 || 'Dish name cannot be only spaces',
										validCharacters: v =>
											/^[\p{L}\p{N}\s\-&.,'()]+$/u.test(v) ||
											'Dish name can only contain letters, numbers, spaces, and basic punctuation',
										noConsecutiveSpaces: v =>
											!/\s{2,}/.test(v) || 'Dish name cannot have consecutive spaces',
										startsWithLetter: v =>
											/^[\p{L}]/u.test(v) || 'Dish name must start with a letter',
									},
								})}
								label='Dish Name'
								error={errors.name?.message}
								type='text'
							/>

							<Input
								register={register('description', {
									required: 'Dish description is required',
									validate: {
										minLength: v =>
											v.trim().length >= 5 || 'Description must be at least 5 characters',
										maxLength: v =>
											v.trim().length <= 500 ||
											'Description can be at most 500 characters',
										noOnlySpaces: v =>
											v.trim().length > 0 || 'Description cannot be only spaces',
										validCharacters: v =>
											/^[\p{L}\p{N}\s\-&.,'()!?]+$/u.test(v) ||
											'Description can only contain letters, numbers, spaces, and basic punctuation',
										noConsecutiveSpaces: v =>
											!/\s{2,}/.test(v) || 'Description cannot have consecutive spaces',
									},
								})}
								label='Dish Description'
								error={errors.description?.message}
								type='text'
							/>
						</div>
					</div>

					<div className='mb-8'>
						<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
							💰 Pricing & Category
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<Input
								register={register('price', {
									required: 'Dish price is required',
									valueAsNumber: true,
									validate: {
										isPositive: v => v > 0 || 'Price must be greater than 0',
										isNumber: v => !isNaN(v) || 'Price must be a number',
									},
								})}
								label='Price ($)'
								type='number'
								error={errors.price?.message}
							/>

							<Input
								register={register('categoryId', {
									required: 'Category ID is required',
									valueAsNumber: true,
									validate: {
										isPositive: v => v > 0 || 'Category ID must be greater than 0',
										isInteger: v =>
											Number.isInteger(v) || 'Category ID must be an integer',
									},
								})}
								label='Category ID'
								type='number'
								error={errors.categoryId?.message}
							/>
						</div>
					</div>

					<div className='mb-8'>
						<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
							🥕 Ingredients
						</h3>
						<div className='rounded-lg p-4 border border-border'>
							<IngredientsInput
								setValue={setValue}
								error={errors.ingredients?.message}
								label='Add ingredients'
								register={register('ingredients', {
									required: 'At least one ingredient is required',
									validate: {
										notEmpty: v =>
											(Array.isArray(v) && v.length > 0) ||
											'Please add at least one ingredient',
										validEach: v =>
											v.every(
												(i: string) =>
													/^[\p{L}\s\-&.,'()]+$/u.test(i) &&
													i.trim().length >= 2 &&
													i.trim().length <= 50,
											) ||
											'Each ingredient must be 2–50 chars and contain only valid characters',
										noDuplicates: v =>
											new Set(v.map(i => i.toLowerCase())).size === v.length ||
											'Ingredients must not contain duplicates',
									},
								})}
							/>
						</div>
					</div>

					<div className='mb-8'>
						<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
							📸 Dish Image
						</h3>
						<div className='rounded-lg p-4 border border-border'>
							<UploadImage
								label='Upload dish image'
								register={register('imageUrl', {
									required: 'Dish image is required',
									validate: {
										validType: v =>
											!v?.[0] ||
											['image/jpeg', 'image/png', 'image/webp'].includes(v[0].type) ||
											'Only JPG, PNG, or WebP allowed',
									},
								})}
								error={errors.imageUrl?.message}
							/>
						</div>
					</div>

					<div className='mb-6'>
						<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
							📊 Nutritional Information
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<Input
								register={register('weightGr', {
									required: 'Dish weight is required',
									valueAsNumber: true,
									validate: {
										isPositive: v => v > 0 || 'Weight must be greater than 0',
										maxValue: v => v <= 100000 || 'Weight is too large',
									},
								})}
								label='Weight (grams)'
								type='number'
								error={errors.weightGr?.message}
							/>

							<Input
								register={register('calories', {
									required: 'Calories are required',
									valueAsNumber: true,
									validate: {
										isPositive: v => v > 0 || 'Calories must be greater than 0',
										maxValue: v => v <= 5000 || 'Calories value is unrealistic',
									},
								})}
								label='Calories'
								type='number'
								error={errors.calories?.message}
							/>
						</div>
					</div>
				</DialogContent>

				<DialogActions
					sx={{
						padding: '1.5rem 2rem',
						gap: '1rem',
						justifyContent: 'flex-end',
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

'use client'

import { Button } from '@/components/ui/Button'
import { useDishModal } from '@/hooks/useDishModal'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { BasicInformationSection } from './components/BasicInformationSection'
import { ImageUploadSection } from './components/ImageUploadSection'
import { IngredientsSection } from './components/IngredientsSection'
import { NutritionalInfoSection } from './components/NutritionalInfoSection'
import { PricingCategorySection } from './components/PricingCategorySection'

type DishModalProps = {
	open: boolean
	onClose: () => void
}

export const DishModal = ({ open, onClose }: DishModalProps) => {
	const { onSubmit, register, errors, handleSubmit, control, setError, clearErrors } = useDishModal(onClose)

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
					height: '90vh',
					display: 'flex',
					flexDirection: 'column',
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

			<form onSubmit={handleSubmit(onSubmit)} className='flex flex-1 flex-col'>
				<DialogContent
					sx={{
						padding: '2rem',
						flex: 1,
						overflow: 'hidden',
					}}
				>
					<div className='h-full overflow-y-auto'>
						<BasicInformationSection register={register} errors={errors} />
						<PricingCategorySection register={register} errors={errors} />
						<IngredientsSection
							control={control}
							errors={errors}
							setError={setError}
							clearErrors={clearErrors}
						/>

						<ImageUploadSection register={register} errors={errors} />
						<NutritionalInfoSection register={register} errors={errors} />
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

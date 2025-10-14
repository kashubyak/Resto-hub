'use client'

import { BasicInformationSection } from '@/app/dish/components/modal/BasicInformationSection'
import { ImageUploadSection } from '@/app/dish/components/modal/ImageUploadSection'
import { IngredientsSection } from '@/app/dish/components/modal/IngredientsSection'
import { NutritionalInfoSection } from '@/app/dish/components/modal/NutritionalInfoSection'
import { PricingCategorySection } from '@/app/dish/components/modal/PricingCategorySection'
import { useUpdateDish } from '@/hooks/useUpdateDish'
import type { IDish } from '@/types/dish.interface'
import type { UpdateSectionConfig } from '@/types/update-field.interface'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Drawer, IconButton } from '@mui/material'
import { memo, useCallback } from 'react'
import { Button } from '../../ui/Button'

interface UpdateDrawerProps {
	open: boolean
	onClose: () => void
	title: string
	sections: UpdateSectionConfig[]
	dishData?: IDish
	isLoading?: boolean
}

const drawerSx = {
	'& .MuiDrawer-paper': {
		width: {
			xs: '100%',
			sm: '400px',
			md: '33.333%',
		},
		maxWidth: '500px',
		backgroundColor: 'var(--background)',
		color: 'var(--foreground)',
		padding: 0,
		boxShadow: '-4px 0 20px var(--shadow)',
	},
	'& .MuiBackdrop-root': {
		backgroundColor: 'rgba(var(--background-rgb), 0.3)',
		backdropFilter: 'blur(8px)',
	},
}

const iconButtonSx = {
	color: 'var(--muted-foreground)',
	'&:hover': {
		color: 'var(--foreground)',
		backgroundColor: 'var(--muted-hover)',
	},
}

const UpdateDrawerComponent: React.FC<UpdateDrawerProps> = ({
	open,
	onClose,
	title,
	sections,
	dishData,
	isLoading = false,
}) => {
	const {
		onSubmit,
		handleSubmit,
		control,
		errors,
		watch,
		isDirty,
		reset,
		setError,
		clearErrors,
	} = useUpdateDish(dishData, onClose)

	const handleReset = useCallback(() => {
		if (dishData) {
			reset({
				name: dishData.name,
				description: dishData.description,
				price: dishData.price,
				categoryId: dishData.categoryId || undefined,
				ingredients: dishData.ingredients,
				weightGr: dishData.weightGr || undefined,
				calories: dishData.calories || undefined,
				available: dishData.available,
			})
		}
	}, [dishData, reset])

	const handleFormSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault()
			console.log('Form submit triggered')
			console.log('Errors:', errors)
			console.log('isDirty:', isDirty)

			await handleSubmit(onSubmit)(e)
		},
		[handleSubmit, onSubmit, errors, isDirty],
	)

	const renderSection = useCallback(
		(config: UpdateSectionConfig) => {
			switch (config.type) {
				case 'basic-info':
					return (
						<BasicInformationSection
							key={config.type}
							control={control}
							errors={errors}
							watch={watch}
							mode='update'
						/>
					)
				case 'pricing':
					return (
						<PricingCategorySection
							key={config.type}
							control={control}
							errors={errors}
							mode='update'
						/>
					)
				case 'ingredients':
					return (
						<IngredientsSection
							key={config.type}
							control={control}
							errors={errors}
							setError={setError}
							clearErrors={clearErrors}
						/>
					)
				case 'nutritional':
					return (
						<NutritionalInfoSection
							key={config.type}
							control={control}
							errors={errors}
							mode='update'
						/>
					)
				case 'image':
					return (
						<ImageUploadSection
							key={config.type}
							control={control}
							errors={errors}
							mode='update'
							currentImageUrl={dishData?.imageUrl ?? null}
						/>
					)
				default:
					return null
			}
		},
		[control, errors, watch, setError, clearErrors, dishData?.imageUrl],
	)

	return (
		<Drawer anchor='right' open={open} onClose={onClose} sx={drawerSx}>
			<form onSubmit={handleFormSubmit} className='flex flex-col h-full'>
				<div className='flex items-center justify-between p-4 border-b border-border'>
					<h2 className='text-xl font-bold flex items-center gap-2'>
						<EditIcon />
						{title}
					</h2>
					<IconButton
						onClick={onClose}
						size='small'
						aria-label='close drawer'
						sx={iconButtonSx}
					>
						<CloseIcon />
					</IconButton>
				</div>

				<div className='flex-1 overflow-y-auto p-4'>
					<div className='space-y-6'>{sections.map(renderSection)}</div>
				</div>

				<div className='p-4 border-t border-border space-y-2'>
					<div className='flex justify-between gap-2'>
						<Button type='button' onClick={onClose} text='Cancel' disabled={isLoading} />
						<Button type='submit' text='Update dish' disabled={isLoading || !isDirty} />
					</div>
					{isDirty && (
						<Button type='button' onClick={handleReset} disabled={isLoading}>
							<RestartAltIcon fontSize='small' />
							Reset to Initial
						</Button>
					)}
				</div>
			</form>
		</Drawer>
	)
}

export const UpdateDrawer = memo(UpdateDrawerComponent)

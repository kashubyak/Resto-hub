'use client'

import { BasicInformationSection } from '@/app/dish/components/modal/BasicInformationSection'
import { ImageUploadSection } from '@/app/dish/components/modal/ImageUploadSection'
import { IngredientsSection } from '@/app/dish/components/modal/IngredientsSection'
import { NutritionalInfoSection } from '@/app/dish/components/modal/NutritionalInfoSection'
import { PricingCategorySection } from '@/app/dish/components/modal/PricingCategorySection'
import { useUpdateDish } from '@/hooks/useUpdateDish'
import type { IDish } from '@/types/dish.interface'
import type { UpdateSectionConfig } from '@/types/update-field.interface'
import { Edit, RotateCcw, X } from 'lucide-react'
import { memo, useCallback, useEffect } from 'react'

interface UpdateDrawerProps {
	open: boolean
	onClose: () => void
	title: string
	sections: UpdateSectionConfig[]
	dishData?: IDish
	isLoading?: boolean
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
		trigger,
	} = useUpdateDish(dishData, onClose)

	useEffect(() => {
		if (open) document.body.style.overflow = 'hidden'
		else document.body.style.overflow = ''
		return () => {
			document.body.style.overflow = ''
		}
	}, [open])

	const handleReset = useCallback(() => {
		if (dishData) {
			reset({
				name: dishData.name,
				description: dishData.description,
				price: dishData.price,
				categoryId: dishData.categoryId ?? undefined,
				ingredients: dishData.ingredients,
				weightGr: dishData.weightGr ?? undefined,
				calories: dishData.calories ?? undefined,
				available: dishData.available,
			})
		}
	}, [dishData, reset])

	const handleFormSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault()
			await handleSubmit(onSubmit)(e)
		},
		[handleSubmit, onSubmit],
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
							mode="update"
						/>
					)
				case 'pricing':
					return (
						<PricingCategorySection
							key={config.type}
							control={control}
							mode="update"
							trigger={trigger}
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
							mode="update"
						/>
					)
				case 'nutritional':
					return (
						<NutritionalInfoSection
							key={config.type}
							control={control}
							errors={errors}
							mode="update"
						/>
					)
				case 'image':
					return (
						<ImageUploadSection
							key={config.type}
							control={control}
							errors={errors}
							mode="update"
							currentImageUrl={dishData?.imageUrl ?? null}
						/>
					)
				default:
					return null
			}
		},
		[
			control,
			errors,
			watch,
			setError,
			clearErrors,
			dishData?.imageUrl,
			trigger,
		],
	)

	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-end">
			<button
				type="button"
				aria-label="Close drawer"
				onClick={onClose}
				className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300"
			/>
			<div className="relative w-full sm:w-[480px] md:w-[560px] h-full bg-card shadow-2xl flex flex-col animate-in slide-in-from-right-10 duration-300">
				<div className="sticky top-0 z-10 bg-card border-b-2 border-border px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
							<Edit className="w-5 h-5 text-primary" />
						</div>
						<h2 className="text-xl font-bold text-foreground">{title}</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close drawer"
						className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
					>
						<X className="w-5 h-5 text-muted-foreground" />
					</button>
				</div>

				<form
					onSubmit={(e) => {
						void handleFormSubmit(e)
					}}
					className="flex-1 overflow-y-auto flex flex-col min-h-0"
				>
					<div className="p-6 space-y-6">{sections.map(renderSection)}</div>

					<div className="sticky bottom-0 bg-card border-t-2 border-border px-6 py-4 flex flex-col gap-3">
						<div className="flex gap-3">
							<button
								type="button"
								onClick={onClose}
								disabled={isLoading}
								className="flex-1 h-11 bg-background hover:bg-accent text-foreground border-2 border-border rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isLoading || !isDirty}
								className="flex-1 h-11 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Update dish
							</button>
						</div>
						{isDirty && (
							<button
								type="button"
								onClick={handleReset}
								disabled={isLoading}
								className="h-11 w-full bg-background hover:bg-accent text-foreground border-2 border-border rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
							>
								<RotateCcw className="w-4 h-4" />
								Reset to Initial
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	)
}

export const UpdateDrawer = memo(UpdateDrawerComponent)

'use client'

import type { IDishFormValues } from '@/types/dish.interface'
import { useMediaQuery, useTheme } from '@mui/material'
import { memo } from 'react'
import { type Control, type UseFormRegister } from 'react-hook-form'
import { AvailabilityRadio } from './AvailabilityRadio'
import { CategoryInput } from './CategoryInput'
import { PriceInput } from './PriceInput'

type PricingCategorySectionProps = {
	register?: UseFormRegister<IDishFormValues>
	control: Control<IDishFormValues>
	mode?: 'create' | 'update'
	trigger?: (field: keyof IDishFormValues) => Promise<boolean>
}

const PricingCategorySectionFunction = ({
	register,
	control,
	mode = 'create',
	trigger,
}: PricingCategorySectionProps) => {
	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<div className={isFullScreen ? 'mb-4' : 'mb-6'}>
			<h3
				className={`${isFullScreen ? 'text-base' : 'text-lg'} font-semibold ${
					isFullScreen ? 'mb-3' : 'mb-4'
				} text-foreground flex items-center gap-2`}
			>
				💰 Pricing & Category
			</h3>
			<div
				className={`grid ${
					isFullScreen || mode === 'update'
						? 'grid-cols-1 gap-4'
						: 'grid-cols-1 md:grid-cols-2 gap-6'
				}`}
			>
				<PriceInput register={register} control={control} mode={mode} trigger={trigger} />
				<CategoryInput control={control} />
			</div>

			<div className={isFullScreen ? 'mt-4' : 'mt-6'}>
				<AvailabilityRadio control={control} />
			</div>
		</div>
	)
}

export const PricingCategorySection = memo(PricingCategorySectionFunction)

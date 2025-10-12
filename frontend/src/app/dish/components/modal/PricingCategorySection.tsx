'use client'

import { Input } from '@/components/ui/Input'
import type { IDishFormValues } from '@/types/dish.interface'
import { categoryIdValidation, priceValidation } from '@/validation/dish.validation'
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import { memo } from 'react'
import {
	Controller,
	type Control,
	type FieldErrors,
	type UseFormRegister,
} from 'react-hook-form'

type PricingCategorySectionProps = {
	register?: UseFormRegister<IDishFormValues>
	control: Control<IDishFormValues>
	errors: FieldErrors<IDishFormValues>
	mode?: 'create' | 'update'
}

const PricingCategorySectionFunction = ({
	register,
	control,
	errors,
	mode = 'create',
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
				{mode === 'create' && register ? (
					<>
						<Input
							register={register('price', priceValidation)}
							label='Price ($)'
							type='number'
							error={errors.price?.message}
						/>
						<Input
							register={register('categoryId', categoryIdValidation)}
							label='Category ID'
							type='number'
							error={errors.categoryId?.message}
						/>
					</>
				) : (
					<>
						<Controller
							name='price'
							control={control}
							rules={priceValidation}
							render={({ field }) => (
								<Input
									{...field}
									label='Price ($)'
									type='number'
									error={errors.price?.message}
								/>
							)}
						/>
						<Controller
							name='categoryId'
							control={control}
							rules={categoryIdValidation}
							render={({ field }) => (
								<Input
									{...field}
									label='Category ID'
									type='number'
									error={errors.categoryId?.message}
								/>
							)}
						/>
					</>
				)}
			</div>

			<div className={isFullScreen ? 'mt-4' : 'mt-6'}>
				<Controller
					name='available'
					control={control}
					defaultValue={true}
					render={({ field: { value, onChange } }) => (
						<FormControl component='fieldset'>
							<FormLabel
								component='legend'
								sx={{
									color: 'var(--foreground)',
									fontSize: '1rem',
									fontWeight: 600,
									marginBottom: '0.75rem',
									whiteSpace: 'nowrap',
									'&.Mui-focused': {
										color: 'var(--foreground)',
									},
								}}
							>
								🍽️ Dish Availability
							</FormLabel>
							<RadioGroup
								value={value}
								onChange={e => onChange(e.target.value === 'true')}
								row={!isFullScreen}
								sx={{
									gap: isFullScreen ? '0.5rem' : '1rem',
									flexDirection: 'row',
								}}
							>
								<FormControlLabel
									value={true}
									control={
										<Radio
											sx={{
												color: 'var(--muted-foreground)',
												'&.Mui-checked': {
													color: 'var(--success)',
												},
												'&:hover': {
													backgroundColor:
														'color-mix(in oklab, var(--success) 10%, transparent)',
												},
											}}
										/>
									}
									label='Available'
									sx={{
										'& .MuiFormControlLabel-label': {
											color: 'var(--foreground)',
											fontSize: isFullScreen ? '0.875rem' : '0.95rem',
											fontWeight: value === true ? 600 : 400,
										},
										margin: 0,
									}}
								/>
								<FormControlLabel
									value={false}
									control={
										<Radio
											sx={{
												color: 'var(--muted-foreground)',
												'&.Mui-checked': {
													color: 'var(--destructive)',
												},
												'&:hover': {
													backgroundColor:
														'color-mix(in oklab, var(--destructive) 10%, transparent)',
												},
											}}
										/>
									}
									label='Not Available'
									sx={{
										'& .MuiFormControlLabel-label': {
											color: 'var(--foreground)',
											fontSize: isFullScreen ? '0.875rem' : '0.95rem',
											fontWeight: value === false ? 600 : 400,
										},
										margin: 0,
									}}
								/>
							</RadioGroup>
						</FormControl>
					)}
				/>
			</div>
		</div>
	)
}

export const PricingCategorySection = memo(PricingCategorySectionFunction)

'use client'

import { Input } from '@/components/ui/Input'
import type { IDishFormValues } from '@/types/dish.interface'
import {
	caloriesValidation,
	weightValidation,
} from '@/validation/dish.validation'
import { Scale } from 'lucide-react'
import { useMediaQuery, useTheme } from '@mui/material'
import { memo } from 'react'
import {
	Controller,
	type Control,
	type FieldErrors,
	type UseFormRegister,
} from 'react-hook-form'

type NutritionalInfoSectionProps = {
	register?: UseFormRegister<IDishFormValues>
	control?: Control<IDishFormValues>
	errors: FieldErrors<IDishFormValues>
	mode?: 'create' | 'update'
}

const NutritionalInfoSectionFunction = ({
	register,
	control,
	errors,
	mode = 'create',
}: NutritionalInfoSectionProps) => {
	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	const inputClass =
		'w-full h-11 px-3 bg-background border-2 border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all'
	const labelClass = 'text-xs font-medium text-muted-foreground'

	if (mode === 'update' && control) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
					<Scale className="w-4 h-4 text-primary" />
					Nutritional Information
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<label className={labelClass}>Weight (g)</label>
						<Controller
							name="weightGr"
							control={control}
							rules={weightValidation}
							render={({ field }) => (
								<input
									{...field}
									type="number"
									min={0}
									value={field.value ?? ''}
									onChange={(e) => {
										const v = e.target.value
										field.onChange(v === '' ? undefined : Number(v))
									}}
									className={inputClass}
								/>
							)}
						/>
						{errors.weightGr?.message && (
							<span className="text-sm text-[var(--destructive)]">
								{errors.weightGr.message}
							</span>
						)}
					</div>
					<div className="space-y-1">
						<label className={labelClass}>Calories</label>
						<Controller
							name="calories"
							control={control}
							rules={caloriesValidation}
							render={({ field }) => (
								<input
									{...field}
									type="number"
									min={0}
									value={field.value ?? ''}
									onChange={(e) => {
										const v = e.target.value
										field.onChange(v === '' ? undefined : Number(v))
									}}
									className={inputClass}
								/>
							)}
						/>
						{errors.calories?.message && (
							<span className="text-sm text-[var(--destructive)]">
								{errors.calories.message}
							</span>
						)}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div>
			<h3
				className={`${isFullScreen ? 'text-base' : 'text-lg'} font-semibold ${
					isFullScreen ? 'mb-3' : 'mb-4'
				} text-foreground flex items-center gap-2`}
			>
				📊 Nutritional Information
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
							register={register('weightGr', weightValidation)}
							label="Weight (grams)"
							type="number"
							error={errors.weightGr?.message}
						/>

						<Input
							register={register('calories', caloriesValidation)}
							label="Calories"
							type="number"
							error={errors.calories?.message}
						/>
					</>
				) : (
					control && (
						<>
							<Controller
								name="weightGr"
								control={control}
								rules={weightValidation}
								render={({ field }) => (
									<Input
										{...field}
										label="Weight (grams)"
										type="number"
										error={errors.weightGr?.message}
									/>
								)}
							/>
							<Controller
								name="calories"
								control={control}
								rules={caloriesValidation}
								render={({ field }) => (
									<Input
										{...field}
										label="Calories"
										type="number"
										error={errors.calories?.message}
									/>
								)}
							/>
						</>
					)
				)}
			</div>
		</div>
	)
}
export const NutritionalInfoSection = memo(NutritionalInfoSectionFunction)

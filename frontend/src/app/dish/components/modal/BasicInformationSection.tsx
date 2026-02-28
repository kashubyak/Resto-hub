'use client'

import { Input } from '@/components/ui/Input'
import type { IDishFormValues } from '@/types/dish.interface'
import { dishNameValidation } from '@/validation/dish.validation'
import { Tag } from 'lucide-react'
import { useMediaQuery, useTheme } from '@mui/material'
import { useMemo } from 'react'
import type {
	Control,
	FieldErrors,
	UseFormRegister,
	UseFormWatch,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'

interface BasicInformationSectionProps {
	register?: UseFormRegister<IDishFormValues>
	control?: Control<IDishFormValues>
	errors: FieldErrors<IDishFormValues>
	watch?: UseFormWatch<IDishFormValues>
	mode?: 'create' | 'update'
}

const maxDescriptionLength = 1500

export const BasicInformationSection = ({
	register,
	control,
	errors,
	watch,
	mode = 'create',
}: BasicInformationSectionProps) => {
	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	const descriptionValue = useMemo(() => {
		if (watch) return watch('description') || ''
		return ''
	}, [watch])

	const descriptionLength = descriptionValue.length

	if (mode === 'update' && control) {
		const inputClass =
			'w-full h-11 px-3 bg-background border-2 border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
		const labelClass = 'text-xs font-medium text-muted-foreground'
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
					<Tag className="w-4 h-4 text-primary" />
					Basic Information
				</div>

				<div className="space-y-1">
					<label className={labelClass}>Dish Name</label>
					<Controller
						name="name"
						control={control}
						rules={dishNameValidation}
						render={({ field }) => (
							<input {...field} type="text" className={inputClass} />
						)}
					/>
					{errors.name?.message && (
						<span className="text-sm text-[var(--destructive)]">
							{errors.name.message}
						</span>
					)}
				</div>

				<div className="space-y-1">
					<label className={`${labelClass} flex items-center justify-between`}>
						<span>Dish Description</span>
						<span>
							{descriptionLength} / {maxDescriptionLength}
						</span>
					</label>
					<Controller
						name="description"
						control={control}
						rules={{
							required: 'Dish description is required',
							validate: {
								minLength: (v) =>
									v.trim().length >= 5 ||
									'Description must be at least 5 characters',
								maxLength: (v) =>
									v.trim().length <= maxDescriptionLength ||
									`Description can be at most ${maxDescriptionLength} characters`,
								noOnlySpaces: (v) =>
									v.trim().length > 0 || 'Description cannot be only spaces',
							},
						}}
						render={({ field }) => (
							<textarea
								{...field}
								rows={4}
								maxLength={maxDescriptionLength}
								className="w-full px-3 py-2 bg-background border-2 border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
							/>
						)}
					/>
					{errors.description?.message && (
						<span className="text-sm text-[var(--destructive)]">
							{errors.description.message}
						</span>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className={isFullScreen ? 'mb-4' : 'mb-6'}>
			<h3
				className={`${isFullScreen ? 'text-base' : 'text-lg'} font-semibold ${
					isFullScreen ? 'mb-3' : 'mb-4'
				} text-foreground flex items-center gap-2`}
			>
				📝 Basic Information
			</h3>
			<div className="grid grid-cols-1 gap-4">
				{mode === 'create' && register ? (
					<Input
						register={register('name', dishNameValidation)}
						label="Dish Name"
						error={errors.name?.message}
					/>
				) : (
					control && (
						<Controller
							name="name"
							control={control}
							rules={dishNameValidation}
							render={({ field }) => (
								<Input
									{...field}
									label="Dish Name"
									error={errors.name?.message}
								/>
							)}
						/>
					)
				)}

				<div className="relative">
					{mode === 'create' && register ? (
						<Input
							register={register('description', {
								required: 'Dish description is required',
								validate: {
									minLength: (v) =>
										v.trim().length >= 5 ||
										'Description must be at least 5 characters',
									maxLength: (v) =>
										v.trim().length <= maxDescriptionLength ||
										`Description can be at most ${maxDescriptionLength} characters`,
									noOnlySpaces: (v) =>
										v.trim().length > 0 || 'Description cannot be only spaces',
								},
							})}
							label="Dish Description"
							error={errors.description?.message}
							multiline
							rows={isFullScreen ? 3 : 4}
						/>
					) : (
						control && (
							<Controller
								name="description"
								control={control}
								rules={{
									required: 'Dish description is required',
									validate: {
										minLength: (v) =>
											v.trim().length >= 5 ||
											'Description must be at least 5 characters',
										maxLength: (v) =>
											v.trim().length <= maxDescriptionLength ||
											`Description can be at most ${maxDescriptionLength} characters`,
										noOnlySpaces: (v) =>
											v.trim().length > 0 ||
											'Description cannot be only spaces',
									},
								}}
								render={({ field }) => (
									<Input
										{...field}
										label="Dish Description"
										error={errors.description?.message}
										multiline
										rows={isFullScreen ? 3 : 4}
									/>
								)}
							/>
						)
					)}

					<p className="text-xs text-secondary-foreground mt-1 text-right">
						{descriptionLength} / {maxDescriptionLength}
					</p>
				</div>
			</div>
		</div>
	)
}

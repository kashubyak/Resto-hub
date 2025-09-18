'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { Chip, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import {
	Controller,
	type Control,
	type FieldErrors,
	type UseFormClearErrors,
	type UseFormSetError,
} from 'react-hook-form'

type IngredientsSectionProps = {
	control: Control<IFormValues>
	errors: FieldErrors<IFormValues>
	setError: UseFormSetError<IFormValues>
	clearErrors: UseFormClearErrors<IFormValues>
}

export const IngredientsSection = ({
	control,
	errors,
	setError,
	clearErrors,
}: IngredientsSectionProps) => {
	const [inputValue, setInputValue] = useState('')
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))

	return (
		<div className={isMobile ? 'mb-4' : 'mb-6'}>
			<h3
				className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold ${
					isMobile ? 'mb-3' : 'mb-4'
				} text-foreground flex items-center gap-2`}
			>
				🥕 Ingredients
			</h3>

			<Controller
				name='ingredients'
				control={control}
				defaultValue={[]}
				rules={{
					required: 'At least one ingredient is required',
					validate: value => value.length > 0 || 'At least one ingredient is required',
				}}
				render={({ field: { value, onChange } }) => {
					const handleAdd = () => {
						const val = inputValue.trim()

						if (!val) {
							setError('ingredients', {
								type: 'required',
								message: 'Ingredient is required',
							})
							return
						}

						if (value.includes(val)) {
							setError('ingredients', {
								type: 'duplicate',
								message: 'Duplicate ingredients are not allowed',
							})
							return
						}

						if (!/^[\p{L}\p{N}\s\-&,.'()]{2,50}$/u.test(val)) {
							setError('ingredients', {
								type: 'pattern',
								message: 'Invalid ingredient format (2–50 chars)',
							})
							return
						}

						onChange([...value, val])
						setInputValue('')
						clearErrors('ingredients')
					}

					const handleDelete = (ingredient: string) => {
						const updated = value.filter(i => i !== ingredient)
						onChange(updated)

						if (updated.length === 0) {
							setError('ingredients', {
								type: 'required',
								message: 'At least one ingredient is required',
							})
						} else {
							clearErrors('ingredients')
						}
					}

					return (
						<div className='w-full'>
							<div
								className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-2 items-start'}`}
							>
								<div className='flex-1'>
									<Input
										label='Add ingredient'
										value={inputValue}
										error={errors.ingredients?.message as string}
										onChange={e => setInputValue(e.target.value)}
										onKeyDown={e => {
											if (e.key === 'Enter') {
												e.preventDefault()
												handleAdd()
											}
										}}
									/>
								</div>
								<IconButton
									onClick={handleAdd}
									sx={{
										mt: isMobile ? 0 : 1,
										alignSelf: isMobile ? 'center' : 'flex-start',
										borderRadius: '8px',
										backgroundColor: 'var(--primary)',
										color: 'var(--background)',
										width: isMobile ? '100%' : 'auto',
										height: isMobile ? '40px' : 'auto',
										'&:hover': {
											backgroundColor: 'var(--primary-hover)',
										},
									}}
								>
									<AddIcon />
									{isMobile && <span className='ml-2 text-sm'>Add Ingredient</span>}
								</IconButton>
							</div>

							<div className={`flex flex-wrap gap-2 ${isMobile ? 'mt-2' : 'mt-3'}`}>
								{value.map((ingredient: string, idx: number) => (
									<Chip
										key={idx}
										label={ingredient}
										onDelete={() => handleDelete(ingredient)}
										deleteIcon={<CloseIcon />}
										size={isMobile ? 'small' : 'medium'}
										sx={{
											backgroundColor: 'var(--active-item)',
											color: 'var(--foreground)',
											borderRadius: '8px',
											fontSize: isMobile ? '0.8rem' : '0.9rem',
											'& .MuiChip-deleteIcon': {
												color: 'var(--foreground)',
												fontSize: isMobile ? '1rem' : '1.2rem',
												'&:hover': { color: 'var(--destructive)' },
											},
										}}
									/>
								))}
							</div>
						</div>
					)
				}}
			/>
		</div>
	)
}

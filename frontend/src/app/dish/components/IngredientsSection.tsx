'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { Chip, IconButton } from '@mui/material'
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

	return (
		<div className='mb-6'>
			<h3 className='text-lg font-semibold mb-4 text-foreground flex items-center gap-2'>
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
							<div className='flex items-start gap-2'>
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
								<IconButton
									onClick={handleAdd}
									className='mt-1 rounded-lg bg-primary text-background hover:bg-primary/80'
								>
									<AddIcon />
								</IconButton>
							</div>

							<div className='flex flex-wrap gap-2 mt-3'>
								{value.map((ingredient: string, idx: number) => (
									<Chip
										key={idx}
										label={ingredient}
										onDelete={() => handleDelete(ingredient)}
										deleteIcon={<CloseIcon />}
										className='bg-muted text-foreground'
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

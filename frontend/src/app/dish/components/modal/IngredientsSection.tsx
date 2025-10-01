'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import AddIcon from '@mui/icons-material/Add'
import { IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import {
	Controller,
	type Control,
	type FieldErrors,
	type UseFormClearErrors,
	type UseFormSetError,
} from 'react-hook-form'
import { IngredientChip } from './IngredientChip'

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
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
	const dragCounter = useRef(0)

	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	const handleAdd = useCallback(
		(value: string[], onChange: (newValue: string[]) => void) => {
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
		},
		[inputValue, setError, clearErrors],
	)

	const handleDelete = useCallback(
		(ingredient: string, value: string[], onChange: (newValue: string[]) => void) => {
			const updated = value.filter(i => i !== ingredient)
			onChange(updated)

			if (updated.length === 0)
				setError('ingredients', {
					type: 'required',
					message: 'At least one ingredient is required',
				})
			else clearErrors('ingredients')
		},
		[setError, clearErrors],
	)

	const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
		e.stopPropagation()
		setDraggedIndex(index)
		e.dataTransfer.effectAllowed = 'move'
		e.dataTransfer.setData('application/ingredient-drag', 'true')
		setTimeout(() => {
			;(e.currentTarget as HTMLElement).style.opacity = '0.5'
		}, 0)
	}, [])

	const handleDragEnd = useCallback((e: React.DragEvent) => {
		e.stopPropagation()
		setDraggedIndex(null)
		setDragOverIndex(null)
		dragCounter.current = 0
		;(e.currentTarget as HTMLElement).style.opacity = '1'
	}, [])

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		e.dataTransfer.dropEffect = 'move'
	}, [])

	const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current++
		setDragOverIndex(index)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.stopPropagation()
		dragCounter.current--
		if (dragCounter.current === 0) setDragOverIndex(null)
	}, [])

	const handleDrop = useCallback(
		(
			e: React.DragEvent,
			dropIndex: number,
			value: string[],
			onChange: (newValue: string[]) => void,
		) => {
			e.preventDefault()
			e.stopPropagation()

			if (draggedIndex === null || draggedIndex === dropIndex) return

			const newIngredients = [...value]
			const draggedItem = newIngredients[draggedIndex]

			newIngredients.splice(draggedIndex, 1)
			newIngredients.splice(dropIndex, 0, draggedItem)

			onChange(newIngredients)
			setDraggedIndex(null)
			setDragOverIndex(null)
			dragCounter.current = 0
		},
		[draggedIndex],
	)

	return (
		<div className={isFullScreen ? 'mb-4' : 'mb-6'}>
			<h3
				className={`${isFullScreen ? 'text-base' : 'text-lg'} font-semibold ${
					isFullScreen ? 'mb-3' : 'mb-4'
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
				render={({ field: { value, onChange } }) => (
					<div className='w-full'>
						<div
							className={`flex ${isFullScreen ? 'flex-col gap-2' : 'gap-2 items-start'}`}
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
											handleAdd(value, onChange)
										}
									}}
								/>
							</div>
							<IconButton
								onClick={() => handleAdd(value, onChange)}
								sx={{
									mt: isFullScreen ? 0 : 1,
									alignSelf: isFullScreen ? 'center' : 'flex-start',
									borderRadius: '8px',
									backgroundColor: 'var(--primary)',
									color: 'var(--background)',
									width: isFullScreen ? '100%' : 'auto',
									height: isFullScreen ? '40px' : 'auto',
									'&:hover': {
										backgroundColor: 'var(--primary-hover)',
									},
								}}
							>
								<AddIcon />
								{isFullScreen && <span className='ml-2 text-sm'>Add Ingredient</span>}
							</IconButton>
						</div>

						<div className={`flex flex-wrap gap-2 ${isFullScreen ? 'mt-2' : 'mt-3'}`}>
							{value.map((ingredient, idx) => (
								<IngredientChip
									key={`${ingredient}-${idx}`}
									ingredient={ingredient}
									idx={idx}
									isFullScreen={isFullScreen}
									draggedIndex={draggedIndex}
									dragOverIndex={dragOverIndex}
									onDragStart={handleDragStart}
									onDragEnd={handleDragEnd}
									onDragOver={handleDragOver}
									onDragEnter={handleDragEnter}
									onDragLeave={handleDragLeave}
									onDrop={e => handleDrop(e, idx, value, onChange)}
									onDelete={() => handleDelete(ingredient, value, onChange)}
								/>
							))}
						</div>

						{value.length > 1 && (
							<p
								className={`text-xs text-muted-foreground ${
									isFullScreen ? 'mt-1' : 'mt-2'
								}`}
							>
								💡 Move ingredients to reorder
							</p>
						)}
					</div>
				)}
			/>
		</div>
	)
}

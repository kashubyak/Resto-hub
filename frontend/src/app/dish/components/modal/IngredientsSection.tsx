'use client'

import { Input } from '@/components/ui/Input'
import type { IFormValues } from '@/types/dish.interface'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { Chip, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useRef, useState } from 'react'
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
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
	const dragCounter = useRef(0)

	const theme = useTheme()
	const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	const handleAdd = (value: string[], onChange: (newValue: string[]) => void) => {
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

	const handleDelete = (
		ingredient: string,
		value: string[],
		onChange: (newValue: string[]) => void,
	) => {
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

	const handleDragStart = (e: React.DragEvent, index: number) => {
		setDraggedIndex(index)
		e.dataTransfer.effectAllowed = 'move'
		e.dataTransfer.setData('text/html', e.currentTarget.outerHTML)
		setTimeout(() => {
			if (e.currentTarget) (e.currentTarget as HTMLElement).style.opacity = '0.5'
		}, 0)
	}

	const handleDragEnd = (e: React.DragEvent) => {
		setDraggedIndex(null)
		setDragOverIndex(null)
		dragCounter.current = 0
		;(e.currentTarget as HTMLElement).style.opacity = '1'
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}

	const handleDragEnter = (e: React.DragEvent, index: number) => {
		e.preventDefault()
		dragCounter.current++
		setDragOverIndex(index)
	}

	const handleDragLeave = () => {
		dragCounter.current--
		if (dragCounter.current === 0) setDragOverIndex(null)
	}

	const handleDrop = (
		e: React.DragEvent,
		dropIndex: number,
		value: string[],
		onChange: (newValue: string[]) => void,
	) => {
		e.preventDefault()

		if (draggedIndex === null || draggedIndex === dropIndex) return

		const newIngredients = [...value]
		const draggedItem = newIngredients[draggedIndex]

		newIngredients.splice(draggedIndex, 1)
		newIngredients.splice(dropIndex, 0, draggedItem)

		onChange(newIngredients)
		setDraggedIndex(null)
		setDragOverIndex(null)
		dragCounter.current = 0
	}

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
							{value.map((ingredient: string, idx: number) => (
								<div
									key={`${ingredient}-${idx}`}
									draggable
									onDragStart={e => handleDragStart(e, idx)}
									onDragEnd={handleDragEnd}
									onDragOver={handleDragOver}
									onDragEnter={e => handleDragEnter(e, idx)}
									onDragLeave={handleDragLeave}
									onDrop={e => handleDrop(e, idx, value, onChange)}
									className={`
										flex items-center gap-1 cursor-move transition-all duration-200
										${draggedIndex === idx ? 'scale-105 rotate-2' : ''}
										${
											dragOverIndex === idx && draggedIndex !== idx
												? 'scale-110 shadow-lg ring-2 ring-blue-400 ring-opacity-50'
												: ''
										}
										hover:scale-105 hover:shadow-md
									`}
									style={{
										transform:
											draggedIndex === idx
												? 'scale(1.05) rotate(2deg)'
												: dragOverIndex === idx && draggedIndex !== idx
												? 'scale(1.1)'
												: 'scale(1)',
										transition: 'all 0.2s ease-in-out',
									}}
								>
									<DragIndicatorIcon
										sx={{
											color: 'var(--muted-foreground)',
											fontSize: isFullScreen ? '1rem' : '1.2rem',
											cursor: 'grab',
											opacity: 0.6,
											'&:hover': {
												opacity: 1,
											},
										}}
									/>
									<Chip
										label={ingredient}
										onDelete={() => handleDelete(ingredient, value, onChange)}
										deleteIcon={<CloseIcon />}
										size={isFullScreen ? 'small' : 'medium'}
										sx={{
											backgroundColor:
												dragOverIndex === idx && draggedIndex !== idx
													? 'var(--primary)'
													: 'var(--active-item)',
											color:
												dragOverIndex === idx && draggedIndex !== idx
													? 'var(--background)'
													: 'var(--foreground)',
											borderRadius: '8px',
											fontSize: isFullScreen ? '0.8rem' : '0.9rem',
											transition: 'all 0.2s ease-in-out',
											'& .MuiChip-deleteIcon': {
												color:
													dragOverIndex === idx && draggedIndex !== idx
														? 'var(--background)'
														: 'var(--foreground)',
												fontSize: isFullScreen ? '1rem' : '1.2rem',
												'&:hover': {
													color: 'var(--destructive)',
												},
											},
										}}
									/>
								</div>
							))}
						</div>
					</div>
				)}
			/>
		</div>
	)
}

'use client'

import { Input } from '@/components/ui/Input'
import type { IDishFormValues } from '@/types/dish.interface'
import AddIcon from '@mui/icons-material/Add'
import { IconButton, useMediaQuery, useTheme } from '@mui/material'
import { GripVertical, Plus, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import {
	Controller,
	type Control,
	type FieldErrors,
	type UseFormClearErrors,
	type UseFormSetError,
} from 'react-hook-form'
import { IngredientChip } from './IngredientChip'

interface IngredientsSectionProps {
	control?: Control<IDishFormValues>
	errors: FieldErrors<IDishFormValues>
	setError: UseFormSetError<IDishFormValues>
	clearErrors: UseFormClearErrors<IDishFormValues>
	mode?: 'create' | 'update'
}

export const IngredientsSection = ({
	control,
	errors,
	setError,
	clearErrors,
	mode = 'create',
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
		(
			ingredient: string,
			value: string[],
			onChange: (newValue: string[]) => void,
		) => {
			const updated = value.filter((i) => i !== ingredient)
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
			if (draggedItem == null) return

			newIngredients.splice(draggedIndex, 1)
			newIngredients.splice(dropIndex, 0, draggedItem)

			onChange(newIngredients)
			setDraggedIndex(null)
			setDragOverIndex(null)
			dragCounter.current = 0
		},
		[draggedIndex],
	)

	if (!control) return null

	if (mode === 'update') {
		return (
			<div className="space-y-4">
				<Controller
					name="ingredients"
					control={control}
					defaultValue={[]}
					rules={{
						required: 'At least one ingredient is required',
						validate: (value) =>
							value.length > 0 || 'At least one ingredient is required',
					}}
					render={({ field: { value, onChange } }) => (
						<>
							<div className="flex items-center gap-2 text-sm font-semibold text-foreground">
								<span className="text-base" aria-hidden>
									🥕
								</span>
								Ingredients ({value.length})
							</div>

							<div className="flex gap-2">
								<input
									type="text"
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault()
											handleAdd(value, onChange)
										}
									}}
									placeholder="Add ingredient..."
									className="flex-1 h-10 px-3 bg-background border-2 border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
								/>
								<button
									type="button"
									onClick={() => handleAdd(value, onChange)}
									disabled={!inputValue.trim()}
									className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<Plus className="w-4 h-4" />
								</button>
							</div>

							{errors.ingredients?.message && (
								<span className="text-sm text-[var(--destructive)]">
									{errors.ingredients.message}
								</span>
							)}

							{value.length > 0 && (
								<div className="space-y-2">
									{value.map((ingredient, index) => (
										<div
											key={`${ingredient}-${index}`}
											draggable
											onDragStart={(e) => handleDragStart(e, index)}
											onDragOver={handleDragOver}
											onDragEnd={handleDragEnd}
											onDragEnter={(e) => handleDragEnter(e, index)}
											onDragLeave={handleDragLeave}
											onDrop={(e) => handleDrop(e, index, value, onChange)}
											className={`group flex items-center gap-2 px-3 py-2 bg-background border-2 border-border rounded-lg cursor-move hover:border-primary transition-all ${
												draggedIndex === index ? 'opacity-50 scale-95' : ''
											}`}
										>
											<GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
											<span className="flex-1 text-sm font-medium text-foreground">
												{ingredient}
											</span>
											<button
												type="button"
												onClick={() =>
													handleDelete(ingredient, value, onChange)
												}
												className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
											>
												<X className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
							)}
						</>
					)}
				/>
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
				🥕 Ingredients
			</h3>

			<Controller
				name="ingredients"
				control={control}
				defaultValue={[]}
				rules={{
					required: 'At least one ingredient is required',
					validate: (value) =>
						value.length > 0 || 'At least one ingredient is required',
				}}
				render={({ field: { value, onChange } }) => (
					<div className="w-full">
						<div
							className={`flex ${isFullScreen ? 'flex-col gap-2' : 'gap-2 items-start'}`}
						>
							<div className="flex-1">
								<Input
									label="Add ingredient"
									value={inputValue}
									error={errors.ingredients?.message as string}
									onChange={(e) => setInputValue(e.target.value)}
									onKeyDown={(e) => {
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
									flexShrink: 0,
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
								{isFullScreen && (
									<span className="ml-2 text-sm">Add Ingredient</span>
								)}
							</IconButton>
						</div>

						<div
							className={`flex flex-wrap gap-2 ${isFullScreen ? 'mt-2' : 'mt-3'}`}
						>
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
									onDrop={(e) => handleDrop(e, idx, value, onChange)}
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

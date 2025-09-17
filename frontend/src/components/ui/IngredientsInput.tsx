'use client'

import type { IFormValues } from '@/types/dish.interface'
import { Close } from '@mui/icons-material'
import { useState, type KeyboardEvent } from 'react'
import type { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form'
import { Input } from './Input'

type IngredientsInputProps = {
	setValue: UseFormSetValue<IFormValues>
	register?: UseFormRegisterReturn
	label: string
	error?: string
}

export const IngredientsInput = ({
	setValue,
	label,
	error,
	register,
}: IngredientsInputProps) => {
	const [ingredients, setIngredients] = useState<string[]>([])
	const [inputValue, setInputValue] = useState('')

	const addIngredient = () => {
		const value = inputValue.trim()
		if (value && !ingredients.includes(value)) {
			const updated = [...ingredients, value]
			setIngredients(updated)
			setValue('ingredients', updated)
			setInputValue('')
		}
	}

	const removeIngredient = (ingredient: string) => {
		const updated = ingredients.filter(i => i !== ingredient)
		setIngredients(updated)
		setValue('ingredients', updated)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			addIngredient()
		}
	}

	return (
		<div className='w-full'>
			<div className='flex items-center gap-2'>
				<Input
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					label={label}
					error={error}
					register={register}
					className='flex-1'
				/>
				<button
					type='button'
					onClick={addIngredient}
					className='px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium'
				>
					Add
				</button>
			</div>

			{ingredients.length > 0 && (
				<div className='flex flex-wrap gap-2 mt-3'>
					{ingredients.map(ingredient => (
						<div
							key={ingredient}
							className='flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm text-foreground shadow-sm'
						>
							<span>{ingredient}</span>
							<button
								type='button'
								onClick={() => removeIngredient(ingredient)}
								className='text-muted-foreground hover:text-[var(--destructive)] transition'
							>
								<Close fontSize='small' />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

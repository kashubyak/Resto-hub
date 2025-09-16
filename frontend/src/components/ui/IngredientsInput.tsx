'use client'

import type { IFormValues } from '@/hooks/useDishModal'
import { X } from '@mui/icons-material'
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
		<div>
			<Input
				type='text'
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				label={label}
				register={register}
				className='w-full p-2 rounded bg-background text-foreground border border-border'
			/>

			{error && <p className='text-destructive text-sm mt-1'>{error}</p>}

			<div className='flex flex-wrap gap-2 mt-2'>
				{ingredients.map(ingredient => (
					<span
						key={ingredient}
						className='flex items-center gap-1 bg-muted text-foreground px-2 py-1 rounded-full text-sm'
					>
						{ingredient}
						<button
							type='button'
							onClick={() => removeIngredient(ingredient)}
							className='text-destructive hover:text-red-700'
						>
							<X />
						</button>
					</span>
				))}
			</div>
		</div>
	)
}

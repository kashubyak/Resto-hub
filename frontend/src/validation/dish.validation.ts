export const dishNameValidation = {
	required: 'Dish name is required',
	validate: {
		minLength: (value: string) =>
			value.trim().length >= 2 || 'Dish name must be at least 2 characters',
		maxLength: (value: string) =>
			value.trim().length <= 100 || 'Dish name can be at most 100 characters',
		noOnlySpaces: (value: string) =>
			value.trim().length > 0 || 'Dish name cannot be only spaces',
		validCharacters: (value: string) =>
			/^[\p{L}\p{N}\s\-&.,'()]+$/u.test(value) ||
			'Dish name can only contain letters, numbers, spaces, and basic punctuation',
		noConsecutiveSpaces: (value: string) =>
			!/\s{2,}/.test(value) || 'Dish name cannot have consecutive spaces',
		startsWithLetter: (value: string) =>
			/^[\p{L}]/u.test(value) || 'Dish name must start with a letter',
	},
}

export const imageValidation = {
	required: 'Dish image is required',
	validate: {
		validType: (value: FileList | null) =>
			!value?.[0] ||
			value[0].type.startsWith('image/') ||
			'Only image files are allowed',
	},
}

export const weightValidation = {
	setValueAs: (value: string) => (value === '' ? null : Number(value)),
	validate: (value: number | null | undefined) =>
		value == null || value > 0 || 'Weight must be greater than 0',
}

export const caloriesValidation = {
	setValueAs: (value: string) => (value === '' ? null : Number(value)),
	validate: (value: number | null | undefined) =>
		value == null || value > 0 || 'Calories must be greater than 0',
}

export const priceValidation = {
	required: 'Dish price is required',
	validate: (value: string | number | undefined) => {
		const str = String(value ?? '').trim()

		if (str === '') return 'Dish price is required'
		if (!/^\d*([.,]\d{0,2})?$/.test(str)) return 'Price must be a valid number'

		const num = parseFloat(str.replace(',', '.'))
		if (isNaN(num)) return 'Price must be a valid number'
		if (num <= 0) return 'Price must be greater than 0'
		if (!/^\d+(\.\d{1,2})?$/.test(num.toString()))
			return 'Price can have up to two decimal places'

		return true
	},
}

export const VALID_NUMBER_PATTERN = /^-?\d*\.?\d*$/


export const categoryIdValidation = {
	setValueAs: (value: string) => (value === '' ? null : Number(value)),
	validate: (value: number | null | undefined) =>
		value == null ||
		(value > 0 && Number.isInteger(value)) ||
		'Category ID must be a positive integer',
}

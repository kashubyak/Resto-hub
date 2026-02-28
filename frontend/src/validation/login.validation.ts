export const emailValidation = {
	required: 'Email is required',
	validate: {
		validEmail: (value: string) => {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
			return emailRegex.test(value) || 'Please enter a valid email address'
		},
		minLength: (value: string) =>
			value.length >= 5 || 'Email address is too short',
		maxLength: (value: string) =>
			value.length <= 254 || 'Email address is too long',
		noConsecutiveDots: (value: string) =>
			!/\.{2,}/.test(value) || 'Invalid email format',
		validLocalPart: (value: string) => {
			const localPart = value.split('@')[0]
			return (
				(localPart && localPart.length <= 64 && localPart.length >= 1) ||
				'Invalid email format'
			)
		},
		validDomain: (value: string) => {
			const parts = value.split('@')
			if (parts.length !== 2) return 'Invalid email format'
			const domain = parts[1]
			return (
				(domain &&
					domain.includes('.') &&
					!domain.startsWith('.') &&
					!domain.endsWith('.') &&
					domain.length >= 4) ||
				'Invalid email format'
			)
		},
		noSpaces: (value: string) =>
			!/\s/.test(value) || 'Email cannot contain spaces',
		startsCorrectly: (value: string) =>
			!/^[.\-_]/.test(value) || 'Invalid email format',
		endsCorrectly: (value: string) =>
			!/[.\-_]@/.test(value) || 'Invalid email format',
		validCharacters: (value: string) =>
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/.test(value) ||
			'Email contains invalid characters',
		domainValidation: (value: string) => {
			const domain = value.split('@')[1]
			if (!domain) return 'Invalid email format'
			return !/^-|-$|\.{2,}/.test(domain) || 'Invalid email domain format'
		},
	},
}

export const passwordValidation = {
	required: 'Password is required',
	validate: {
		minLength: (value: string) =>
			value.length >= 8 || 'Password must be at least 8 characters long',
		maxLength: (value: string) => value.length <= 128 || 'Password is too long',
		hasUppercase: (value: string) =>
			/[A-Z]/.test(value) ||
			'Password must contain at least one uppercase letter',
		hasLowercase: (value: string) =>
			/[a-z]/.test(value) ||
			'Password must contain at least one lowercase letter',
		hasNumber: (value: string) =>
			/\d/.test(value) || 'Password must contain at least one number',
		hasSpecialChar: (value: string) =>
			/[@$!%*?&]/.test(value) ||
			'Password must contain at least one special character (@$!%*?&)',
		validCharacters: (value: string) =>
			/^[A-Za-z\d@$!%*?&]+$/.test(value) ||
			'Password can only contain letters, numbers, and special characters (@$!%*?&)',
		noSpaces: (value: string) =>
			!/\s/.test(value) || 'Password cannot contain spaces',
	},
}

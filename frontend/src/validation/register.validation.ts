export const CompanyNameValidation = {
	required: 'Company name is required',
	validate: {
		minLength: (value: string) =>
			value.length >= 2 || 'Company name must be at least 2 characters',
		maxLength: (value: string) =>
			value.length <= 100 || 'Company name must be at most 100 characters',
		noOnlySpaces: (value: string) =>
			value.trim().length > 0 || 'Company name cannot contain only spaces',
		validCharacters: (value: string) =>
			/^[a-zA-Z0-9\s\-&.,'()]+$/.test(value) ||
			'Company name can only contain letters, numbers, spaces, and basic punctuation',
		noConsecutiveSpaces: (value: string) =>
			!/\s{2,}/.test(value) || 'Company name cannot have consecutive spaces',
		startsWithLetter: (value: string) =>
			/^[a-zA-Z]/.test(value) || 'Company name must start with a letter',
		noSpecialAtStart: (value: string) =>
			!/^[\s\-&.,'()]/.test(value) || 'Company name cannot start with special characters',
	},
}
export const subdomainValidation = {
	required: 'Subdomain is required',
	validate: {
		lowerCase: (value: string) =>
			/^[a-z0-9]+$/.test(value) || 'Only lowercase letters and numbers allowed',
		startsWithLetter: (value: string) =>
			/^[a-z]/.test(value) || 'Subdomain must start with a letter',
		endsWithAlphanumeric: (value: string) =>
			/[a-z0-9]$/.test(value) || 'Subdomain must end with a letter or number',
		minLength: (value: string) =>
			value.length >= 3 || 'Subdomain must be at least 3 characters',
		maxLength: (value: string) =>
			value.length <= 30 || 'Subdomain must be at most 30 characters',
		noConsecutiveNumbers: (value: string) =>
			!/\d{4,}/.test(value) || 'Subdomain cannot have more than 3 consecutive numbers',
		notReserved: (value: string) => {
			const reserved = [
				'www',
				'api',
				'admin',
				'mail',
				'ftp',
				'blog',
				'test',
				'dev',
				'staging',
				'prod',
				'production',
			]
			return !reserved.includes(value.toLowerCase()) || 'This subdomain is reserved'
		},
		balanced: (value: string) => {
			const letters = (value.match(/[a-z]/g) || []).length
			return letters >= 2 || 'Subdomain must contain at least 2 letters'
		},
	},
}

export const adminNameValidation = {
	required: 'Admin name is required',
	validate: {
		minLength: (value: string) =>
			value.length >= 2 || 'Admin name must be at least 2 characters',
		maxLength: (value: string) =>
			value.length <= 50 || 'Admin name must be at most 50 characters',
		noOnlySpaces: (value: string) =>
			value.trim().length > 0 || 'Admin name cannot contain only spaces',
		validCharacters: (value: string) =>
			/^[a-zA-ZА-Яа-яІіЇїЄє\s\-']+$/.test(value) ||
			'Admin name can only contain letters, spaces, hyphens, and apostrophes',
		noConsecutiveSpaces: (value: string) =>
			!/\s{2,}/.test(value) || 'Admin name cannot have consecutive spaces',
		startsWithLetter: (value: string) =>
			/^[a-zA-ZА-Яа-яІіЇїЄє]/.test(value) || 'Admin name must start with a letter',
		endsWithLetter: (value: string) =>
			/[a-zA-ZА-Яа-яІіЇїЄє]$/.test(value) || 'Admin name must end with a letter',
		noSpecialAtStartEnd: (value: string) =>
			!/^[\s\-']|[\s\-']$/.test(value) ||
			'Admin name cannot start or end with special characters',
		hasValidName: (value: string) => {
			const words = value.trim().split(/\s+/)
			return (
				(words.length >= 1 && words.length <= 4) || 'Admin name should have 1-4 words'
			)
		},
	},
}

export const emailValidation = {
	required: 'Admin email is required',
	validate: {
		validEmail: (value: string) =>
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
			'Please enter a valid email address',
		minLength: (value: string) => value.length >= 5 || 'Email address is too short',
		maxLength: (value: string) => value.length <= 254 || 'Email address is too long',
		noConsecutiveDots: (value: string) =>
			!/\.{2,}/.test(value) || 'Email cannot have consecutive dots',
		validLocalPart: (value: string) => {
			const localPart = value.split('@')[0]
			return (localPart && localPart.length <= 64) || 'Email local part is too long'
		},
		validDomain: (value: string) => {
			const parts = value.split('@')
			if (parts.length !== 2) return 'Invalid email format'
			const domain = parts[1]
			return (
				(domain &&
					domain.includes('.') &&
					!domain.startsWith('.') &&
					!domain.endsWith('.')) ||
				'Invalid email domain'
			)
		},
		noSpaces: (value: string) => !/\s/.test(value) || 'Email cannot contain spaces',
		startsCorrectly: (value: string) =>
			!/^[.\-_]/.test(value) || 'Email cannot start with dot, dash, or underscore',
		commonDomains: (value: string) => {
			const domain = value.split('@')[1]?.toLowerCase()
			const suspicious = ['tempmail', '10minutemail', 'guerrillamail']
			return (
				!suspicious.some(s => domain?.includes(s)) ||
				'Please use a permanent email address'
			)
		},
	},
}

export const passwordValidation = {
	required: 'Admin password is required',
	validate: {
		minLength: (value: string) =>
			value.length >= 8 || 'Password must be at least 8 characters long',
		maxLength: (value: string) =>
			value.length <= 128 || 'Password must be at most 128 characters long',
		hasUppercase: (value: string) =>
			/[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
		hasLowercase: (value: string) =>
			/[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
		hasNumber: (value: string) =>
			/\d/.test(value) || 'Password must contain at least one number',
		hasSpecialChar: (value: string) =>
			/[@$!%*?&]/.test(value) ||
			'Password must contain at least one special character (@$!%*?&)',
		validCharacters: (value: string) =>
			/^[A-Za-z\d@$!%*?&]+$/.test(value) ||
			'Password can only contain letters, numbers, and special characters (@$!%*?&)',
		noSpaces: (value: string) => !/\s/.test(value) || 'Password cannot contain spaces',
	},
}

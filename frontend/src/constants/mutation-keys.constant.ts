const MUTATION_PREFIX = 'mutation' as const

export const MUTATION_KEY = {
	DISH: {
		DELETE: [MUTATION_PREFIX, 'dish', 'delete'] as const,
		DELETE_FROM_CATEGORY: [
			MUTATION_PREFIX,
			'dish',
			'delete-from-category',
		] as const,
		ASSIGN_CATEGORY: [MUTATION_PREFIX, 'dish', 'assign-category'] as const,
	},
	ORDER: {
		ASSIGN: [MUTATION_PREFIX, 'order', 'assign'] as const,
		UPDATE_STATUS: [MUTATION_PREFIX, 'order', 'update-status'] as const,
		CANCEL: [MUTATION_PREFIX, 'order', 'cancel'] as const,
	},
	TABLE: {
		CREATE: [MUTATION_PREFIX, 'table', 'create'] as const,
		UPDATE: [MUTATION_PREFIX, 'table', 'update'] as const,
		TOGGLE_ACTIVE: [MUTATION_PREFIX, 'table', 'toggle-active'] as const,
		DELETE: [MUTATION_PREFIX, 'table', 'delete'] as const,
	},
	COMPANY: {
		UPDATE: [MUTATION_PREFIX, 'company', 'update'] as const,
		DELETE: [MUTATION_PREFIX, 'company', 'delete'] as const,
	},
} as const

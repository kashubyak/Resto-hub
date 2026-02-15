import type { FilterConfig } from '@/types/filter.interface'

export const categoryFilters: FilterConfig[] = [
	{
		type: 'select',
		key: 'hasDishes',
		label: 'Content Status',
		placeholder: 'All categories',
		options: [
			{ value: 'true', label: 'With dishes' },
			{ value: 'false', label: 'Empty (No dishes)' },
		],
	},
	{
		type: 'select',
		key: 'sortBy',
		label: 'Sort By',
		placeholder: 'Default sorting',
		options: [
			{ value: 'createdAt-desc', label: 'Created: Newest first' },
			{ value: 'createdAt-asc', label: 'Created: Oldest first' },
			{ value: 'updatedAt-desc', label: 'Updated: Recently' },
			{ value: 'updatedAt-asc', label: 'Updated: Long ago' },
			{ value: 'name-asc', label: 'Name (A-Z)' },
			{ value: 'name-desc', label: 'Name (Z-A)' },
		],
	},
] as const

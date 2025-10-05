export interface IFilterValues {
	minPrice?: number
	maxPrice?: number
	available?: boolean
	sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt' | 'calories' | 'weightGr'
	order?: 'asc' | 'desc'
}
export interface IFormValues {
	name: string
	description: string
	price: number
	categoryId: number
	ingredients: string[]
	imageUrl: FileList
	weightGr: number
	calories: number
}
export interface IDish extends IFormValues {
	id: number
	createdAt: string
	updatedAt: string
}

export interface IDishResponse {
	data: IDish[]
	total: number
	page: number
	limit: number
	totalPages: number
}

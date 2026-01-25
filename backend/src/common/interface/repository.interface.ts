export interface IFindManyArgs<TWhere, TOrderBy> {
	where: TWhere
	orderBy: TOrderBy
	skip: number
	take: number
}

export interface IFindManyResult<T> {
	data: T[]
	total: number
}

export interface IDeleteResult {
	id: number
}

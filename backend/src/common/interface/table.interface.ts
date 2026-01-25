export interface IBaseTable {
	id: number
	number: number
}

export interface IExtendedTable extends IBaseTable {
	seats: number
	active: boolean
}

export type FilterType =
	| 'range'
	| 'select'
	| 'multiselect'
	| 'boolean'
	| 'date-range'
	| 'search'

export interface BaseFilterConfig {
	key: string
	label: string
	type: FilterType
	placeholder?: string
	disabled?: boolean
}

export interface RangeFilterConfig extends BaseFilterConfig {
	type: 'range'
	minKey: string
	maxKey: string
	min?: number
	max?: number
	step?: number
	prefix?: string
	suffix?: string
}

export interface SelectFilterConfig extends BaseFilterConfig {
	type: 'select'
	options: Array<{ value: string | number; label: string }>
}

export interface MultiSelectFilterConfig extends BaseFilterConfig {
	type: 'multiselect'
	options: Array<{ value: string | number; label: string }>
}

export interface BooleanFilterConfig extends BaseFilterConfig {
	type: 'boolean'
	trueLabel?: string
	falseLabel?: string
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
	type: 'date-range'
	startKey: string
	endKey: string
}

export interface SearchFilterConfig extends BaseFilterConfig {
	type: 'search'
}

export type FilterConfig =
	| RangeFilterConfig
	| SelectFilterConfig
	| MultiSelectFilterConfig
	| BooleanFilterConfig
	| DateRangeFilterConfig
	| SearchFilterConfig

export type FilterValue = string | number | boolean | undefined | null

export type FilterValues = Record<string, FilterValue>

export interface FilterDrawerProps {
	filters: FilterConfig[]
	initialValues?: FilterValues
	onApply: (values: FilterValues) => void
	onReset?: () => void
}

'use client'

import { ROUTES } from '@/constants/pages.constant'
import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import { useAlert } from '@/providers/AlertContext'
import { getOrderAnalyticsService } from '@/services/order/get-order-analytics.service'
import type { IAxiosError } from '@/types/error.interface'
import type {
	IOrderAnalyticsGroupInfo,
	IOrderAnalyticsRow,
	OrderGroupBy,
	OrderMetric,
} from '@/types/order.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useQuery } from '@tanstack/react-query'
import {
	BarChart3,
	DollarSign,
	Download,
	Filter,
	LineChart,
	Loader2,
	Package,
	PieChart,
	ShoppingCart,
	TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import {
	Bar,
	BarChart as RechartsBarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart as RechartsLine,
	Pie,
	PieChart as RechartsPie,
	ResponsiveContainer,
	Sector,
	Tooltip,
	XAxis,
	YAxis,
	type DotProps,
} from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { CustomDatePicker } from './CustomDatePicker'
import { CustomSelect, type IAnalyticsSelectOption } from './CustomSelect'

const COLORS = [
	'#7c3aed',
	'#3b82f6',
	'#10b981',
	'#f59e0b',
	'#ef4444',
	'#ec4899',
	'#8b5cf6',
	'#14b8a6',
	'#f97316',
	'#06b6d4',
	'#84cc16',
	'#a855f7',
	'#f43f5e',
	'#6366f1',
	'#eab308',
]

const groupByOptions: IAnalyticsSelectOption[] = [
	{ value: 'day', label: 'By Day' },
	{ value: 'month', label: 'By Month' },
	{ value: 'dish', label: 'By Dish' },
	{ value: 'category', label: 'By Category' },
	{ value: 'waiter', label: 'By Waiter' },
	{ value: 'cook', label: 'By Cook' },
	{ value: 'table', label: 'By Table' },
]

const metricOptions: IAnalyticsSelectOption[] = [
	{ value: 'revenue', label: 'Revenue', icon: DollarSign },
	{ value: 'count', label: 'Order Count', icon: ShoppingCart },
	{ value: 'quantity', label: 'Items Sold', icon: Package },
]

function escapeCsvCell(value: string) {
	if (value.includes(',') || value.includes('"') || value.includes('\n'))
		return `"${value.replace(/"/g, '""')}"`
	return value
}

const analyticsNameLinkClass =
	'text-foreground cursor-pointer text-sm font-medium hover:underline'

function getAnalyticsRowEntityHref(
	groupBy: OrderGroupBy,
	groupInfo: IOrderAnalyticsGroupInfo,
): string | null {
	const id = groupInfo.id
	if (id === undefined || id === null) return null
	switch (groupBy) {
		case 'waiter':
		case 'cook':
			return ROUTES.PRIVATE.ADMIN.USERS_ID(id)
		case 'dish':
			return ROUTES.PRIVATE.ADMIN.DISH_ID(id)
		case 'category':
			return ROUTES.PRIVATE.ADMIN.CATEGORY_ID(id)
		case 'table':
			return ROUTES.PRIVATE.ADMIN.TABLE_ID(id)
		default:
			return null
	}
}

interface IPieLabelProps {
	cx: number
	cy: number
	midAngle: number
	outerRadius: number
	name: string
	percent: number
}

export function AnalyticsView() {
	const { showError, showSuccess } = useAlert()
	const [groupBy, setGroupBy] = useState<OrderGroupBy>('day')
	const [metric, setMetric] = useState<OrderMetric>('revenue')
	const [dateFrom, setDateFrom] = useState(() => {
		const d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split('T')[0]
		return d ?? ''
	})
	const [dateTo, setDateTo] = useState(() => {
		const d = new Date().toISOString().split('T')[0]
		return d ?? ''
	})
	const [showFilters, setShowFilters] = useState(true)
	const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar')
	const [showAllPerformers, setShowAllPerformers] = useState(false)
	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const [hoveredLegendItem, setHoveredLegendItem] = useState<{
		index: number
		value: number
		name: string
		percentage: number
		x: number
		y: number
	} | null>(null)

	const from = dateFrom ?? ''
	const to = dateTo ?? ''

	const {
		data: data = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ORDER_QUERY_KEY.ANALYTICS({
			groupBy,
			metric,
			from,
			to,
		}),
		queryFn: async () => {
			const res = await getOrderAnalyticsService({
				groupBy,
				metric,
				from,
				to,
			})
			return res.data
		},
	})

	useEffect(() => {
		if (!isError || !error) return
		showError(parseBackendError(error as unknown as IAxiosError))
	}, [isError, error, showError])

	useEffect(() => {
		setActiveIndex(null)
		setHoveredLegendItem(null)
	}, [groupBy, metric, from, to])

	useEffect(() => {
		if (groupBy !== 'day' && groupBy !== 'month' && chartType === 'line')
			setChartType('bar')
		setActiveIndex(null)
		setHoveredLegendItem(null)
	}, [groupBy, chartType])

	const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
	const totalOrders = data.reduce((sum, item) => sum + item.count, 0)
	const totalItems = data.reduce((sum, item) => sum + item.quantity, 0)
	const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

	const currentMetricOption = metricOptions.find((m) => m.value === metric)

	const chartHeight = Math.max(400, Math.min(800, data.length * 40))
	const topData = data.slice(0, 10)

	const formatCurrency = (value: number) => `$${value.toFixed(2)}`
	const formatNumber = (value: number) => value.toLocaleString()

	const getTickInterval = (dataLength: number) => {
		if (dataLength <= 10) return 0
		if (dataLength <= 30) return Math.floor(dataLength / 10)
		if (dataLength <= 60) return Math.floor(dataLength / 8)
		return Math.floor(dataLength / 6)
	}

	const formatXAxisLabel = (value: string) => {
		if (groupBy === 'day') {
			const date = new Date(value)
			if (!Number.isNaN(date.getTime())) {
				const month = date.toLocaleDateString('en-US', { month: 'short' })
				const day = date.getDate()
				return `${month} ${day}`
			}
		} else if (groupBy === 'month') {
			const [year, month] = value.split('-')
			if (year && month) {
				const date = new Date(
					Number.parseInt(year, 10),
					Number.parseInt(month, 10) - 1,
				)
				return date.toLocaleDateString('en-US', {
					month: 'short',
					year: 'numeric',
				})
			}
		}
		return value
	}

	const displayedPerformers = showAllPerformers ? data : topData

	const handleExportCsv = useCallback(() => {
		if (!data.length) {
			showError('No analytics data to export for the selected filters.')
			return
		}
		const headers = [
			'Group',
			'Revenue',
			'Orders',
			'Items',
			'Avg order',
			'% of total revenue',
		]
		const lines = [
			headers.join(','),
			...data.map((row: IOrderAnalyticsRow) =>
				[
					escapeCsvCell(row.group),
					row.revenue,
					row.count,
					row.quantity,
					row.avgRevenuePerOrder,
					row.percentageOfTotalRevenue,
				].join(','),
			),
		]
		const blob = new Blob([`\uFEFF${lines.join('\n')}`], {
			type: 'text/csv;charset=utf-8',
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `analytics-${from}-${to}.csv`
		a.click()
		URL.revokeObjectURL(url)
		showSuccess('Analytics exported.')
	}, [data, from, to, showError, showSuccess])

	const renderPieLabel = (entry: IPieLabelProps) => {
		const RADIAN = Math.PI / 180
		const radius = entry.outerRadius + 30
		const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN)
		const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN)
		return (
			<text
				x={x}
				y={y}
				fill="#cbd5e1"
				textAnchor={x > entry.cx ? 'start' : 'end'}
				dominantBaseline="central"
				fontSize={12}
				fontWeight={600}
			>
				{`${entry.name}: ${(entry.percent * 100).toFixed(1)}%`}
			</text>
		)
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="mb-1 flex items-center gap-2">
						<BarChart3 className="text-primary h-6 w-6" />
						<h1 className="text-foreground">Analytics Dashboard</h1>
					</div>
					<p className="text-muted-foreground text-sm">
						View comprehensive insights and performance metrics
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setShowFilters(!showFilters)}
						className={`flex h-10 items-center gap-2 rounded-xl border px-4 transition-all ${
							showFilters
								? 'bg-primary text-primary-foreground border-primary'
								: 'bg-input border-border hover:bg-input/80'
						}`}
					>
						<Filter className="h-4 w-4" />
						<span className="text-sm font-medium">Filters</span>
					</button>
					<button
						type="button"
						onClick={handleExportCsv}
						disabled={isLoading}
						className="bg-card border-border hover:bg-input flex h-10 items-center gap-2 rounded-xl border px-4 transition-colors disabled:opacity-50"
					>
						<Download className="text-muted-foreground h-4 w-4" />
						<span className="text-foreground hidden text-sm sm:inline">
							Export
						</span>
					</button>
				</div>
			</div>

			{showFilters && (
				<div className="bg-card border-border rounded-xl border p-4 sm:p-6">
					<h3 className="text-foreground mb-4 font-semibold">
						Filters & Settings
					</h3>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<CustomSelect
							label="Group By"
							value={groupBy}
							options={groupByOptions}
							onChange={(v) => setGroupBy(v as OrderGroupBy)}
						/>
						<CustomSelect
							label="Metric"
							value={metric}
							options={metricOptions}
							onChange={(v) => setMetric(v as OrderMetric)}
						/>
						<CustomDatePicker
							label="From Date"
							value={dateFrom ?? ''}
							onChange={setDateFrom}
						/>
						<CustomDatePicker
							label="To Date"
							value={dateTo ?? ''}
							onChange={setDateTo}
						/>
					</div>

					<div className="border-border mt-4 border-t pt-4">
						<label className="text-muted-foreground mb-2 block text-xs">
							Visualization Type
						</label>
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => setChartType('bar')}
								className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
									chartType === 'bar'
										? 'bg-primary text-primary-foreground'
										: 'bg-input text-muted-foreground hover:bg-input/80 hover:text-foreground'
								}`}
							>
								<BarChart3 className="h-4 w-4" />
								Bar Chart
							</button>
							<button
								type="button"
								onClick={() => setChartType('pie')}
								className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
									chartType === 'pie'
										? 'bg-primary text-primary-foreground'
										: 'bg-input text-muted-foreground hover:bg-input/80 hover:text-foreground'
								}`}
							>
								<PieChart className="h-4 w-4" />
								Pie Chart
							</button>
							{(groupBy === 'day' || groupBy === 'month') && (
								<button
									type="button"
									onClick={() => setChartType('line')}
									className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
										chartType === 'line'
											? 'bg-primary text-primary-foreground'
											: 'bg-input text-muted-foreground hover:bg-input/80 hover:text-foreground'
									}`}
								>
									<LineChart className="h-4 w-4" />
									Line Chart
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="text-primary h-8 w-8 animate-spin" />
						<p className="text-muted-foreground text-sm">
							Loading analytics...
						</p>
					</div>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div className="bg-card border-border rounded-xl border p-4 sm:p-6">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-muted-foreground text-sm">Total Revenue</p>
								<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
									<DollarSign className="text-primary h-5 w-5" />
								</div>
							</div>
							<h2 className="text-foreground mb-1 text-2xl font-bold sm:text-3xl">
								{formatCurrency(totalRevenue)}
							</h2>
							<p className="text-success text-xs">From {data.length} groups</p>
						</div>

						<div className="bg-card border-border rounded-xl border p-4 sm:p-6">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-muted-foreground text-sm">Total Orders</p>
								<div className="bg-info/10 flex h-10 w-10 items-center justify-center rounded-lg">
									<ShoppingCart className="text-info h-5 w-5" />
								</div>
							</div>
							<h2 className="text-foreground mb-1 text-2xl font-bold sm:text-3xl">
								{formatNumber(totalOrders)}
							</h2>
							<p className="text-muted-foreground text-xs">Completed orders</p>
						</div>

						<div className="bg-card border-border rounded-xl border p-4 sm:p-6">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-muted-foreground text-sm">Items Sold</p>
								<div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
									<Package className="text-success h-5 w-5" />
								</div>
							</div>
							<h2 className="text-foreground mb-1 text-2xl font-bold sm:text-3xl">
								{formatNumber(totalItems)}
							</h2>
							<p className="text-muted-foreground text-xs">Total quantity</p>
						</div>

						<div className="bg-card border-border rounded-xl border p-4 sm:p-6">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-muted-foreground text-sm">Avg Order Value</p>
								<div className="bg-warning/10 flex h-10 w-10 items-center justify-center rounded-lg">
									<TrendingUp className="text-warning h-5 w-5" />
								</div>
							</div>
							<h2 className="text-foreground mb-1 text-2xl font-bold sm:text-3xl">
								{formatCurrency(avgOrderValue)}
							</h2>
							<p className="text-muted-foreground text-xs">Per order</p>
						</div>
					</div>

					<div className="bg-card border-border rounded-xl border p-4 sm:p-6">
						<h3 className="text-foreground mb-4 font-semibold">
							{currentMetricOption?.label} by{' '}
							{groupByOptions.find((g) => g.value === groupBy)?.label}
						</h3>

						{data.length === 0 ? (
							<div className="py-12 text-center">
								<p className="text-muted-foreground">
									No data available for the selected filters
								</p>
							</div>
						) : (
							<div style={{ height: `${chartHeight}px`, width: '100%' }}>
								<ResponsiveContainer width="100%" height="100%">
									{chartType === 'bar' ? (
										<RechartsBarChart
											data={data}
											margin={{ bottom: 60, left: 10, right: 10 }}
										>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#334155"
												opacity={0.3}
											/>
											<XAxis
												dataKey="group"
												stroke="#94a3b8"
												tick={{ fill: '#94a3b8', fontSize: 11 }}
												angle={-45}
												textAnchor="end"
												height={80}
												interval={getTickInterval(data.length)}
												tickFormatter={formatXAxisLabel}
												tickLine={false}
												axisLine={false}
											/>
											<YAxis
												stroke="#94a3b8"
												tick={{ fill: '#94a3b8' }}
												fontSize={12}
												tickLine={false}
												axisLine={false}
												tickFormatter={(v) =>
													metric === 'revenue' ? `$${v}` : String(v)
												}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: '#1e1e2e',
													border: '1px solid rgba(139, 92, 246, 0.3)',
													borderRadius: '12px',
													padding: '10px 14px',
													boxShadow:
														'0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
												}}
												labelStyle={{
													color: '#a5b4fc',
													fontWeight: '600',
													fontSize: '11px',
													marginBottom: '6px',
													textTransform: 'uppercase',
													letterSpacing: '0.8px',
												}}
												itemStyle={{
													color: '#ffffff',
													fontWeight: '700',
													fontSize: '18px',
													padding: '0',
												}}
												labelFormatter={(label) => {
													if (groupBy === 'day' || groupBy === 'month')
														return formatXAxisLabel(String(label))
													return String(label)
												}}
												formatter={(value: number) => [
													metric === 'revenue'
														? formatCurrency(value)
														: formatNumber(value),
												]}
												separator=""
												cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
											/>
											<Bar
												dataKey="value"
												fill="#7c3aed"
												radius={[8, 8, 0, 0]}
												activeBar={{
													fill: '#6d28d9',
													stroke: '#8b5cf6',
													strokeWidth: 2,
												}}
												onMouseEnter={(_, i) => setActiveIndex(i)}
												onMouseLeave={() => setActiveIndex(null)}
											/>
										</RechartsBarChart>
									) : chartType === 'pie' ? (
										<RechartsPie>
											<Pie
												data={data}
												dataKey="value"
												nameKey="group"
												cx="50%"
												cy="50%"
												outerRadius={data.length > 15 ? 140 : 120}
												label={
													data.length <= 15
														? (props: unknown) =>
																renderPieLabel(props as IPieLabelProps)
														: false
												}
												labelLine={
													data.length <= 15
														? { stroke: '#64748b', strokeWidth: 1 }
														: false
												}
												activeIndex={activeIndex ?? undefined}
												activeShape={(sectorProps: PieSectorDataItem) => (
													<Sector
														{...sectorProps}
														outerRadius={data.length > 15 ? 148 : 128}
														stroke="#ffffff"
														strokeWidth={2}
													/>
												)}
												onMouseEnter={(_, i) => setActiveIndex(i)}
												onMouseLeave={() => setActiveIndex(null)}
											>
												{data.map((_, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											{data.length > 15 && (
												<Legend
													wrapperStyle={{
														paddingTop: '20px',
														fontSize: '11px',
														maxHeight: '200px',
														overflowY: 'auto',
													}}
													content={(props) => {
														const payload = props.payload
														if (!payload?.length) return null

														return (
															<div
																style={{
																	paddingTop: '20px',
																	maxHeight: '200px',
																	overflowY: 'auto',
																}}
															>
																<div
																	style={{
																		display: 'flex',
																		flexWrap: 'wrap',
																		gap: '8px',
																	}}
																>
																	{payload.map((entry, index: number) => {
																		const item = data[index]
																		if (!item) return null
																		const isActive = activeIndex === index
																		return (
																			<div
																				key={`legend-${index}`}
																				style={{
																					display: 'flex',
																					alignItems: 'center',
																					gap: '6px',
																					padding: '4px 8px',
																					borderRadius: '6px',
																					cursor: 'pointer',
																					transition: 'all 0.15s ease-in-out',
																					backgroundColor: isActive
																						? 'rgba(124, 58, 237, 0.15)'
																						: 'transparent',
																					position: 'relative',
																				}}
																				onMouseEnter={(e) => {
																					if (activeIndex !== index) {
																						setActiveIndex(index)
																						const rect =
																							e.currentTarget.getBoundingClientRect()
																						setHoveredLegendItem({
																							index,
																							value: item.value,
																							name: item.group,
																							percentage:
																								item.percentageOfTotalRevenue,
																							x: rect.left + rect.width / 2,
																							y: rect.top,
																						})
																					}
																				}}
																				onMouseLeave={() => {
																					setActiveIndex(null)
																					setHoveredLegendItem(null)
																				}}
																			>
																				<div
																					style={{
																						width: '10px',
																						height: '10px',
																						borderRadius: '50%',
																						backgroundColor: entry.color,
																					}}
																				/>
																				<span
																					style={{
																						fontSize: '11px',
																						color: isActive
																							? '#f1f5f9'
																							: '#94a3b8',
																						fontWeight: isActive ? 600 : 400,
																						transition: 'all 0.15s ease-in-out',
																					}}
																				>
																					{entry.value}
																				</span>
																			</div>
																		)
																	})}
																</div>
															</div>
														)
													}}
												/>
											)}
											<Tooltip
												offset={20}
												contentStyle={{
													backgroundColor: '#1e1e2e',
													border: '1px solid rgba(139, 92, 246, 0.3)',
													borderRadius: '12px',
													padding: '10px 14px',
													boxShadow:
														'0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
												}}
												labelStyle={{
													color: '#a5b4fc',
													fontWeight: '600',
													fontSize: '11px',
													marginBottom: '6px',
													textTransform: 'uppercase',
													letterSpacing: '0.8px',
												}}
												itemStyle={{
													color: '#ffffff',
													fontWeight: '700',
													fontSize: '18px',
													padding: '0',
												}}
												formatter={(
													value: number,
													_name: string,
													itemProps: { payload?: IOrderAnalyticsRow },
												) => {
													const formattedValue =
														metric === 'revenue'
															? formatCurrency(value)
															: formatNumber(value)
													const pct =
														itemProps.payload?.percentageOfTotalRevenue
													const percentage = pct ? ` (${pct.toFixed(1)}%)` : ''
													return [formattedValue + percentage]
												}}
												separator=""
											/>
										</RechartsPie>
									) : (
										<RechartsLine
											data={data}
											margin={{ bottom: 60, left: 10, right: 10 }}
										>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#334155"
												opacity={0.3}
											/>
											<XAxis
												dataKey="group"
												stroke="#94a3b8"
												tick={{ fill: '#94a3b8', fontSize: 11 }}
												angle={-45}
												textAnchor="end"
												height={80}
												interval={getTickInterval(data.length)}
												tickFormatter={formatXAxisLabel}
												tickLine={false}
												axisLine={false}
											/>
											<YAxis
												stroke="#94a3b8"
												tick={{ fill: '#94a3b8' }}
												fontSize={12}
												tickLine={false}
												axisLine={false}
												tickFormatter={(v) =>
													metric === 'revenue' ? `$${v}` : String(v)
												}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: '#1e1e2e',
													border: '1px solid rgba(139, 92, 246, 0.3)',
													borderRadius: '12px',
													padding: '10px 14px',
													boxShadow:
														'0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
												}}
												labelStyle={{
													color: '#a5b4fc',
													fontWeight: '600',
													fontSize: '11px',
													marginBottom: '6px',
													textTransform: 'uppercase',
													letterSpacing: '0.8px',
												}}
												itemStyle={{
													color: '#ffffff',
													fontWeight: '700',
													fontSize: '18px',
													padding: '0',
												}}
												labelFormatter={(label) => {
													if (groupBy === 'day' || groupBy === 'month')
														return formatXAxisLabel(String(label))
													return String(label)
												}}
												formatter={(value: number) => [
													metric === 'revenue'
														? formatCurrency(value)
														: formatNumber(value),
												]}
												separator=""
												cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
											/>
											<Line
												type="monotone"
												dataKey="value"
												stroke="#7c3aed"
												strokeWidth={2}
												dot={{ fill: '#7c3aed', r: 4 }}
												activeDot={{
													r: 6,
													fill: '#6d28d9',
													stroke: '#8b5cf6',
													strokeWidth: 2,
													onMouseEnter: (
														props: DotProps & { index?: number },
													) => {
														if (typeof props.index === 'number')
															setActiveIndex(props.index)
													},
													onMouseLeave: () => setActiveIndex(null),
												}}
											/>
										</RechartsLine>
									)}
								</ResponsiveContainer>
							</div>
						)}
					</div>

					<div className="bg-card border-border overflow-hidden rounded-xl border">
						<div className="border-border flex items-center justify-between border-b p-4 sm:p-6">
							<div>
								<h3 className="text-foreground font-semibold">
									Top Performers
								</h3>
								<p className="text-muted-foreground mt-1 text-xs">
									Showing {showAllPerformers ? data.length : topData.length} of{' '}
									{data.length} results
								</p>
							</div>
							{data.length > 10 && (
								<button
									type="button"
									onClick={() => setShowAllPerformers(!showAllPerformers)}
									className="text-primary hover:text-primary/80 px-4 py-2 text-sm font-medium transition-colors"
								>
									{showAllPerformers ? 'Show less' : 'Show all'}
								</button>
							)}
						</div>

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-muted/50 border-border border-b">
									<tr>
										<th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
											Rank
										</th>
										<th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
											Name
										</th>
										<th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
											Revenue
										</th>
										<th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
											Orders
										</th>
										<th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
											Items
										</th>
										<th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
											Avg Order
										</th>
										<th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
											% of Total
										</th>
									</tr>
								</thead>
								<tbody className="divide-border divide-y">
									{displayedPerformers.map((item, index) => {
										const nameHref = getAnalyticsRowEntityHref(
											groupBy,
											item.groupInfo,
										)
										return (
											<tr
												key={`${item.group}-${index}`}
												className="hover:bg-accent/50 transition-colors"
											>
												<td className="px-4 py-4">
													<div className="flex items-center gap-2">
														<div
															className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
																index === 0
																	? 'bg-warning text-white'
																	: index === 1
																		? 'bg-muted text-muted-foreground'
																		: index === 2
																			? 'bg-warning/30 text-warning'
																			: 'bg-muted/50 text-muted-foreground'
															}`}
														>
															{index + 1}
														</div>
													</div>
												</td>
												<td className="px-4 py-4">
													{nameHref ? (
														<Link
															href={nameHref}
															className={analyticsNameLinkClass}
														>
															{item.group}
														</Link>
													) : (
														<span className="text-foreground text-sm font-medium">
															{item.group}
														</span>
													)}
												</td>
												<td className="px-4 py-4 text-right">
													<span className="text-foreground text-sm font-semibold">
														{formatCurrency(item.revenue)}
													</span>
												</td>
												<td className="px-4 py-4 text-right">
													<span className="text-foreground text-sm">
														{formatNumber(item.count)}
													</span>
												</td>
												<td className="px-4 py-4 text-right">
													<span className="text-foreground text-sm">
														{formatNumber(item.quantity)}
													</span>
												</td>
												<td className="px-4 py-4 text-right">
													<span className="text-foreground text-sm">
														{formatCurrency(item.avgRevenuePerOrder)}
													</span>
												</td>
												<td className="px-4 py-4 text-right">
													<div className="flex items-center justify-end gap-2">
														<div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full rounded-full"
																style={{
																	width: `${item.percentageOfTotalRevenue}%`,
																}}
															/>
														</div>
														<span className="text-muted-foreground w-12 text-right text-sm">
															{item.percentageOfTotalRevenue.toFixed(1)}%
														</span>
													</div>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}

			{hoveredLegendItem &&
				(() => {
					const tooltipWidth = 200
					const tooltipHeight = 80
					let x = hoveredLegendItem.x
					let y = hoveredLegendItem.y - 10
					let translateX = '-50%'
					let translateY = '-100%'

					if (x + tooltipWidth / 2 > window.innerWidth) {
						translateX = '-100%'
						x = hoveredLegendItem.x
					}

					if (x - tooltipWidth / 2 < 0) {
						translateX = '0%'
						x = hoveredLegendItem.x
					}

					if (y - tooltipHeight < 10) {
						translateY = '0%'
						y = hoveredLegendItem.y + 30
					}

					return (
						<div
							style={{
								position: 'fixed',
								left: `${x}px`,
								top: `${y}px`,
								transform: `translate(${translateX}, ${translateY})`,
								backgroundColor: '#1e1e2e',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								borderRadius: '12px',
								padding: '10px 14px',
								boxShadow:
									'0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
								whiteSpace: 'nowrap',
								zIndex: 10000,
								pointerEvents: 'none',
								maxWidth: '300px',
								transition: 'opacity 0.15s ease-in-out',
								opacity: 1,
							}}
						>
							<div
								style={{
									color: '#a5b4fc',
									fontSize: '11px',
									fontWeight: '600',
									textTransform: 'uppercase',
									letterSpacing: '0.8px',
									marginBottom: '6px',
								}}
							>
								{hoveredLegendItem.name}
							</div>
							<div
								style={{
									color: '#ffffff',
									fontSize: '18px',
									fontWeight: '700',
								}}
							>
								{metric === 'revenue'
									? formatCurrency(hoveredLegendItem.value)
									: formatNumber(hoveredLegendItem.value)}{' '}
								({hoveredLegendItem.percentage.toFixed(1)}%)
							</div>
						</div>
					)
				})()}
		</div>
	)
}

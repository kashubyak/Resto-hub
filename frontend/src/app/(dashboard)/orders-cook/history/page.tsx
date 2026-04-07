'use client'

import { orderStatusConfig } from '@/app/(dashboard)/orders-waiter/orderStatusConfig'
import { ROUTES } from '@/constants/pages.constant'
import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import { getCookMyOrdersService } from '@/services/order/get-cook-my-orders.service'
import type { IOrderSummary, OrderStatus } from '@/types/order.interface'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Clock, Filter, Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type HistoryStatusFilter = 'ALL' | 'FINISHED' | 'CANCELED'

function filterOrdersBySearch(orders: IOrderSummary[], searchQuery: string) {
	const q = searchQuery.trim().toLowerCase()
	if (!q) return orders
	return orders.filter((o) => {
		if (String(o.id).includes(q)) return true
		if (o.table?.number != null && String(o.table.number).includes(q))
			return true
		return o.orderItems.some(
			(i) =>
				i.dish.name.toLowerCase().includes(q) ||
				(i.notes && i.notes.toLowerCase().includes(q)),
		)
	})
}

export default function OrderCookHistoryPage() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<HistoryStatusFilter>('ALL')
	const [showFilters, setShowFilters] = useState(false)

	const statusParam =
		statusFilter === 'ALL' ? undefined : (statusFilter as OrderStatus)

	const { data, isLoading } = useQuery({
		queryKey: [ORDER_QUERY_KEY.LIST_COOK_HISTORY, statusParam],
		queryFn: () =>
			getCookMyOrdersService({
				phase: 'history',
				status: statusParam,
				sortBy: 'createdAt',
				order: 'desc',
				limit: 100,
			}),
	})

	const ordersRaw = data?.data?.data ?? []
	const orders = useMemo(
		() => filterOrdersBySearch(ordersRaw, searchQuery),
		[ordersRaw, searchQuery],
	)

	useEffect(() => {
		const onVis = () => {
			if (!document.hidden) {
				void queryClient.invalidateQueries({
					queryKey: [ORDER_QUERY_KEY.LIST_COOK_HISTORY],
				})
			}
		}
		document.addEventListener('visibilitychange', onVis)
		return () => document.removeEventListener('visibilitychange', onVis)
	}, [queryClient])

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center gap-3">
					<Link
						href={ROUTES.PRIVATE.COOK.ORDERS_COOK}
						className="flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border hover:bg-input transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-foreground" />
					</Link>
					<div>
						<div className="flex items-center gap-2 mb-1">
							<h1 className="text-foreground">Order History</h1>
							{!isLoading && orders.length > 0 && (
								<span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-muted text-muted-foreground text-xs font-bold">
									{orders.length}
								</span>
							)}
						</div>
						<p className="text-sm text-muted-foreground">
							Your finished and canceled orders
						</p>
					</div>
				</div>
			</div>

			<div className="bg-card border border-border rounded-xl p-4 space-y-3">
				<div className="flex flex-col sm:flex-row gap-3">
					<div className="flex-1 flex items-center gap-2 bg-input rounded-xl px-3 py-2.5 border border-border focus-within:border-primary/50 focus-within:bg-background transition-all">
						<Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
						<input
							type="text"
							placeholder="Search orders, tables, dishes..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
						/>
					</div>

					<button
						type="button"
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
							showFilters
								? 'bg-primary text-primary-foreground border-primary'
								: 'bg-input border-border hover:bg-input/80'
						}`}
					>
						<Filter className="w-4 h-4" />
						<span className="text-sm font-medium">Filters</span>
					</button>
				</div>

				{showFilters && (
					<div className="pt-3 border-t border-border">
						<div className="space-y-2">
							<p className="text-xs text-muted-foreground">
								History shows only finished and canceled orders
							</p>
							<div className="flex flex-wrap gap-2">
								{(['ALL', 'FINISHED', 'CANCELED'] as const).map((status) => (
									<button
										type="button"
										key={status}
										onClick={() => setStatusFilter(status)}
										className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
											statusFilter === status
												? 'bg-primary text-primary-foreground'
												: 'bg-input text-muted-foreground hover:text-foreground hover:bg-input/80'
										}`}
									>
										{status === 'ALL'
											? 'All History'
											: orderStatusConfig[status].label}
									</button>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="w-8 h-8 text-primary animate-spin" />
						<p className="text-sm text-muted-foreground">
							Loading order history...
						</p>
					</div>
				</div>
			) : orders.length === 0 ? (
				<div className="bg-card border border-border rounded-xl p-8 text-center">
					<div className="flex flex-col items-center gap-3">
						<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
							<Clock className="w-6 h-6 text-primary" />
						</div>
						<h3 className="text-foreground">No orders found</h3>
						<p className="text-sm text-muted-foreground">
							{searchQuery || statusFilter !== 'ALL'
								? 'No orders match your search criteria'
								: "You haven't completed any orders yet"}
						</p>
					</div>
				</div>
			) : (
				<div className="bg-card border border-border rounded-xl overflow-hidden">
					<div className="hidden md:block overflow-x-auto">
						<table className="w-full">
							<thead className="bg-muted/50 border-b border-border">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										Order
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										Table
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										Items
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										Status
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										Date
									</th>
									<th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
										Total
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{orders.map((order) => {
									const config = orderStatusConfig[order.status]
									const StatusIcon = config.icon

									return (
										<tr
											key={order.id}
											role="button"
											tabIndex={0}
											className="hover:bg-accent/50 transition-colors cursor-pointer"
											onClick={() =>
												router.push(
													ROUTES.PRIVATE.COOK.ORDERS_COOK_ID(order.id),
												)
											}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault()
													router.push(
														ROUTES.PRIVATE.COOK.ORDERS_COOK_ID(order.id),
													)
												}
											}}
										>
											<td className="px-4 py-4">
												<span className="text-sm font-semibold text-foreground">
													#{order.id}
												</span>
											</td>
											<td className="px-4 py-4">
												<div>
													<span className="text-sm text-foreground">
														Table {order.table?.number}
													</span>
													{order.table?.seats && (
														<span className="text-xs text-muted-foreground ml-1">
															({order.table.seats} seats)
														</span>
													)}
												</div>
											</td>
											<td className="px-4 py-4">
												<div>
													<span className="text-sm text-foreground">
														{order.orderItems.reduce(
															(sum, item) => sum + item.quantity,
															0,
														)}
														x
													</span>
													<span className="text-xs text-muted-foreground ml-1">
														({order.orderItems.length} item
														{order.orderItems.length !== 1 ? 's' : ''})
													</span>
												</div>
											</td>
											<td className="px-4 py-4">
												<div
													className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
														order.status === 'FINISHED'
															? 'bg-[#047857] text-white'
															: 'bg-[#dc2626] text-white'
													}`}
												>
													<StatusIcon className="w-3.5 h-3.5" />
													<span className="text-xs font-medium">
														{config.label}
													</span>
												</div>
											</td>
											<td className="px-4 py-4">
												<div>
													<div className="text-sm text-foreground">
														{new Date(order.createdAt).toLocaleDateString(
															undefined,
															{
																month: 'short',
																day: 'numeric',
															},
														)}
													</div>
													<div className="text-xs text-muted-foreground">
														{new Date(order.createdAt).toLocaleTimeString(
															undefined,
															{
																hour: '2-digit',
																minute: '2-digit',
															},
														)}
													</div>
												</div>
											</td>
											<td className="px-4 py-4 text-right">
												<span className="text-sm font-semibold text-foreground">
													${order.total.toFixed(2)}
												</span>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>

					<div className="md:hidden divide-y divide-border">
						{orders.map((order) => {
							const config = orderStatusConfig[order.status]
							const StatusIcon = config.icon
							const totalQuantity = order.orderItems.reduce(
								(sum, item) => sum + item.quantity,
								0,
							)

							return (
								<Link
									key={order.id}
									href={ROUTES.PRIVATE.COOK.ORDERS_COOK_ID(order.id)}
									className="block p-4 hover:bg-accent/50 transition-colors"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1 min-w-0">
											<h3 className="text-foreground font-semibold mb-1">
												Order #{order.id}
											</h3>
											<div className="space-y-0.5">
												<p className="text-xs text-muted-foreground">
													Table {order.table?.number}
													{order.table?.seats &&
														` (${order.table.seats} seats)`}
												</p>
												<p className="text-xs text-muted-foreground">
													{totalQuantity}x • {order.orderItems.length} item
													{order.orderItems.length !== 1 ? 's' : ''}
												</p>
											</div>
										</div>
										<div
											className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
												order.status === 'FINISHED'
													? 'bg-[#047857] text-white'
													: 'bg-[#dc2626] text-white'
											}`}
										>
											<StatusIcon className="w-3.5 h-3.5" />
											<span className="text-xs font-medium">
												{config.label}
											</span>
										</div>
									</div>
									<div className="flex items-center justify-between pt-2 border-t border-border">
										<div>
											<div className="text-xs text-muted-foreground">
												{new Date(order.createdAt).toLocaleDateString(
													undefined,
													{
														month: 'short',
														day: 'numeric',
													},
												)}
											</div>
											<div className="text-[10px] text-muted-foreground">
												{new Date(order.createdAt).toLocaleTimeString(
													undefined,
													{
														hour: '2-digit',
														minute: '2-digit',
													},
												)}
											</div>
										</div>
										<span className="text-sm font-semibold text-foreground">
											${order.total.toFixed(2)}
										</span>
									</div>
								</Link>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

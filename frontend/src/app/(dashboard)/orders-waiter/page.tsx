'use client'

import { CreateOrderModal } from '@/app/(dashboard)/orders-waiter/components/CreateOrderModal'
import { orderStatusConfig } from '@/app/(dashboard)/orders-waiter/orderStatusConfig'
import { ROUTES } from '@/constants/pages.constant'
import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import { getWaiterMyOrdersService } from '@/services/order/get-waiter-my-orders.service'
import type { IOrderSummary, OrderStatus } from '@/types/order.interface'
import { Clock, Filter, History, Loader2, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

type StatusFilter = OrderStatus | 'ALL'

export default function OrdersWaiterPage() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [showFilters, setShowFilters] = useState(false)

	const statusParam = statusFilter === 'ALL' ? undefined : statusFilter

	const { data, isLoading, refetch } = useQuery({
		queryKey: [ORDER_QUERY_KEY.LIST_ACTIVE, statusParam],
		queryFn: () =>
			getWaiterMyOrdersService({
				phase: 'active',
				limit: 50,
				sortBy: 'createdAt',
				order: 'desc',
				status: statusParam,
			}),
	})

	const filteredOrders = useMemo(() => {
		const orders = data?.data?.data ?? []
		const q = searchQuery.trim().toLowerCase()
		if (!q) return orders
		return orders.filter((o: IOrderSummary) => {
			if (String(o.id).includes(q)) return true
			if (o.table?.number != null && String(o.table.number).includes(q))
				return true
			return o.orderItems.some(
				(i) =>
					i.dish.name.toLowerCase().includes(q) ||
					i.notes?.toLowerCase().includes(q),
			)
		})
	}, [data, searchQuery])

	useEffect(() => {
		const onVis = () => {
			if (!document.hidden) void refetch()
		}
		document.addEventListener('visibilitychange', onVis)
		return () => document.removeEventListener('visibilitychange', onVis)
	}, [refetch])

	useEffect(() => {
		const id = setInterval(() => {
			if (!document.hidden) void refetch()
		}, 30_000)
		return () => clearInterval(id)
	}, [refetch])

	const handleOrderCreated = (orderId?: number) => {
		setIsCreateModalOpen(false)
		void refetch()
		if (orderId != null)
			router.push(ROUTES.PRIVATE.WAITER.ORDERS_WAITER_ID(orderId))
	}

	const getTimeAgo = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffMs = now.getTime() - date.getTime()
		const diffMins = Math.floor(diffMs / 60000)
		const diffHours = Math.floor(diffMins / 60)

		if (diffMins < 1) return 'Just now'
		if (diffMins < 60) return `${diffMins}m ago`
		if (diffHours < 24) return `${diffHours}h ago`
		return date.toLocaleDateString()
	}

	const loading = isLoading

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<h1 className="text-foreground">Active Orders</h1>
						{!loading && filteredOrders.length > 0 && (
							<span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold">
								{filteredOrders.length}
							</span>
						)}
					</div>
					<p className="text-sm text-muted-foreground">
						Manage and track your current orders
						{!loading &&
							filteredOrders.length > 0 &&
							filteredOrders.some((o) => o.orderItems.some((i) => i.notes)) && (
								<span className="ml-2 text-warning">
									•{' '}
									{
										filteredOrders.filter((o) =>
											o.orderItems.some((i) => i.notes),
										).length
									}{' '}
									with special instructions
								</span>
							)}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Link
						href={ROUTES.PRIVATE.WAITER.ORDERS_WAITER_HISTORY}
						className="flex items-center gap-2 px-4 h-10 rounded-xl bg-card border border-border hover:bg-input transition-colors"
					>
						<History className="w-4 h-4 text-muted-foreground" />
						<span className="text-sm text-foreground hidden sm:inline">
							History
						</span>
					</Link>
					<button
						type="button"
						onClick={() => setIsCreateModalOpen(true)}
						className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-primary text-primary-foreground transition-opacity hover:opacity-90 shadow-md hover:shadow-lg"
					>
						<Plus className="w-4 h-4" />
						<span className="text-sm font-medium">New Order</span>
					</button>
				</div>
			</div>

			<div className="bg-card border border-border rounded-xl p-4 space-y-3">
				<div className="flex flex-col sm:flex-row gap-3">
					<div className="flex-1 flex items-center gap-2 bg-input rounded-xl px-3 py-2.5 border border-border focus-within:border-primary/50 focus-within:bg-background transition-all">
						<Search className="w-4 h-4 text-muted-foreground shrink-0" />
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
						<div className="flex flex-wrap gap-2">
							{(
								[
									'ALL',
									'PENDING',
									'IN_PROGRESS',
									'COMPLETE',
									'DELIVERED',
								] as const
							).map((status) => {
								const config =
									status !== 'ALL' ? orderStatusConfig[status] : null
								const StatusIcon = config?.icon

								return (
									<button
										key={status}
										type="button"
										onClick={() => setStatusFilter(status)}
										className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
											statusFilter === status
												? 'bg-primary text-primary-foreground'
												: 'bg-input text-muted-foreground hover:text-foreground hover:bg-input/80'
										}`}
									>
										{StatusIcon && <StatusIcon className="w-3.5 h-3.5" />}
										{status === 'ALL' ? 'All Active' : config?.label}
									</button>
								)
							})}
						</div>
					</div>
				)}
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="w-8 h-8 text-primary animate-spin" />
						<p className="text-sm text-muted-foreground">Loading orders...</p>
					</div>
				</div>
			) : filteredOrders.length === 0 ? (
				<div className="bg-card border border-border rounded-xl p-8 text-center">
					<div className="flex flex-col items-center gap-3">
						<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
							<Clock className="w-6 h-6 text-primary" />
						</div>
						<h3 className="text-foreground">No active orders</h3>
						<p className="text-sm text-muted-foreground">
							{searchQuery || statusFilter !== 'ALL'
								? 'No orders match your search criteria'
								: 'Create a new order to get started'}
						</p>
						{!searchQuery && statusFilter === 'ALL' && (
							<button
								type="button"
								onClick={() => setIsCreateModalOpen(true)}
								className="mt-2 flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-primary text-primary-foreground transition-opacity hover:opacity-90 shadow-md hover:shadow-lg"
							>
								<Plus className="w-4 h-4" />
								<span className="text-sm font-medium">Create Order</span>
							</button>
						)}
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
					{filteredOrders.map((order) => {
						const config = orderStatusConfig[order.status]
						const StatusIcon = config.icon

						return (
							<Link
								key={order.id}
								href={ROUTES.PRIVATE.WAITER.ORDERS_WAITER_ID(order.id)}
								className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all"
							>
								<div className="flex items-start justify-between mb-3">
									<div>
										<div className="flex items-center gap-2 mb-1">
											<h3 className="text-foreground font-semibold">
												Order #{order.id}
											</h3>
										</div>
										<p className="text-xs text-muted-foreground">
											Table {order.table?.number ?? '—'}
										</p>
									</div>
									<div
										className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
											order.status === 'PENDING'
												? 'bg-[#d97706] text-white'
												: order.status === 'IN_PROGRESS'
													? 'bg-[#7c3aed] text-white'
													: order.status === 'COMPLETE'
														? 'bg-[#10b981] text-white'
														: order.status === 'DELIVERED'
															? 'bg-[#059669] text-white'
															: order.status === 'FINISHED'
																? 'bg-[#047857] text-white'
																: 'bg-[#dc2626] text-white'
										}`}
									>
										<StatusIcon
											className={`w-3.5 h-3.5 ${
												order.status === 'IN_PROGRESS' ? 'animate-spin' : ''
											}`}
										/>
										<span className="text-xs font-medium">{config.label}</span>
									</div>
								</div>

								<div className="mb-3 pb-3 border-b border-border">
									<p className="text-xs text-muted-foreground mb-2">
										{order.orderItems.length} item
										{order.orderItems.length !== 1 ? 's' : ''}
									</p>
									<div className="space-y-1.5">
										{order.orderItems.slice(0, 2).map((item, idx) => (
											<div
												key={`${order.id}-item-${idx}`}
												className="space-y-0.5"
											>
												<div className="flex justify-between text-xs">
													<span className="text-foreground truncate">
														{item.quantity}x {item.dish?.name}
													</span>
													<span className="text-muted-foreground ml-2 shrink-0">
														${item.total.toFixed(2)}
													</span>
												</div>
												{item.notes && (
													<div className="flex items-start gap-1 pl-1">
														<span className="text-[10px] text-warning shrink-0">
															⚠
														</span>
														<span className="text-[10px] text-warning italic truncate">
															{item.notes}
														</span>
													</div>
												)}
											</div>
										))}
										{order.orderItems.length > 2 && (
											<p className="text-xs text-muted-foreground">
												+{order.orderItems.length - 2} more
											</p>
										)}
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">
										{getTimeAgo(order.createdAt)}
									</span>
									<span className="text-sm font-semibold text-foreground">
										${order.total.toFixed(2)}
									</span>
								</div>
							</Link>
						)
					})}
				</div>
			)}

			{isCreateModalOpen && (
				<CreateOrderModal
					onClose={() => setIsCreateModalOpen(false)}
					onSuccess={handleOrderCreated}
				/>
			)}
		</div>
	)
}

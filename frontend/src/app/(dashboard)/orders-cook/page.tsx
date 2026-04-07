'use client'

import { orderStatusConfig } from '@/app/(dashboard)/orders-waiter/orderStatusConfig'
import { ROUTES } from '@/constants/pages.constant'
import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import { assignOrderService } from '@/services/order/assign-order.service'
import { getCookMyOrdersService } from '@/services/order/get-cook-my-orders.service'
import { getFreeOrdersService } from '@/services/order/get-free-orders.service'
import { updateOrderStatusService } from '@/services/order/update-order-status.service'
import type { IOrderSummary, OrderStatus } from '@/types/order.interface'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	AlertCircle,
	CheckCircle2,
	ChefHat,
	Filter,
	History,
	Loader2,
	Plus,
	Search,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type MyOrdersStatusFilter = 'ALL' | 'IN_PROGRESS' | 'COMPLETE'

function filterOrdersBySearch(orders: IOrderSummary[], searchQuery: string) {
	const q = searchQuery.trim().toLowerCase()
	if (!q) return orders
	return orders.filter((o) => {
		if (String(o.id).includes(q)) return true
		if (o.table?.number != null && String(o.table.number).includes(q)) return true
		return o.orderItems.some(
			(i) =>
				i.dish.name.toLowerCase().includes(q) ||
				(i.notes && i.notes.toLowerCase().includes(q)),
		)
	})
}

export default function OrdersCookPage() {
	const queryClient = useQueryClient()
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<MyOrdersStatusFilter>('ALL')
	const [showFilters, setShowFilters] = useState(false)
	const [assigningOrderId, setAssigningOrderId] = useState<number | null>(null)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [confirmAction, setConfirmAction] = useState<{
		type: 'take' | 'complete'
		orderId: number
		orderNumber: string
	} | null>(null)

	const statusParam =
		statusFilter === 'ALL' ? undefined : (statusFilter as OrderStatus)

	const { data: freeData, isLoading: freeLoading } = useQuery({
		queryKey: [ORDER_QUERY_KEY.LIST_COOK_FREE],
		queryFn: () =>
			getFreeOrdersService({
				sortBy: 'createdAt',
				order: 'desc',
				limit: 50,
			}),
	})

	const { data: myData, isLoading: myLoading } = useQuery({
		queryKey: [ORDER_QUERY_KEY.LIST_COOK_ACTIVE, statusParam],
		queryFn: () =>
			getCookMyOrdersService({
				phase: 'active',
				status: statusParam,
				sortBy: 'createdAt',
				order: 'desc',
				limit: 50,
			}),
	})

	const freeOrdersRaw = freeData?.data?.data ?? []
	const myOrdersRaw = myData?.data?.data ?? []

	const freeOrders = useMemo(
		() => filterOrdersBySearch(freeOrdersRaw, searchQuery),
		[freeOrdersRaw, searchQuery],
	)
	const myOrders = useMemo(
		() => filterOrdersBySearch(myOrdersRaw, searchQuery),
		[myOrdersRaw, searchQuery],
	)

	const loading = freeLoading || myLoading

	const invalidateCookLists = () => {
		void queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY.LIST_COOK_FREE] })
		void queryClient.invalidateQueries({
			queryKey: [ORDER_QUERY_KEY.LIST_COOK_ACTIVE],
		})
		void queryClient.invalidateQueries({
			queryKey: [ORDER_QUERY_KEY.LIST_COOK_HISTORY],
		})
		void queryClient.invalidateQueries({
			queryKey: [ORDER_QUERY_KEY.DETAIL_PREFIX],
		})
	}

	const takeMutation = useMutation({
		mutationFn: (orderId: number) => assignOrderService(orderId),
		onSettled: () => {
			setAssigningOrderId(null)
			setShowConfirmModal(false)
			setConfirmAction(null)
			invalidateCookLists()
		},
	})

	const completeMutation = useMutation({
		mutationFn: (orderId: number) =>
			updateOrderStatusService(orderId, { status: 'COMPLETE' }),
		onSettled: () => {
			setAssigningOrderId(null)
			setShowConfirmModal(false)
			setConfirmAction(null)
			invalidateCookLists()
		},
	})

	useEffect(() => {
		const onVis = () => {
			if (!document.hidden) {
				void queryClient.invalidateQueries({
					queryKey: [ORDER_QUERY_KEY.LIST_COOK_FREE],
				})
				void queryClient.invalidateQueries({
					queryKey: [ORDER_QUERY_KEY.LIST_COOK_ACTIVE],
				})
			}
		}
		document.addEventListener('visibilitychange', onVis)
		return () => document.removeEventListener('visibilitychange', onVis)
	}, [queryClient])

	useEffect(() => {
		const id = setInterval(() => {
			if (!document.hidden) {
				void queryClient.invalidateQueries({
					queryKey: [ORDER_QUERY_KEY.LIST_COOK_FREE],
				})
				void queryClient.invalidateQueries({
					queryKey: [ORDER_QUERY_KEY.LIST_COOK_ACTIVE],
				})
			}
		}, 30_000)
		return () => clearInterval(id)
	}, [queryClient])

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

	const openConfirmModal = (
		type: 'take' | 'complete',
		orderId: number,
		orderNumber: string,
	) => {
		setConfirmAction({ type, orderId, orderNumber })
		setShowConfirmModal(true)
	}

	const handleConfirm = () => {
		if (!confirmAction) return
		setAssigningOrderId(confirmAction.orderId)
		if (confirmAction.type === 'take')
			takeMutation.mutate(confirmAction.orderId)
		else completeMutation.mutate(confirmAction.orderId)
	}

	const renderOrderCard = (order: IOrderSummary, isFree: boolean) => {
		const config = orderStatusConfig[order.status]
		const StatusIcon = config.icon

		const handleActionClick = (e: React.MouseEvent, type: 'take' | 'complete') => {
			e.preventDefault()
			e.stopPropagation()
			openConfirmModal(type, order.id, `#${order.id}`)
		}

		const canComplete = order.status === 'IN_PROGRESS'
		const busy = assigningOrderId === order.id

		return (
			<Link
				key={order.id}
				href={ROUTES.PRIVATE.COOK.ORDERS_COOK_ID(order.id)}
				className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer block"
			>
				<div className="flex items-start justify-between mb-3">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1">
							<h3 className="text-foreground font-semibold">Order #{order.id}</h3>
						</div>
						<p className="text-xs text-muted-foreground">
							Table {order.table?.number}
						</p>
						<p className="text-xs text-muted-foreground">
							Waiter: {order.waiter?.name}
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
						{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
					</p>
					<div className="space-y-1.5">
						{order.orderItems.slice(0, 2).map((item, idx) => (
							<div key={idx} className="space-y-0.5">
								<div className="flex justify-between text-xs">
									<span className="text-foreground truncate">
										{item.quantity}x {item.dish?.name}
									</span>
									<span className="text-muted-foreground ml-2 flex-shrink-0">
										${item.total.toFixed(2)}
									</span>
								</div>
								{item.notes && (
									<div className="flex items-start gap-1 pl-1">
										<span className="text-[10px] text-warning flex-shrink-0">⚠</span>
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

				<div className="flex items-center justify-between gap-2">
					<span className="text-xs text-muted-foreground">
						{getTimeAgo(order.createdAt)}
					</span>
					{isFree ? (
						<button
							type="button"
							onClick={(e) => handleActionClick(e, 'take')}
							disabled={busy}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed z-10 relative"
						>
							{busy ? (
								<Loader2 className="w-3.5 h-3.5 animate-spin" />
							) : (
								<Plus className="w-3.5 h-3.5" />
							)}
							Take Order
						</button>
					) : canComplete ? (
						<button
							type="button"
							onClick={(e) => handleActionClick(e, 'complete')}
							disabled={busy}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10b981] text-white hover:bg-[#059669] transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed z-10 relative shadow-md"
						>
							{busy ? (
								<Loader2 className="w-3.5 h-3.5 animate-spin" />
							) : (
								<CheckCircle2 className="w-3.5 h-3.5" />
							)}
							Complete
						</button>
					) : null}
				</div>
			</Link>
		)
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<ChefHat className="w-6 h-6 text-primary" />
						<h1 className="text-foreground">Cook Dashboard</h1>
					</div>
					<p className="text-sm text-muted-foreground">
						Manage free and assigned orders
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Link
						href={ROUTES.PRIVATE.COOK.ORDERS_COOK_HISTORY}
						className="flex items-center gap-2 px-4 h-10 rounded-xl bg-card border border-border hover:bg-input transition-colors"
					>
						<History className="w-4 h-4 text-muted-foreground" />
						<span className="text-sm text-foreground hidden sm:inline">History</span>
					</Link>
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
						<div className="flex flex-wrap gap-2">
							{(['ALL', 'IN_PROGRESS', 'COMPLETE'] as const).map((status) => {
								const cfg = status !== 'ALL' ? orderStatusConfig[status] : null
								const StatusIcon = cfg?.icon
								const label =
									status === 'ALL' ? 'All My Orders' : orderStatusConfig[status].label

								return (
									<button
										type="button"
										key={status}
										onClick={() => setStatusFilter(status)}
										className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
											statusFilter === status
												? 'bg-primary text-primary-foreground'
												: 'bg-input text-muted-foreground hover:text-foreground hover:bg-input/80'
										}`}
									>
										{StatusIcon && <StatusIcon className="w-3.5 h-3.5" />}
										{label}
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
			) : (
				<div className="space-y-6">
					<div>
						<div className="flex items-center justify-between mb-4">
							<div>
								<h2 className="text-foreground font-semibold">Free Orders</h2>
								<p className="text-xs text-muted-foreground">
									Available orders waiting to be assigned
								</p>
							</div>
							{freeOrders.length > 0 && (
								<span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-warning text-white text-xs font-bold">
									{freeOrders.length}
								</span>
							)}
						</div>

						{freeOrders.length === 0 ? (
							<div className="bg-card border border-border rounded-xl p-8 text-center">
								<div className="flex flex-col items-center gap-3">
									<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
										<CheckCircle2 className="w-6 h-6 text-primary" />
									</div>
									<h3 className="text-foreground">No free orders</h3>
									<p className="text-sm text-muted-foreground">
										All orders have been assigned
									</p>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
								{freeOrders.map((order) => renderOrderCard(order, true))}
							</div>
						)}
					</div>

					<div>
						<div className="flex items-center justify-between mb-4">
							<div>
								<h2 className="text-foreground font-semibold">My Orders</h2>
								<p className="text-xs text-muted-foreground">
									Orders currently assigned to you
								</p>
							</div>
							{myOrders.length > 0 && (
								<span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold">
									{myOrders.length}
								</span>
							)}
						</div>

						{myOrders.length === 0 ? (
							<div className="bg-card border border-border rounded-xl p-8 text-center">
								<div className="flex flex-col items-center gap-3">
									<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
										<ChefHat className="w-6 h-6 text-primary" />
									</div>
									<h3 className="text-foreground">No assigned orders</h3>
									<p className="text-sm text-muted-foreground">
										{searchQuery || statusFilter !== 'ALL'
											? 'No orders match your search criteria'
											: 'Take a free order to get started'}
									</p>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
								{myOrders.map((order) => renderOrderCard(order, false))}
							</div>
						)}
					</div>
				</div>
			)}

			{showConfirmModal && confirmAction && (
				<div
					role="presentation"
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
					onClick={() => {
						if (assigningOrderId === null) {
							setShowConfirmModal(false)
							setConfirmAction(null)
						}
					}}
				>
					<div
						role="dialog"
						className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
					>
						<div className="flex items-start gap-4 mb-6">
							<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
								<AlertCircle className="w-6 h-6 text-primary" />
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="text-foreground font-semibold mb-1">
									{confirmAction.type === 'take'
										? 'Take Order'
										: 'Mark as Complete'}
								</h3>
								<p className="text-sm text-muted-foreground">
									{confirmAction.type === 'take'
										? `Are you sure you want to take order ${confirmAction.orderNumber}? This will assign the order to you and change its status to In Progress.`
										: `Are you sure you want to mark order ${confirmAction.orderNumber} as complete? The order will be ready for the waiter to deliver.`}
								</p>
							</div>
						</div>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => {
									setShowConfirmModal(false)
									setConfirmAction(null)
								}}
								disabled={assigningOrderId !== null}
								className="flex-1 px-4 h-10 rounded-xl bg-input hover:bg-input/80 text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="text-sm font-medium">Cancel</span>
							</button>
							<button
								type="button"
								onClick={handleConfirm}
								disabled={assigningOrderId !== null}
								className={`flex-1 flex items-center justify-center gap-2 px-4 h-10 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
									confirmAction.type === 'take'
										? 'bg-gradient-primary text-primary-foreground hover:opacity-90'
										: 'bg-[#10b981] text-white hover:bg-[#059669]'
								}`}
							>
								{assigningOrderId !== null ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : confirmAction.type === 'take' ? (
									<>
										<Plus className="w-4 h-4" />
										<span className="text-sm font-medium">Take Order</span>
									</>
								) : (
									<>
										<CheckCircle2 className="w-4 h-4" />
										<span className="text-sm font-medium">Mark Complete</span>
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

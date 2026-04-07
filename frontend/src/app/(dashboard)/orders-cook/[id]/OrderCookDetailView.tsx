'use client'

import { orderStatusConfig } from '@/app/(dashboard)/orders-waiter/orderStatusConfig'
import { ROUTES } from '@/constants/pages.constant'
import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import { assignOrderService } from '@/services/order/assign-order.service'
import { getOrderByIdService } from '@/services/order/get-order-by-id.service'
import { updateOrderStatusService } from '@/services/order/update-order-status.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	CheckCircle2,
	ChefHat,
	Clock,
	FileText,
	Loader2,
	MapPin,
	Plus,
	User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function OrderCookDetailView({ orderId }: { orderId: number }) {
	const router = useRouter()
	const queryClient = useQueryClient()

	const {
		data: orderRes,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ORDER_QUERY_KEY.DETAIL(orderId),
		queryFn: () => getOrderByIdService(orderId),
	})

	const order = orderRes?.data

	const invalidateCook = () => {
		void queryClient.invalidateQueries({
			queryKey: ORDER_QUERY_KEY.DETAIL(orderId),
		})
		void queryClient.invalidateQueries({
			queryKey: [ORDER_QUERY_KEY.LIST_COOK_FREE],
		})
		void queryClient.invalidateQueries({
			queryKey: [ORDER_QUERY_KEY.LIST_COOK_ACTIVE],
		})
		void queryClient.invalidateQueries({
			queryKey: [ORDER_QUERY_KEY.LIST_COOK_HISTORY],
		})
	}

	const takeMutation = useMutation({
		mutationFn: () => assignOrderService(orderId),
		onSuccess: invalidateCook,
	})

	const completeMutation = useMutation({
		mutationFn: () => updateOrderStatusService(orderId, { status: 'COMPLETE' }),
		onSuccess: () => {
			invalidateCook()
			router.push(ROUTES.PRIVATE.COOK.ORDERS_COOK)
		},
	})

	const actionLoading = takeMutation.isPending || completeMutation.isPending

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="w-8 h-8 text-primary animate-spin" />
					<p className="text-sm text-muted-foreground">
						Loading order details...
					</p>
				</div>
			</div>
		)
	}

	if (isError || !order) {
		return (
			<div className="bg-card border border-border rounded-xl p-8 text-center">
				<div className="flex flex-col items-center gap-3">
					<div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
						<AlertCircle className="w-6 h-6 text-destructive" />
					</div>
					<h3 className="text-foreground">Order not found</h3>
					<p className="text-sm text-muted-foreground">
						The order you&apos;re looking for doesn&apos;t exist or could not be
						loaded
					</p>
					<Link
						href={ROUTES.PRIVATE.COOK.ORDERS_COOK}
						className="mt-2 flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
					>
						<ArrowLeft className="w-4 h-4" />
						<span className="text-sm font-medium">Back to Dashboard</span>
					</Link>
				</div>
			</div>
		)
	}

	const config = orderStatusConfig[order.status]
	const StatusIcon = config.icon
	const canTakeOrder = order.status === 'PENDING' && !order.cook
	const canComplete = order.status === 'IN_PROGRESS'

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
						<h1 className="text-foreground mb-1">Order #{order.id}</h1>
						<p className="text-sm text-muted-foreground">
							View and manage order details
						</p>
					</div>
				</div>

				<div
					className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
						order.status === 'PENDING'
							? 'bg-[#d97706] text-white'
							: order.status === 'IN_PROGRESS'
								? 'bg-[#7c3aed] text-white'
								: order.status === 'COMPLETE'
									? 'bg-[#10b981] text-white'
									: order.status === 'CANCELED'
										? 'bg-[#dc2626] text-white'
										: order.status === 'DELIVERED'
											? 'bg-[#059669] text-white'
											: 'bg-[#047857] text-white'
					}`}
				>
					<StatusIcon
						className={`w-5 h-5 ${
							order.status === 'IN_PROGRESS' ? 'animate-spin' : ''
						}`}
					/>
					<span className="text-sm font-semibold">{config.label}</span>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
				<div className="lg:col-span-2 space-y-4 sm:space-y-6">
					{order.status !== 'CANCELED' && (
						<div className="bg-card border border-border rounded-xl p-4 sm:p-6">
							<h2 className="text-foreground mb-4">Order Progress</h2>
							<div className="relative">
								<div className="absolute left-5 top-3 bottom-3 w-0.5 bg-border" />

								<div className="space-y-4">
									<div className="relative flex items-start gap-3">
										<div
											className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
												order.status === 'PENDING'
													? 'bg-warning border-warning'
													: [
																'IN_PROGRESS',
																'COMPLETE',
																'DELIVERED',
																'FINISHED',
														  ].includes(order.status)
														? 'bg-success border-success'
														: 'bg-card border-border'
											}`}
										>
											<Clock
												className={`w-5 h-5 ${
													order.status === 'PENDING' ||
													[
														'IN_PROGRESS',
														'COMPLETE',
														'DELIVERED',
														'FINISHED',
													].includes(order.status)
														? 'text-white'
														: 'text-muted-foreground'
												}`}
											/>
										</div>
										<div className="flex-1 pt-1.5">
											<p className="text-sm font-medium text-foreground">
												Pending
											</p>
											<p className="text-xs text-muted-foreground">
												Order placed
											</p>
										</div>
									</div>

									<div className="relative flex items-start gap-3">
										<div
											className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
												order.status === 'IN_PROGRESS'
													? 'bg-info border-info'
													: ['COMPLETE', 'DELIVERED', 'FINISHED'].includes(
																order.status,
														  )
														? 'bg-success border-success'
														: 'bg-card border-border'
											}`}
										>
											<Loader2
												className={`w-5 h-5 ${
													order.status === 'IN_PROGRESS'
														? 'text-white animate-spin'
														: ['COMPLETE', 'DELIVERED', 'FINISHED'].includes(
																	order.status,
															  )
															? 'text-white'
															: 'text-muted-foreground'
												}`}
											/>
										</div>
										<div className="flex-1 pt-1.5">
											<p className="text-sm font-medium text-foreground">
												In Progress
											</p>
											<p className="text-xs text-muted-foreground">
												Being prepared
											</p>
										</div>
									</div>

									<div className="relative flex items-start gap-3">
										<div
											className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
												order.status === 'COMPLETE'
													? 'bg-success border-success'
													: ['DELIVERED', 'FINISHED'].includes(order.status)
														? 'bg-success border-success'
														: 'bg-card border-border'
											}`}
										>
											<CheckCircle2
												className={`w-5 h-5 ${
													['COMPLETE', 'DELIVERED', 'FINISHED'].includes(
														order.status,
													)
														? 'text-white'
														: 'text-muted-foreground'
												}`}
											/>
										</div>
										<div className="flex-1 pt-1.5">
											<p className="text-sm font-medium text-foreground">
												Complete
											</p>
											<p className="text-xs text-muted-foreground">
												Ready to serve
											</p>
										</div>
									</div>

									<div className="relative flex items-start gap-3">
										<div
											className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
												order.status === 'DELIVERED'
													? 'bg-success border-success'
													: order.status === 'FINISHED'
														? 'bg-success border-success'
														: 'bg-card border-border'
											}`}
										>
											<CheckCircle2
												className={`w-5 h-5 ${
													['DELIVERED', 'FINISHED'].includes(order.status)
														? 'text-white'
														: 'text-muted-foreground'
												}`}
											/>
										</div>
										<div className="flex-1 pt-1.5">
											<p className="text-sm font-medium text-foreground">
												Delivered
											</p>
											<p className="text-xs text-muted-foreground">
												Served to table
											</p>
										</div>
									</div>

									<div className="relative flex items-start gap-3">
										<div
											className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
												order.status === 'FINISHED'
													? 'bg-success border-success'
													: 'bg-card border-border'
											}`}
										>
											<CheckCircle2
												className={`w-5 h-5 ${
													order.status === 'FINISHED'
														? 'text-white'
														: 'text-muted-foreground'
												}`}
											/>
										</div>
										<div className="flex-1 pt-1.5">
											<p className="text-sm font-medium text-foreground">
												Finished
											</p>
											<p className="text-xs text-muted-foreground">
												Order complete
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className="bg-card border border-border rounded-xl p-4 sm:p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-foreground">Order Items</h2>
							<span className="text-xs text-muted-foreground">
								{order.orderItems.length} item
								{order.orderItems.length !== 1 ? 's' : ''}
							</span>
						</div>
						<div className="space-y-4">
							{order.orderItems.map((item, idx) => (
								<div
									key={idx}
									className="pb-4 border-b border-border last:border-0 last:pb-0"
								>
									<div className="flex items-start gap-3 mb-2">
										<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
											<span className="text-base font-bold text-primary">
												{item.quantity}
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="text-foreground font-semibold mb-1">
												{item.dish?.name}
											</h4>
											<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
												<span className="text-xs text-muted-foreground">
													${item.price.toFixed(2)} per item
												</span>
												<span className="text-xs text-muted-foreground">•</span>
												<span className="text-xs text-muted-foreground">
													Dish ID: {item.dish?.id}
												</span>
											</div>
										</div>
										<div className="flex-shrink-0 text-right">
											<div className="text-base font-bold text-primary">
												${item.total.toFixed(2)}
											</div>
											<div className="text-[10px] text-muted-foreground">
												subtotal
											</div>
										</div>
									</div>

									{item.notes && (
										<div className="pl-0 sm:pl-12 mt-2">
											<div className="bg-warning/10 border border-border rounded-lg px-3 py-2.5">
												<div className="flex items-start gap-2">
													<span className="text-warning text-base flex-shrink-0">
														⚠
													</span>
													<div className="flex-1 min-w-0">
														<p className="text-xs font-semibold text-warning mb-1">
															Special Instructions:
														</p>
														<p className="text-sm text-foreground">
															{item.notes}
														</p>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</div>

						<div className="mt-4 pt-4 border-t-2 border-border">
							<div className="flex items-center justify-between mb-2">
								<div>
									<span className="text-foreground font-semibold">
										Order Total
									</span>
									<span className="text-xs text-muted-foreground ml-2">
										(
										{order.orderItems.reduce(
											(sum, item) => sum + item.quantity,
											0,
										)}{' '}
										items)
									</span>
								</div>
								<span className="text-2xl font-bold text-primary">
									${order.total.toFixed(2)}
								</span>
							</div>
						</div>
					</div>

					{(canTakeOrder || canComplete) && (
						<div className="bg-card border border-border rounded-xl p-4 sm:p-6">
							<h2 className="text-foreground mb-4">Actions</h2>
							<div className="flex flex-wrap gap-3">
								{canTakeOrder && (
									<button
										type="button"
										onClick={() => takeMutation.mutate()}
										disabled={actionLoading}
										className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{takeMutation.isPending ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Plus className="w-4 h-4" />
										)}
										<span className="text-sm font-medium">Take Order</span>
									</button>
								)}
								{canComplete && (
									<button
										type="button"
										onClick={() => completeMutation.mutate()}
										disabled={actionLoading}
										className="flex items-center gap-2 px-4 h-10 rounded-xl bg-[#10b981] text-white hover:bg-[#059669] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{completeMutation.isPending ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<CheckCircle2 className="w-4 h-4" />
										)}
										<span className="text-sm font-medium">
											Mark as Complete
										</span>
									</button>
								)}
							</div>
						</div>
					)}
				</div>

				<div className="space-y-4 sm:space-y-6">
					<div className="bg-card border border-border rounded-xl p-4 sm:p-6">
						<h2 className="text-foreground mb-4">Order Information</h2>
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<FileText className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-muted-foreground mb-1">Order ID</p>
									<p className="text-sm text-foreground font-medium">
										#{order.id}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<MapPin className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-muted-foreground mb-1">Table</p>
									<p className="text-sm text-foreground font-medium">
										Table {order.table?.number}
									</p>
									{order.table?.seats && (
										<p className="text-xs text-muted-foreground">
											Capacity: {order.table.seats} seats
										</p>
									)}
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<User className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-muted-foreground mb-1">Waiter</p>
									<p className="text-sm text-foreground font-medium">
										{order.waiter?.name}
									</p>
									{order.waiter?.email && (
										<p className="text-xs text-muted-foreground">
											{order.waiter.email}
										</p>
									)}
								</div>
							</div>

							{order.cook && (
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
										<ChefHat className="w-5 h-5 text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-muted-foreground mb-1">Cook</p>
										<p className="text-sm text-foreground font-medium">
											{order.cook.name}
										</p>
										{order.cook.email && (
											<p className="text-xs text-muted-foreground">
												{order.cook.email}
											</p>
										)}
									</div>
								</div>
							)}

							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<Calendar className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-muted-foreground mb-1">
										Created At
									</p>
									<p className="text-sm text-foreground font-medium">
										{new Date(order.createdAt).toLocaleDateString(undefined, {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
									</p>
									<p className="text-xs text-muted-foreground">
										{new Date(order.createdAt).toLocaleTimeString(undefined, {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<Clock className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-muted-foreground mb-1">
										Last Updated
									</p>
									<p className="text-sm text-foreground font-medium">
										{new Date(order.updatedAt).toLocaleDateString(undefined, {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
									</p>
									<p className="text-xs text-muted-foreground">
										{new Date(order.updatedAt).toLocaleTimeString(undefined, {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-card border border-border rounded-xl p-4 sm:p-6">
						<h2 className="text-foreground mb-4">Summary</h2>
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">Items</span>
								<span className="text-sm text-foreground font-medium">
									{order.orderItems.length}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									Total Quantity
								</span>
								<span className="text-sm text-foreground font-medium">
									{order.orderItems.reduce(
										(sum, item) => sum + item.quantity,
										0,
									)}
								</span>
							</div>
							<div className="flex justify-between items-center pt-2 border-t border-border">
								<span className="text-sm text-foreground font-semibold">
									Total Price
								</span>
								<span className="text-lg font-bold text-primary">
									${order.total.toFixed(2)}
								</span>
							</div>
							{order.orderItems.some((item) => item.notes) && (
								<div className="pt-2 border-t border-border">
									<div className="flex items-center gap-1.5">
										<span className="text-warning text-lg">⚠</span>
										<span className="text-xs text-warning font-medium">
											Contains special instructions
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

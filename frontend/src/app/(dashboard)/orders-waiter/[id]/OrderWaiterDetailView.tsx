'use client'

import { orderStatusConfig } from '@/app/(dashboard)/orders-waiter/orderStatusConfig'
import { Modal } from '@/components/ui/Modal'
import { ROUTES, UserRole } from '@/constants/pages.constant'
import { MUTATION_KEY } from '@/constants/mutation-keys.constant'
import {
	ORDER_DETAIL_QUERY_OPTIONS,
	ORDER_QUERY_KEY,
} from '@/constants/query-keys.constant'
import { getOrderByIdService } from '@/services/order/get-order-by-id.service'
import type { IAxiosError } from '@/types/error.interface'
import type { OrderUpdateStatusVariables } from '@/types/mutation.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useAlert } from '@/providers/AlertContext'
import { useAuthStore } from '@/store/auth.store'
import { useRegisteredMutation } from '@/hooks/useRegisteredMutation'
import { useQuery } from '@tanstack/react-query'
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
	User,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface IOrderWaiterDetailViewProps {
	orderId: number
}

export function OrderWaiterDetailView({
	orderId,
}: IOrderWaiterDetailViewProps) {
	const router = useRouter()
	const { showError, showSuccess } = useAlert()
	const userRole = useAuthStore((s) => s.userRole)
	const isReadOnlyViewer = userRole === UserRole.ADMIN
	const [showCancelConfirm, setShowCancelConfirm] = useState(false)

	const {
		data: orderRes,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ORDER_QUERY_KEY.DETAIL(orderId),
		queryFn: () => getOrderByIdService(orderId),
		...ORDER_DETAIL_QUERY_OPTIONS,
	})

	const order = orderRes?.data ?? null

	const cancelMutation = useRegisteredMutation<unknown, Error, number>({
		mutationKey: MUTATION_KEY.ORDER.CANCEL,
		onSuccess: () => {
			showSuccess('Order canceled')
			setShowCancelConfirm(false)
		},
		onError: (err) =>
			showError(parseBackendError(err as unknown as IAxiosError).join('\n')),
	})

	const statusMutation = useRegisteredMutation<
		unknown,
		Error,
		OrderUpdateStatusVariables
	>({
		mutationKey: MUTATION_KEY.ORDER.UPDATE_STATUS,
		onSuccess: (_, { status }) => {
			showSuccess(
				status === 'DELIVERED' ? 'Marked as delivered' : 'Order finished',
			)
			if (status === 'FINISHED')
				router.push(ROUTES.PRIVATE.WAITER.ORDERS_WAITER)
		},
		onError: (err) =>
			showError(parseBackendError(err as unknown as IAxiosError).join('\n')),
	})

	const actionLoading = cancelMutation.isPending || statusMutation.isPending

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
						The order you&apos;re looking for doesn&apos;t exist
					</p>
					{isReadOnlyViewer ? (
						<button
							type="button"
							onClick={() => router.back()}
							className="mt-2 flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-primary text-primary-foreground transition-opacity hover:opacity-90"
						>
							<ArrowLeft className="w-4 h-4" />
							<span className="text-sm font-medium">Go back</span>
						</button>
					) : (
						<Link
							href={ROUTES.PRIVATE.WAITER.ORDERS_WAITER}
							className="mt-2 flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-primary text-primary-foreground transition-opacity hover:opacity-90"
						>
							<ArrowLeft className="w-4 h-4" />
							<span className="text-sm font-medium">Back to Orders</span>
						</Link>
					)}
				</div>
			</div>
		)
	}

	const config = orderStatusConfig[order.status]
	const StatusIcon = config.icon
	const canCancel = order.status === 'PENDING'
	const canDeliver = order.status === 'COMPLETE'
	const canFinish = order.status === 'DELIVERED'
	const showActions = canCancel || canDeliver || canFinish
	const canPerformActions = userRole === UserRole.WAITER
	const actionsDisabled = actionLoading || !canPerformActions

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center gap-3">
					{isReadOnlyViewer ? (
						<button
							type="button"
							onClick={() => router.back()}
							className="flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border hover:bg-input transition-colors"
						>
							<ArrowLeft className="w-5 h-5 text-foreground" />
						</button>
					) : (
						<Link
							href={ROUTES.PRIVATE.WAITER.ORDERS_WAITER}
							className="flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border hover:bg-input transition-colors"
						>
							<ArrowLeft className="w-5 h-5 text-foreground" />
						</Link>
					)}
					<div>
						<h1 className="text-foreground mb-1">Order #{order.id}</h1>
						<p className="text-sm text-muted-foreground">
							{isReadOnlyViewer
								? 'View order details'
								: 'View and manage order details'}
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
											className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
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
													order.status === 'PENDING'
														? 'text-white'
														: [
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
											className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
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
											className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
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
											className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
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
											className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${
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
									key={`${item.dish.id}-${idx}`}
									className="pb-4 border-b border-border last:border-0 last:pb-0"
								>
									<div className="flex items-start gap-3 mb-2">
										<div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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
										<div className="shrink-0 text-right">
											<div className="text-base font-bold text-primary">
												${item.total.toFixed(2)}
											</div>
											<div className="text-[10px] text-muted-foreground">
												subtotal
											</div>
										</div>
									</div>

									{item.notes && (
										<div className="mt-2 sm:ml-[3.25rem]">
											<div className="bg-warning/10 border border-border rounded-lg px-3 py-2.5">
												<div className="flex items-start gap-2">
													<span className="text-warning text-base shrink-0">
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

					{showActions && canPerformActions && (
						<div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
							<div>
								<h2 className="text-foreground">Actions</h2>
							</div>
							<div className="flex flex-wrap gap-3">
								{canDeliver && (
									<button
										type="button"
										onClick={() =>
											statusMutation.mutate({
												orderId,
												status: 'DELIVERED',
											})
										}
										disabled={actionsDisabled}
										title={
											canPerformActions ? undefined : 'Waiter role required'
										}
										className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-primary text-primary-foreground transition-opacity hover:opacity-90 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<CheckCircle2 className="w-4 h-4" />
										<span className="text-sm font-medium">
											Mark as Delivered
										</span>
									</button>
								)}
								{canFinish && (
									<button
										type="button"
										onClick={() =>
											statusMutation.mutate({
												orderId,
												status: 'FINISHED',
											})
										}
										disabled={actionsDisabled}
										title={
											canPerformActions ? undefined : 'Waiter role required'
										}
										className="flex items-center gap-2 px-4 h-10 rounded-xl bg-success text-white hover:bg-success-hover transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<CheckCircle2 className="w-4 h-4" />
										<span className="text-sm font-medium">Finish Order</span>
									</button>
								)}
								{canCancel && (
									<button
										type="button"
										onClick={() => setShowCancelConfirm(true)}
										disabled={actionsDisabled}
										title={
											canPerformActions ? undefined : 'Waiter role required'
										}
										className="flex items-center gap-2 px-4 h-10 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive-hover transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<XCircle className="w-4 h-4" />
										<span className="text-sm font-medium">Cancel Order</span>
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
								<div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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
								<div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<MapPin className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-muted-foreground mb-1">Table</p>
									<p className="text-sm text-foreground font-medium">
										Table {order.table?.number ?? '—'}
									</p>
									{order.table?.seats != null && (
										<p className="text-xs text-muted-foreground">
											Capacity: {order.table.seats} seats
										</p>
									)}
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<User className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-muted-foreground mb-1">Waiter</p>
									<p className="text-sm text-foreground font-medium">
										{order.waiter?.name ?? '—'}
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
									<div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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
								<div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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
								<div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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

			<Modal
				isOpen={showCancelConfirm}
				onClose={() => setShowCancelConfirm(false)}
				disableClose={actionLoading}
			>
				<div className="p-6">
					<div className="flex items-start gap-4 mb-6">
						<div className="shrink-0 w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
							<AlertCircle className="w-6 h-6 text-destructive" />
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="text-foreground font-semibold mb-1">
								Cancel Order
							</h3>
							<p className="text-sm text-muted-foreground">
								Are you sure you want to cancel this order? This action cannot
								be undone.
							</p>
						</div>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setShowCancelConfirm(false)}
							disabled={actionLoading}
							className="flex-1 px-4 h-10 rounded-xl bg-input hover:bg-input/80 text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span className="text-sm font-medium">Keep Order</span>
						</button>
						<button
							type="button"
							onClick={() => cancelMutation.mutate(orderId)}
							disabled={actionLoading}
							className="flex-1 flex items-center justify-center gap-2 px-4 h-10 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive-hover transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{actionLoading ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<>
									<XCircle className="w-4 h-4" />
									<span className="text-sm font-medium">Cancel Order</span>
								</>
							)}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}

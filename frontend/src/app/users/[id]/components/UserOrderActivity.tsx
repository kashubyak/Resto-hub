'use client'

import { orderStatusConfig } from '@/app/(dashboard)/orders-waiter/orderStatusConfig'
import { ROUTES, UserRole } from '@/constants/pages.constant'
import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useAlert } from '@/providers/AlertContext'
import { getAdminAllOrdersService } from '@/services/order/get-admin-all-orders.service'
import type { IAxiosError } from '@/types/error.interface'
import type { IOrderSummary } from '@/types/order.interface'
import type { IUser } from '@/types/user.interface'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Calendar, ClipboardList, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { formatUserDateLong } from '../../userDisplay'

const PAGE_SIZE = 10

interface IUserOrderActivityProps {
	user: IUser
}

export function UserOrderActivity({ user }: IUserOrderActivityProps) {
	const { hasRole } = useCurrentUser()
	const { showBackendError } = useAlert()
	const isViewerAdmin = hasRole(UserRole.ADMIN)
	const isWaiter = user.role === UserRole.WAITER
	const isCook = user.role === UserRole.COOK
	const isAdminProfile = user.role === UserRole.ADMIN

	const listParams = useMemo(() => {
		if (!isWaiter && !isCook) return null
		return {
			waiterId: isWaiter ? user.id : undefined,
			cookId: isCook ? user.id : undefined,
			limit: PAGE_SIZE,
			sortBy: 'createdAt' as const,
			order: 'desc' as const,
		}
	}, [isWaiter, isCook, user.id])

	const ordersQueryEnabled = Boolean(
		isViewerAdmin && listParams !== null && !isAdminProfile,
	)

	const activityQueryKey =
		listParams != null
			? ORDER_QUERY_KEY.ADMIN_LIST({
					waiterId: listParams.waiterId,
					cookId: listParams.cookId,
					limit: listParams.limit,
					sortBy: listParams.sortBy,
					order: listParams.order,
				})
			: (['user-order-activity', user.id, user.role, 'off'] as const)

	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: activityQueryKey,
		queryFn: async ({ pageParam }) => {
			const res = await getAdminAllOrdersService({
				...listParams!,
				page: pageParam,
			})
			return res.data
		},
		initialPageParam: 1,
		getNextPageParam: (last) =>
			last.page < last.totalPages ? last.page + 1 : undefined,
		enabled: ordersQueryEnabled,
	})

	useEffect(() => {
		if (!isError || !error) return
		showBackendError(error as unknown as IAxiosError)
	}, [isError, error, showBackendError])

	const orders: IOrderSummary[] = useMemo(
		() => data?.pages.flatMap((p) => p.data) ?? [],
		[data?.pages],
	)

	if (isAdminProfile) {
		return (
			<div className="space-y-4">
				<p className="text-muted-foreground text-sm">
					Admins are not linked to orders as waiter or cook. Below are account
					timestamps only — not order activity.
				</p>
				<ul className="space-y-3 text-sm">
					<li className="flex gap-3 rounded-xl border border-border bg-accent/30 p-3">
						<Calendar className="text-primary mt-0.5 h-4 w-4 shrink-0" />
						<div>
							<p className="text-muted-foreground text-xs">Account created</p>
							<p className="text-foreground font-medium">
								{formatUserDateLong(user.createdAt)}
							</p>
						</div>
					</li>
					<li className="flex gap-3 rounded-xl border border-border bg-accent/30 p-3">
						<Calendar className="text-primary mt-0.5 h-4 w-4 shrink-0" />
						<div>
							<p className="text-muted-foreground text-xs">
								Profile last updated
							</p>
							<p className="text-foreground font-medium">
								{formatUserDateLong(user.updatedAt)}
							</p>
						</div>
					</li>
				</ul>
			</div>
		)
	}

	if (!ordersQueryEnabled) {
		return (
			<p className="text-muted-foreground py-6 text-center text-sm">
				Sign in as an admin to load order activity for this user.
			</p>
		)
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground text-xs leading-relaxed">
				Orders where this user is{' '}
				{isWaiter ? 'the assigned waiter' : 'the assigned cook'}. Status and
				dates reflect the order as stored now — step-by-step status history is
				not recorded by the API.
			</p>

			{isLoading ? (
				<div className="flex flex-col items-center justify-center gap-2 py-10">
					<Loader2 className="text-primary h-8 w-8 animate-spin" />
					<p className="text-muted-foreground text-sm">Loading activity…</p>
				</div>
			) : orders.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
					<ClipboardList className="text-muted-foreground h-10 w-10 opacity-50" />
					<p className="text-muted-foreground text-sm">No orders found yet.</p>
				</div>
			) : (
				<ul className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
					{orders.map((order) => {
						const cfg = orderStatusConfig[order.status]
						const Icon = cfg.icon
						const itemCount = order.orderItems?.length ?? 0
						const orderDetailHref =
							user.role === UserRole.COOK
								? ROUTES.PRIVATE.COOK.ORDERS_COOK_ID(order.id)
								: ROUTES.PRIVATE.WAITER.ORDERS_WAITER_ID(order.id)
						return (
							<li
								key={order.id}
								className="border-border bg-accent/20 rounded-xl border p-4"
							>
								<div className="flex flex-wrap items-start justify-between gap-2">
									<div>
										<Link
											href={orderDetailHref}
											className="text-foreground cursor-pointer font-semibold hover:underline"
										>
											Order #{order.id}
										</Link>
										<p className="text-muted-foreground mt-0.5 text-xs">
											Table{' '}
											{order.table != null ? `#${order.table.number}` : '—'} ·{' '}
											{itemCount} line{itemCount === 1 ? '' : 's'}
										</p>
									</div>
									<span
										className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${cfg.bgClass} ${cfg.colorClass}`}
									>
										<Icon className="h-3.5 w-3.5" />
										{cfg.label}
									</span>
								</div>
								<div className="text-muted-foreground mt-3 grid gap-1 text-xs sm:grid-cols-2">
									<p>
										<span className="font-medium text-foreground/80">
											Created:{' '}
										</span>
										{formatUserDateLong(order.createdAt)}
									</p>
									<p>
										<span className="font-medium text-foreground/80">
											Updated:{' '}
										</span>
										{formatUserDateLong(order.updatedAt)}
									</p>
									<p className="sm:col-span-2">
										<span className="font-medium text-foreground/80">
											Total:{' '}
										</span>
										${order.total.toFixed(2)}
									</p>
								</div>
							</li>
						)
					})}
				</ul>
			)}

			{hasNextPage && !isLoading && orders.length > 0 ? (
				<button
					type="button"
					onClick={() => void fetchNextPage()}
					disabled={isFetchingNextPage}
					className="text-primary hover:text-primary/80 w-full rounded-xl border border-border bg-transparent py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
				>
					{isFetchingNextPage ? (
						<span className="inline-flex items-center justify-center gap-2">
							<Loader2 className="h-4 w-4 animate-spin" />
							Loading…
						</span>
					) : (
						'Load more'
					)}
				</button>
			) : null}
		</div>
	)
}

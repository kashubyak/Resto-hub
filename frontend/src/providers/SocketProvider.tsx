'use client'

import { ROUTES, UserRole } from '@/constants/pages.constant'
import { SOCKET_EVENTS } from '@/constants/socket-events.constant'
import { createNotificationsSocket } from '@/lib/socket/createNotificationsSocket'
import { getSocketServerUrl } from '@/lib/socket/getSocketServerUrl'
import { useAlert } from '@/providers/AlertContext'
import { useAuthStore } from '@/store/auth.store'
import type {
	INewOrderNotificationPayload,
	IOrderCompletedNotificationPayload,
	IOrderUpdatedNotificationPayload,
} from '@/types/socket-notification.interface'
import { invalidateOrderQueries } from '@/utils/invalidateOrderQueries'
import {
	isOrderStatus,
	patchOrderStatusInCache,
} from '@/utils/patchOrderStatusInCache'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { memo, useEffect, useRef, type ReactNode } from 'react'
import type { Socket } from 'socket.io-client'

const ORDER_ALERT_DURATION_MS = 12_000

const SOCKET_ROLES: UserRole[] = [
	UserRole.COOK,
	UserRole.WAITER,
	UserRole.ADMIN,
]

function isNewOrderPayload(
	data: unknown,
): data is INewOrderNotificationPayload {
	if (typeof data !== 'object' || data === null) return false
	const o = data as Record<string, unknown>
	return typeof o.id === 'number'
}

function isOrderCompletedPayload(
	data: unknown,
): data is IOrderCompletedNotificationPayload {
	if (typeof data !== 'object' || data === null) return false
	const o = data as Record<string, unknown>
	return typeof o.orderId === 'number'
}

function isOrderUpdatedPayload(
	data: unknown,
): data is IOrderUpdatedNotificationPayload {
	if (typeof data !== 'object' || data === null) return false
	const o = data as Record<string, unknown>
	return typeof o.orderId === 'number' && typeof o.status === 'string'
}

function disconnectSocket(socket: Socket | null): void {
	if (!socket) return
	socket.removeAllListeners()
	socket.disconnect()
}

export const SocketProvider = memo<{ children: ReactNode }>(({ children }) => {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { showAlert } = useAlert()
	const socketRef = useRef<Socket | null>(null)
	const pendingSocketRef = useRef<Socket | null>(null)
	const showAlertRef = useRef(showAlert)
	const routerRef = useRef(router)
	const hydrated = useAuthStore((s) => s.hydrated)
	const isAuth = useAuthStore((s) => s.isAuth)
	const userRole = useAuthStore((s) => s.userRole)

	showAlertRef.current = showAlert
	routerRef.current = router

	useEffect(() => {
		if (!hydrated) return

		const socketUrl = getSocketServerUrl()
		const shouldConnect =
			isAuth &&
			userRole != null &&
			SOCKET_ROLES.includes(userRole) &&
			socketUrl != null

		if (!shouldConnect) {
			disconnectSocket(socketRef.current)
			socketRef.current = null
			disconnectSocket(pendingSocketRef.current)
			pendingSocketRef.current = null
			return
		}

		const role = userRole

		const socket = createNotificationsSocket(socketUrl)
		if (!socket) return

		pendingSocketRef.current = socket
		socketRef.current = socket

		const onOrderUpdated = (data: unknown) => {
			if (!isOrderUpdatedPayload(data)) return
			const orderId = Number(data.orderId)
			if (isOrderStatus(data.status))
				patchOrderStatusInCache(queryClient, orderId, data.status)
			invalidateOrderQueries(queryClient, orderId)
		}

		const onNewOrder = (data: unknown) => {
			if (!isNewOrderPayload(data)) return
			const itemsPart =
				typeof data.itemsCount === 'number'
					? `${data.itemsCount} items`
					: 'new items'
			invalidateOrderQueries(queryClient, data.id)
			if (role !== UserRole.COOK) return
			const path = ROUTES.PRIVATE.COOK.ORDERS_COOK_ID(data.id)
			showAlertRef.current({
				severity: 'info',
				text: `New order #${data.id} (${itemsPart}).`,
				duration: ORDER_ALERT_DURATION_MS,
				actionLabel: 'View order',
				onAction: () => routerRef.current.push(path),
			})
		}

		const onOrderCompleted = (data: unknown) => {
			if (!isOrderCompletedPayload(data)) return
			const tablePart = data.table != null ? ` Table ${data.table}.` : ''
			invalidateOrderQueries(queryClient, data.orderId)
			if (role !== UserRole.WAITER) return
			const path = ROUTES.PRIVATE.WAITER.ORDERS_WAITER_ID(data.orderId)
			showAlertRef.current({
				severity: 'success',
				text: `Order #${data.orderId} is ready.${tablePart}`,
				duration: ORDER_ALERT_DURATION_MS,
				actionLabel: 'View order',
				onAction: () => routerRef.current.push(path),
			})
		}

		socket.on(SOCKET_EVENTS.ORDER_UPDATED, onOrderUpdated)
		if (role === UserRole.COOK) socket.on(SOCKET_EVENTS.NEW_ORDER, onNewOrder)
		if (role === UserRole.WAITER)
			socket.on(SOCKET_EVENTS.ORDER_COMPLETED, onOrderCompleted)

		pendingSocketRef.current = null

		return () => {
			socket.off(SOCKET_EVENTS.ORDER_UPDATED, onOrderUpdated)
			if (role === UserRole.COOK)
				socket.off(SOCKET_EVENTS.NEW_ORDER, onNewOrder)
			if (role === UserRole.WAITER)
				socket.off(SOCKET_EVENTS.ORDER_COMPLETED, onOrderCompleted)
			disconnectSocket(socket)
			if (socketRef.current === socket) socketRef.current = null
			if (pendingSocketRef.current === socket) pendingSocketRef.current = null
		}
	}, [hydrated, isAuth, userRole, queryClient])

	return children
})

SocketProvider.displayName = 'SocketProvider'

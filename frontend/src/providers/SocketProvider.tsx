'use client'

import { API_URL } from '@/config/api'
import { ROUTES, UserRole } from '@/constants/pages.constant'
import { SOCKET_EVENTS } from '@/constants/socket-events.constant'
import {
	createNotificationsSocket,
	getSocketAuthToken,
} from '@/lib/socket/createNotificationsSocket'
import { useAlert } from '@/providers/AlertContext'
import { useAuthStore } from '@/store/auth.store'
import type {
	INewOrderNotificationPayload,
	IOrderCompletedNotificationPayload,
	IOrderUpdatedNotificationPayload,
} from '@/types/socket-notification.interface'
import { invalidateOrderQueries } from '@/utils/invalidateOrderQueries'
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

export const SocketProvider = memo<{ children: ReactNode }>(({ children }) => {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { showAlert } = useAlert()
	const socketRef = useRef<Socket | null>(null)
	const hydrated = useAuthStore((s) => s.hydrated)
	const isAuth = useAuthStore((s) => s.isAuth)
	const userRole = useAuthStore((s) => s.userRole)

	useEffect(() => {
		if (!hydrated) return

		const shouldConnect =
			isAuth &&
			userRole != null &&
			SOCKET_ROLES.includes(userRole) &&
			Boolean(API_URL.BASE_SOCKET)

		if (!shouldConnect) {
			const existing = socketRef.current
			if (existing) {
				existing.removeAllListeners()
				existing.disconnect()
				socketRef.current = null
			}
			return
		}

		let cancelled = false

		void (async () => {
			const token = await getSocketAuthToken()
			if (cancelled || !token) return

			const socket = createNotificationsSocket(token)
			if (cancelled || !socket) return

			const onOrderUpdated = (data: unknown) => {
				if (!isOrderUpdatedPayload(data)) return
				invalidateOrderQueries(queryClient, data.orderId)
			}

			const onNewOrder = (data: unknown) => {
				if (!isNewOrderPayload(data)) return
				const itemsPart =
					typeof data.itemsCount === 'number'
						? `${data.itemsCount} items`
						: 'new items'
				invalidateOrderQueries(queryClient, data.id)
				if (userRole !== UserRole.COOK) return
				const path = ROUTES.PRIVATE.COOK.ORDERS_COOK_ID(data.id)
				showAlert({
					severity: 'info',
					text: `New order #${data.id} (${itemsPart}).`,
					duration: ORDER_ALERT_DURATION_MS,
					actionLabel: 'View order',
					onAction: () => router.push(path),
				})
			}

			const onOrderCompleted = (data: unknown) => {
				if (!isOrderCompletedPayload(data)) return
				const tablePart = data.table != null ? ` Table ${data.table}.` : ''
				invalidateOrderQueries(queryClient, data.orderId)
				if (userRole !== UserRole.WAITER) return
				const path = ROUTES.PRIVATE.WAITER.ORDERS_WAITER_ID(data.orderId)
				showAlert({
					severity: 'success',
					text: `Order #${data.orderId} is ready.${tablePart}`,
					duration: ORDER_ALERT_DURATION_MS,
					actionLabel: 'View order',
					onAction: () => router.push(path),
				})
			}

			socket.on(SOCKET_EVENTS.ORDER_UPDATED, onOrderUpdated)
			if (userRole === UserRole.COOK)
				socket.on(SOCKET_EVENTS.NEW_ORDER, onNewOrder)
			if (userRole === UserRole.WAITER)
				socket.on(SOCKET_EVENTS.ORDER_COMPLETED, onOrderCompleted)

			if (cancelled) {
				socket.off(SOCKET_EVENTS.ORDER_UPDATED, onOrderUpdated)
				if (userRole === UserRole.COOK)
					socket.off(SOCKET_EVENTS.NEW_ORDER, onNewOrder)
				if (userRole === UserRole.WAITER)
					socket.off(SOCKET_EVENTS.ORDER_COMPLETED, onOrderCompleted)
				socket.disconnect()
				return
			}

			socketRef.current = socket
		})()

		return () => {
			cancelled = true
			const s = socketRef.current
			if (s) {
				s.removeAllListeners()
				s.disconnect()
				socketRef.current = null
			}
		}
	}, [hydrated, isAuth, userRole, queryClient, router, showAlert])

	return children
})

SocketProvider.displayName = 'SocketProvider'

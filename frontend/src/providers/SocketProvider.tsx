'use client'

import { API_URL } from '@/config/api'
import { ROUTES, UserRole } from '@/constants/pages.constant'
import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
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
} from '@/types/socket-notification.interface'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { memo, useEffect, useRef, type ReactNode } from 'react'
import type { Socket } from 'socket.io-client'

const ORDER_ALERT_DURATION_MS = 12_000

function isNewOrderPayload(data: unknown): data is INewOrderNotificationPayload {
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
			(userRole === UserRole.COOK || userRole === UserRole.WAITER) &&
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

			const onNewOrder = (data: unknown) => {
				if (!isNewOrderPayload(data)) return
				const itemsPart =
					typeof data.itemsCount === 'number'
						? `${data.itemsCount} items`
						: 'new items'
				queryClient.invalidateQueries({
					queryKey: [ORDER_QUERY_KEY.LIST_COOK_FREE],
				})
				queryClient.invalidateQueries({
					queryKey: [ORDER_QUERY_KEY.LIST_COOK_ACTIVE],
				})
				queryClient.invalidateQueries({
					queryKey: ORDER_QUERY_KEY.DETAIL(data.id),
				})
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
				const tablePart =
					data.table != null ? ` Table ${data.table}.` : ''
				queryClient.invalidateQueries({
					queryKey: [ORDER_QUERY_KEY.LIST_ACTIVE],
				})
				queryClient.invalidateQueries({
					queryKey: ORDER_QUERY_KEY.DETAIL(data.orderId),
				})
				const path = ROUTES.PRIVATE.WAITER.ORDERS_WAITER_ID(data.orderId)
				showAlert({
					severity: 'success',
					text: `Order #${data.orderId} is ready.${tablePart}`,
					duration: ORDER_ALERT_DURATION_MS,
					actionLabel: 'View order',
					onAction: () => router.push(path),
				})
			}

			if (userRole === UserRole.COOK)
				socket.on(SOCKET_EVENTS.NEW_ORDER, onNewOrder)
			else if (userRole === UserRole.WAITER)
				socket.on(SOCKET_EVENTS.ORDER_COMPLETED, onOrderCompleted)

			if (cancelled) {
				if (userRole === UserRole.COOK)
					socket.off(SOCKET_EVENTS.NEW_ORDER, onNewOrder)
				else if (userRole === UserRole.WAITER)
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

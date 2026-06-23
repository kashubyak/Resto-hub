'use client'

import { OrderInvalidIdFallback } from '@/app/(dashboard)/components/OrderInvalidIdFallback'
import { OrderWaiterDetailView } from '@/app/(dashboard)/orders-waiter/[id]/OrderWaiterDetailView'
import { ROUTES } from '@/constants/pages.constant'
import { use } from 'react'

export default function OrderWaiterDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id: idParam } = use(params)
	const id = Number(idParam)
	if (!Number.isFinite(id) || id < 1)
		return (
			<OrderInvalidIdFallback
				listHref={ROUTES.PRIVATE.WAITER.ORDERS_WAITER}
				listLabel="Back to orders"
			/>
		)

	return <OrderWaiterDetailView orderId={id} />
}

'use client'

import { OrderInvalidIdFallback } from '@/app/(dashboard)/components/OrderInvalidIdFallback'
import { OrderCookDetailView } from '@/app/(dashboard)/orders-cook/[id]/OrderCookDetailView'
import { ROUTES } from '@/constants/pages.constant'
import { use } from 'react'

export default function OrderCookDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id: idParam } = use(params)
	const id = Number(idParam)
	if (!Number.isFinite(id) || id < 1)
		return (
			<OrderInvalidIdFallback
				listHref={ROUTES.PRIVATE.COOK.ORDERS_COOK}
				listLabel="Back to kitchen"
			/>
		)

	return <OrderCookDetailView orderId={id} />
}

'use client'

import { OrderWaiterDetailView } from '@/app/(dashboard)/orders-waiter/[id]/OrderWaiterDetailView'
import { NotFound } from '@/components/ui/NotFound'
import { ROUTES } from '@/constants/pages.constant'
import Link from 'next/link'
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
			<div className="space-y-4">
				<NotFound
					icon="📋"
					title="Invalid order"
					message="This order link is not valid."
				/>
				<div className="flex justify-center">
					<Link
						href={ROUTES.PRIVATE.WAITER.ORDERS_WAITER}
						className="text-sm text-primary hover:underline"
					>
						Back to orders
					</Link>
				</div>
			</div>
		)

	return <OrderWaiterDetailView orderId={id} />
}

'use client'

import { OrderCookDetailView } from '@/app/(dashboard)/orders-cook/[id]/OrderCookDetailView'
import { NotFound } from '@/components/ui/NotFound'
import { ROUTES } from '@/constants/pages.constant'
import Link from 'next/link'
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
			<div className="space-y-4">
				<NotFound
					icon="📋"
					title="Invalid order"
					message="This order link is not valid."
				/>
				<div className="flex justify-center">
					<Link
						href={ROUTES.PRIVATE.COOK.ORDERS_COOK}
						className="text-sm text-primary hover:underline"
					>
						Back to kitchen
					</Link>
				</div>
			</div>
		)

	return <OrderCookDetailView orderId={id} />
}

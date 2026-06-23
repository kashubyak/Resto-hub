'use client'

import { NotFound } from '@/components/ui/NotFound'
import { UserRole } from '@/constants/pages.constant'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface OrderInvalidIdFallbackProps {
	listHref: string
	listLabel: string
}

export function OrderInvalidIdFallback({
	listHref,
	listLabel,
}: OrderInvalidIdFallbackProps) {
	const router = useRouter()
	const isReadOnlyViewer = useAuthStore((s) => s.userRole) === UserRole.ADMIN

	return (
		<div className="space-y-4">
			<NotFound
				icon="📋"
				title="Invalid order"
				message="This order link is not valid."
			/>
			<div className="flex justify-center">
				{isReadOnlyViewer ? (
					<button
						type="button"
						onClick={() => router.back()}
						className="text-sm text-primary hover:underline"
					>
						Go back
					</button>
				) : (
					<Link
						href={listHref}
						className="text-sm text-primary hover:underline"
					>
						{listLabel}
					</Link>
				)}
			</div>
		</div>
	)
}

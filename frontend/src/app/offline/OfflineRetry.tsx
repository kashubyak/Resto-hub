'use client'

import { Button } from '@/components/ui/Button'

export function OfflineRetry() {
	return (
		<Button
			type="button"
			text="Try again"
			onClick={() => {
				window.location.reload()
			}}
			className="mt-0 max-w-xs mx-auto"
		/>
	)
}

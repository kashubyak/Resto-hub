import { ROUTES } from '@/constants/pages.constant'
import { WifiOff } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { OfflineRetry } from './OfflineRetry'

export const metadata: Metadata = {
	title: 'Offline',
	robots: { index: false, follow: false },
}

export default function OfflinePage() {
	return (
		<div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12 bg-background">
			<div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg text-center space-y-6 animate-in zoom-in-95 fade-in-0 duration-300">
				<div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
					<WifiOff className="w-8 h-8 text-primary" aria-hidden />
				</div>
				<div className="space-y-2">
					<h1 className="text-2xl font-bold text-foreground">
						You are offline
					</h1>
					<p className="text-muted-foreground text-sm leading-relaxed">
						Resto Hub needs a network connection for live orders and data. Check
						your connection, then try again.
					</p>
				</div>
				<div className="flex flex-col gap-3 pt-2">
					<OfflineRetry />
					<Link
						href={ROUTES.PRIVATE.SHARED.DASHBOARD}
						className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
					>
						Back to dashboard
					</Link>
				</div>
			</div>
		</div>
	)
}

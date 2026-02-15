'use client'

import { BackgroundDecorations } from '@/components/auth/BackgroundDecorations'
import { ROUTES } from '@/constants/pages.constant'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { getCompanyUrl } from '@/utils/api'
import { Check, Copy, ExternalLink, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { memo, useCallback } from 'react'

const RegisterCompanySuccessComponent = () => {
	const searchParams = useSearchParams()
	const { copy, copied } = useCopyToClipboard()

	const subdomain = searchParams.get('subdomain') || ''
	const companyUrl = subdomain ? getCompanyUrl(subdomain) : ''

	const handleCopy = useCallback(() => {
		if (companyUrl) copy(companyUrl)
	}, [companyUrl, copy])

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-background px-2 sm:px-4 py-4 sm:py-8 relative overflow-x-hidden">
			<BackgroundDecorations />

			<div className="w-full max-w-lg relative z-10">
				<div className="bg-card rounded-xl sm:rounded-3xl shadow-lg border border-border/50 p-6 sm:p-10 backdrop-blur-sm">
					<div className="flex justify-center mb-6 sm:mb-8">
						<div className="relative w-20 h-20 sm:w-24 sm:h-24">
							<div
								className="absolute inset-0 rounded-full pointer-events-none"
								style={{
									backgroundColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
									animation: 'success-icon-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
								}}
							/>
							<div
								className="absolute inset-0 rounded-full pointer-events-none"
								style={{
									backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
									animation: 'success-icon-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
								}}
							/>
							<div className="relative w-full h-full rounded-full success-icon-circle flex items-center justify-center">
								<Check
									className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-[3]"
									strokeWidth={3}
								/>
							</div>
						</div>
					</div>

					<div className="text-center mb-6 sm:mb-8">
						<h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 sm:mb-3">
							Company Registered Successfully!
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground">
							Your company portal is ready. Share the link below with your team.
						</p>
					</div>

					<div className="space-y-4 mb-6">
						<label className="block text-sm font-medium text-card-foreground">
							Company Link
						</label>
						<div className="flex gap-2">
							<div className="flex-1 relative">
								<input
									type="text"
									value={companyUrl}
									readOnly
									className="w-full px-4 py-3 bg-input rounded-xl border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
								/>
							</div>
							<button
								type="button"
								onClick={handleCopy}
								className="px-4 sm:px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
							>
								{copied ? (
									<>
										<Check className="w-4 h-4" />
										<span className="hidden sm:inline">Copied!</span>
									</>
								) : (
									<>
										<Copy className="w-4 h-4" />
										<span className="hidden sm:inline">Copy</span>
									</>
								)}
							</button>
						</div>
						<p className="text-xs text-muted-foreground">
							This link will take users directly to your company login page
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<Link
							href={ROUTES.PRIVATE.SHARED.DASHBOARD}
							className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
						>
							<LayoutDashboard className="w-4 h-4" />
							Go to Dashboard
						</Link>
						<a
							href={companyUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="w-full px-6 py-3 bg-input text-foreground rounded-xl font-medium hover:bg-input/80 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
						>
							<ExternalLink className="w-4 h-4" />
							Open Company Portal
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export const RegisterCompanySuccess = memo(RegisterCompanySuccessComponent)

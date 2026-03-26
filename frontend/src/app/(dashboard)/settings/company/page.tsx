'use client'

import { SafeRender } from '@/components/container/SafeRender'
import { Button } from '@/components/ui/Button'
import { RoleGuard } from '@/components/ui/RoleGuard'
import { ROUTES, UserRole } from '@/constants/pages.constant'
import { useCompanySettings } from '@/hooks/useCompanySettings'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Building2, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'

export default function CompanySettingsPage() {
	const { user } = useCurrentUser()
	const { company, subdomain, companyUrl, copied, handleCopy } =
		useCompanySettings(!!user)

	return (
		<SafeRender title="Loading Company Settings..." showNetworkProgress>
			<RoleGuard allowedRoles={[UserRole.ADMIN]}>
				<div className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6 space-y-6">
					<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center gap-3">
								<Settings className="w-7 h-7 sm:w-8 sm:h-8 text-primary shrink-0" />
								Company settings
							</h1>
							<p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-xl">
								Portal link and read-only company details. Edit name, address,
								logo, and map on the company page.
							</p>
						</div>
						<Link
							href={ROUTES.PRIVATE.ADMIN.COMPANY}
							className="inline-flex items-center gap-2 self-start rounded-xl px-4 py-3 text-sm font-medium text-primary bg-primary/10 border border-primary/20 hover:bg-primary/15 hover:border-primary/30 transition-colors"
						>
							<Building2 className="w-4 h-4" />
							<span className="hidden sm:inline">
								Edit company profile &amp; map
							</span>
							<span className="sm:hidden">Edit company</span>
							<ExternalLink className="w-3.5 h-3.5 opacity-70" />
						</Link>
					</div>

					<div className="bg-card rounded-xl sm:rounded-2xl border border-border/50 shadow-lg p-4 sm:p-6 backdrop-blur-sm space-y-8">
						<section className="space-y-3">
							<label className="block text-sm font-medium text-foreground">
								Company portal link
							</label>
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
								<input
									type="text"
									value={companyUrl}
									readOnly
									className="flex-1 min-w-0 h-12 px-4 rounded-xl border-2 border-border bg-background/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								/>
								<Button
									onClick={handleCopy}
									type="button"
									className="w-full sm:w-auto shrink-0 h-12 px-6"
								>
									{copied ? 'Copied!' : 'Copy'}
								</Button>
							</div>
							<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
								Share this link with your team so they can open your company
								portal on the right subdomain.
							</p>
						</section>

						{(company ?? subdomain) ? (
							<section className="pt-6 sm:pt-8 border-t border-border space-y-4">
								<h2 className="text-lg font-semibold text-foreground">
									Company information
								</h2>
								<div className="grid gap-4 sm:grid-cols-1 sm:max-w-xl">
									{company?.name ? (
										<div className="rounded-xl border border-border bg-muted px-4 py-3">
											<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
												Company name
											</p>
											<p className="text-sm sm:text-base text-foreground break-words">
												{company.name}
											</p>
										</div>
									) : null}
									{subdomain ? (
										<div className="rounded-xl border border-border bg-muted px-4 py-3">
											<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
												Subdomain
											</p>
											<p className="text-sm sm:text-base text-foreground font-mono">
												{subdomain}
											</p>
										</div>
									) : null}
									{company?.address ? (
										<div className="rounded-xl border border-border bg-muted px-4 py-3 sm:col-span-full">
											<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
												Address
											</p>
											<p className="text-sm sm:text-base text-foreground break-words">
												{company.address}
											</p>
										</div>
									) : null}
								</div>
							</section>
						) : null}
					</div>
				</div>
			</RoleGuard>
		</SafeRender>
	)
}

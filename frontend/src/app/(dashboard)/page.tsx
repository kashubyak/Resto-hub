'use client'

import { SafeRender } from '@/components/container/SafeRender'
import { ROUTES } from '@/constants/pages.constant'
import { useIsNewUser } from '@/hooks/useIsNewUser'
import {
	ArrowRight,
	FolderTree,
	Sparkles,
	UtensilsCrossed,
	Users,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
	const { isNewUser, isLoading } = useIsNewUser()

	return (
		<SafeRender title="Loading Dashboard..." showNetworkProgress>
			<div className="max-w-7xl mx-auto">
				{isLoading ? (
					<div className="flex items-center justify-center min-h-[calc(100vh-12rem)]" />
				) : isNewUser ? (
					<div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
						<div className="w-full max-w-3xl text-center space-y-8 px-4">
							<div className="flex justify-center">
								<div className="relative">
									<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-primary to-transparent flex items-center justify-center shadow-2xl shadow-primary/25 animate-float">
										<Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-sparkle" />
									</div>
									<div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary/20 animate-pulse-smooth" />
									<div
										className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-primary/10 animate-pulse-smooth"
										style={{ animationDelay: '1s' }}
									/>
								</div>
							</div>

							<div className="space-y-3">
								<h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
									Welcome to Your Dashboard! 🎉
								</h1>
								<p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
									You're all set! Start by adding your first
									dishes, organizing categories, or inviting
									team members to collaborate.
								</p>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-6">
								<Link
									href={ROUTES.PRIVATE.ADMIN.DISH}
									className="group bg-card border-2 border-border rounded-2xl p-6 sm:p-7 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 text-left"
								>
									<div className="flex flex-col items-center sm:items-start text-center sm:text-left">
										<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
											<UtensilsCrossed className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
										</div>
										<h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
											Add Dishes
										</h3>
										<p className="text-xs sm:text-sm text-muted-foreground mb-4 flex-1">
											Create and manage your menu items
										</p>
										<div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
											Get started
											<ArrowRight className="w-4 h-4" />
										</div>
									</div>
								</Link>

								<Link
									href={ROUTES.PRIVATE.ADMIN.CATEGORY}
									className="group bg-card border-2 border-border rounded-2xl p-6 sm:p-7 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 text-left"
								>
									<div className="flex flex-col items-center sm:items-start text-center sm:text-left">
										<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
											<FolderTree className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
										</div>
										<h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
											Setup Categories
										</h3>
										<p className="text-xs sm:text-sm text-muted-foreground mb-4 flex-1">
											Organize your menu structure
										</p>
										<div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
											Get started
											<ArrowRight className="w-4 h-4" />
										</div>
									</div>
								</Link>

								<Link
									href={ROUTES.PRIVATE.SHARED.DASHBOARD}
									className="group bg-card border-2 border-border rounded-2xl p-6 sm:p-7 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 text-left sm:col-span-1 col-span-1"
								>
									<div className="flex flex-col items-center sm:items-start text-center sm:text-left">
										<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
											<Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
										</div>
										<h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
											Invite Team
										</h3>
										<p className="text-xs sm:text-sm text-muted-foreground mb-4 flex-1">
											Add team members to collaborate
										</p>
										<div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
											Get started
											<ArrowRight className="w-4 h-4" />
										</div>
									</div>
								</Link>
							</div>

							<div className="pt-6">
								<p className="text-xs sm:text-sm text-muted-foreground">
									Need help? Check out our{' '}
									<a
										href="#"
										className="text-primary hover:underline font-medium"
									>
										documentation
									</a>{' '}
									or{' '}
									<a
										href="#"
										className="text-primary hover:underline font-medium"
									>
										contact support
									</a>
								</p>
							</div>
						</div>
					</div>
				) : (
					<div className="space-y-6">
						<div>
							<h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
								Welcome back! 👋
							</h1>
							<p className="text-sm sm:text-base text-muted-foreground">
								Here's what's happening with your restaurant
								today.
							</p>
						</div>
					</div>
				)}
			</div>
		</SafeRender>
	)
}

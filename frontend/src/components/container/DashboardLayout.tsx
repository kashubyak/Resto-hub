'use client'

import { Sidebar } from '@/components/elements/SideBar'
import { Bell, Menu, Search } from 'lucide-react'
import { memo, useCallback, useState } from 'react'

interface DashboardLayoutProps {
	children: React.ReactNode
}

const DashboardLayoutComponent = function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

	const handleToggleSidebar = useCallback(() => {
		setIsSidebarCollapsed((prev) => !prev)
	}, [])

	const handleCloseMobileSidebar = useCallback(() => {
		setIsMobileSidebarOpen(false)
	}, [])

	return (
		<div className="min-h-screen w-full bg-background relative overflow-hidden">
			{/* Background Decorations — three identical orbs */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				<div
					className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
					style={{ animationDelay: '3s' }}
				/>
				<div
					className="absolute bottom-0 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
					style={{ animationDelay: '4s' }}
				/>
				<div
					className="absolute top-0 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
					style={{ animationDelay: '2s' }}
				/>
			</div>

			{/* Grid pattern overlay */}
			<div
				className="fixed inset-0 pointer-events-none z-0 opacity-[0.02] dark:opacity-[0.05]"
				style={{
					backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                           linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
					backgroundSize: '50px 50px',
				}}
			/>

			<Sidebar
				isCollapsed={isSidebarCollapsed}
				onToggle={handleToggleSidebar}
				isMobileOpen={isMobileSidebarOpen}
				onMobileClose={handleCloseMobileSidebar}
			/>

			<div
				className={`
          transition-all duration-300 ease-in-out relative z-10
          ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}
        `}
			>
				<header className="h-16 bg-card/95 border-b border-border sticky top-0 z-30 backdrop-blur-sm">
					<div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4 max-w-[2560px] mx-auto">
						<div className="flex items-center gap-2 sm:gap-3">
							<button
								type="button"
								onClick={() => setIsMobileSidebarOpen(true)}
								className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-input transition-colors"
							>
								<Menu className="w-5 h-5 text-foreground" />
							</button>
						</div>

						<div className="flex items-center gap-2 ml-auto">
							<div className="hidden sm:flex items-center gap-2 bg-input rounded-xl px-3 lg:px-4 py-2 sm:py-2.5 w-[180px] md:w-[240px] lg:w-[280px] xl:w-[320px] border border-border focus-within:border-primary/50 focus-within:bg-background transition-all">
								<Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
								<input
									type="text"
									placeholder="Search..."
									className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
								/>
							</div>

							<button
								type="button"
								className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-input transition-colors"
							>
								<Bell className="w-5 h-5 text-muted-foreground" />
								<span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
							</button>
						</div>
					</div>
				</header>

				<main className="p-3 sm:p-4 md:p-6 lg:p-8">
					<div className="max-w-[2560px] mx-auto">{children}</div>
				</main>
			</div>
		</div>
	)
}

export const DashboardLayout = memo(DashboardLayoutComponent)

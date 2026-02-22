'use client'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
    DEFAULT_COMPANY_ICON,
    SIDEBAR_SUBTITLE,
} from '@/constants/pages.constant'
import { useCompanySettings } from '@/hooks/useCompanySettings'
import { useUserRoutes } from '@/hooks/useUserRoutes'
import { useAuth } from '@/providers/AuthContext'
import {
    ChevronsLeft,
    ChevronsRight,
    LogOut,
    Moon,
    MoreVertical,
    Search,
    Settings,
    Sun,
    X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useCallback, useState } from 'react'

interface SidebarProps {
	isCollapsed: boolean
	onToggle: () => void
	isMobileOpen: boolean
	onMobileClose: () => void
}

const SidebarComponent = function Sidebar({
	isCollapsed,
	onToggle,
	isMobileOpen,
	onMobileClose,
}: SidebarProps) {
	const [showUserMenu, setShowUserMenu] = useState(false)
	const [hoveredItem, setHoveredItem] = useState<string | null>(null)
	const [mobileSearchQuery, setMobileSearchQuery] = useState('')
	const { routes } = useUserRoutes()
	const pathname = usePathname()
	const { user, logout } = useAuth()
	const { company } = useCompanySettings(!!user)

	const companyName = company?.name ?? ''
	const userName = user?.name ?? ''
	const userEmail = user?.email ?? ''
	const userAvatarUrl = user?.avatarUrl ?? null
	const userAvatarFallback = userName ? userName.charAt(0).toUpperCase() : '?'
	const DefaultCompanyIcon = DEFAULT_COMPANY_ICON

	const isMobile = isMobileOpen
	const effectiveCollapsed = isMobile ? false : isCollapsed

	const handleLogout = useCallback(() => {
		setShowUserMenu(false)
		logout()
	}, [logout])

	return (
		<>
			{isMobileOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={onMobileClose}
					onKeyDown={(e) => e.key === 'Escape' && onMobileClose()}
					role="button"
					tabIndex={0}
					aria-label="Close sidebar"
				/>
			)}

			<aside
				className={`
          fixed left-0 top-0 h-full bg-card border-r border-border z-50
          transition-all duration-300 ease-in-out
          ${effectiveCollapsed ? 'w-[72px]' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
			>
				<div className="flex flex-col h-full">
					<div
						className={`h-20 flex items-center border-b border-border ${effectiveCollapsed ? 'justify-center px-3' : 'px-5 justify-between'}`}
					>
						{effectiveCollapsed ? (
							<div className="relative group">
								<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary/20 transition-opacity group-hover:lg:opacity-0 overflow-hidden">
									{company?.logoUrl ? (
										<Image
											src={company.logoUrl}
											alt=""
											width={40}
											height={40}
											className="object-cover w-full h-full"
										/>
									) : (
										<DefaultCompanyIcon
											className="w-6 h-6 text-white"
											fontSize="inherit"
										/>
									)}
								</div>
								<button
									type="button"
									onClick={onToggle}
									className="hidden lg:flex absolute inset-0 w-10 h-10 items-center justify-center rounded-xl bg-input hover:bg-input/80 opacity-0 group-hover:opacity-100 transition-all"
									title="Expand sidebar"
								>
									<ChevronsRight className="w-5 h-5 text-muted-foreground" />
								</button>
							</div>
						) : (
							<>
								<div className="flex items-center gap-3 flex-1 min-w-0">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 overflow-hidden">
										{company?.logoUrl ? (
											<Image
												src={company.logoUrl}
												alt=""
												width={40}
												height={40}
												className="object-cover w-full h-full"
											/>
										) : (
											<DefaultCompanyIcon
												className="w-6 h-6 text-white"
												fontSize="inherit"
											/>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<h1 className="text-base font-semibold text-foreground truncate">
											{companyName || ' '}
										</h1>
										<p className="text-xs text-muted-foreground">
											{SIDEBAR_SUBTITLE}
										</p>
									</div>
								</div>

								<button
									type="button"
									onClick={onToggle}
									className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-input transition-colors flex-shrink-0"
									title="Collapse sidebar"
								>
									<ChevronsLeft className="w-5 h-5 text-muted-foreground" />
								</button>

								<button
									type="button"
									onClick={onMobileClose}
									className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-input transition-colors flex-shrink-0"
									aria-label="Close menu"
								>
									<X className="w-5 h-5 text-muted-foreground" />
								</button>
							</>
						)}
					</div>

					{isMobile && (
						<div className="px-3 pt-4 pb-2 border-b border-border lg:hidden">
							<div className="flex items-center gap-2 bg-input rounded-xl px-3 py-2.5 border border-border focus-within:border-primary/50 focus-within:bg-background transition-all">
								<Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
								<input
									type="text"
									placeholder="Search..."
									value={mobileSearchQuery}
									onChange={(e) => setMobileSearchQuery(e.target.value)}
									className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
								/>
							</div>
						</div>
					)}

					<nav className="flex-1 overflow-y-auto py-6 px-3">
						<div className="space-y-1">
							{routes.map((route) => {
								const Icon = route.icon
								const isActive = pathname === route.path
								const isHovered = hoveredItem === route.path

								return (
									<div
										key={route.path}
										className="relative"
										onMouseEnter={() => setHoveredItem(route.path)}
										onMouseLeave={() => setHoveredItem(null)}
									>
										<Link
											href={route.path}
											onClick={onMobileClose}
											className={`
                        group flex items-center rounded-xl h-12 relative
                        transition-colors duration-300
                        ${
													isActive
														? 'bg-primary text-primary-foreground shadow-md'
														: 'text-muted-foreground hover:text-foreground hover:bg-input'
												}
                        ${effectiveCollapsed ? 'w-12 mx-auto' : 'w-full'}
                      `}
										>
											<div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center [&_.MuiSvgIcon-root]:w-5 [&_.MuiSvgIcon-root]:h-5">
												<Icon />
											</div>
											<div
												className={`ml-12 flex items-center justify-between flex-1 transition-all duration-300 overflow-hidden ${effectiveCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
											>
												<span className="text-sm font-medium whitespace-nowrap pr-3">
													{route.name}
												</span>
												{isActive && (
													<div className="w-1.5 h-1.5 rounded-full bg-primary-foreground mr-3 flex-shrink-0" />
												)}
											</div>
										</Link>

										{effectiveCollapsed && isHovered && (
											<div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-popover text-popover-foreground text-sm font-medium rounded-lg shadow-xl border border-border whitespace-nowrap pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200">
												{route.name}
												<div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 w-2 h-2 rotate-45 bg-popover border-l border-b border-border" />
											</div>
										)}
									</div>
								)
							})}
						</div>
					</nav>

					<div
						className={`border-t border-border ${effectiveCollapsed ? 'p-2' : 'p-3'}`}
					>
						<div className="relative">
							{effectiveCollapsed ? (
								<div className="relative group">
									<button
										type="button"
										onClick={() => setShowUserMenu(!showUserMenu)}
										className="w-12 h-12 mx-auto rounded-xl hover:bg-input transition-all duration-300 flex items-center justify-center relative"
									>
										<div
											className={`w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-semibold shadow-sm transition-opacity duration-200 overflow-hidden ${showUserMenu ? 'opacity-0' : 'group-hover:opacity-0'}`}
										>
											{userAvatarUrl ? (
												<Image
													src={userAvatarUrl}
													alt=""
													width={36}
													height={36}
													className="object-cover w-full h-full"
												/>
											) : (
												userAvatarFallback
											)}
										</div>
										<div
											className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${showUserMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
										>
											<MoreVertical
												className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-90' : 'rotate-0'}`}
											/>
										</div>
									</button>
								</div>
							) : (
								<button
									type="button"
									onClick={() => setShowUserMenu(!showUserMenu)}
									className="w-full h-12 flex items-center rounded-xl overflow-hidden hover:bg-input transition-all duration-300"
								>
									<div className="flex items-center justify-center flex-shrink-0 w-12 h-12">
										<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-semibold shadow-sm overflow-hidden">
											{userAvatarUrl ? (
												<Image
													src={userAvatarUrl}
													alt=""
													width={36}
													height={36}
													className="object-cover w-full h-full"
												/>
											) : (
												userAvatarFallback
											)}
										</div>
									</div>
									<div
										className={`flex-1 text-left min-w-0 transition-all duration-300 overflow-hidden ${effectiveCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 pr-3'}`}
									>
										<p className="text-sm font-medium text-foreground truncate">
											{userName || 'User'}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{userEmail || ''}
										</p>
									</div>
									<div
										className={`flex-shrink-0 text-muted-foreground transition-all duration-300 ${effectiveCollapsed ? 'w-0 opacity-0' : 'w-4 opacity-100 mr-3'}`}
									>
										<MoreVertical
											className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-90' : 'rotate-0'}`}
										/>
									</div>
								</button>
							)}

							{showUserMenu && !effectiveCollapsed && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setShowUserMenu(false)}
										onKeyDown={(e) =>
											e.key === 'Escape' && setShowUserMenu(false)
										}
										role="button"
										tabIndex={0}
										aria-label="Close menu"
									/>
									<div className="absolute bottom-full left-3 right-3 mb-2 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200">
										<div className="px-4 py-3 border-b border-border">
											<p className="text-sm font-medium text-foreground truncate">
												{userName || 'User'}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{userEmail}
											</p>
										</div>
										<div className="py-1">
											<button
												type="button"
												onClick={() => setShowUserMenu(false)}
												className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left"
											>
												<Settings className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm text-foreground">
													Settings
												</span>
											</button>
											<div className="flex items-center justify-between px-4 py-2.5 hover:bg-accent transition-colors">
												<div className="flex items-center gap-3">
													<Sun className="w-4 h-4 text-muted-foreground dark:hidden" />
													<Moon className="w-4 h-4 text-muted-foreground hidden dark:block" />
													<span className="text-sm text-foreground">Theme</span>
												</div>
												<ThemeToggle variant="inline" />
											</div>
										</div>
										<div className="border-t border-border py-1">
											<button
												type="button"
												onClick={handleLogout}
												className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left text-red-600 dark:text-red-400"
											>
												<LogOut className="w-4 h-4" />
												<span className="text-sm font-medium">Logout</span>
											</button>
										</div>
									</div>
								</>
							)}

							{showUserMenu && effectiveCollapsed && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setShowUserMenu(false)}
										onKeyDown={(e) =>
											e.key === 'Escape' && setShowUserMenu(false)
										}
										role="button"
										tabIndex={0}
										aria-label="Close menu"
									/>
									<div className="absolute bottom-2 left-full ml-3 w-64 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-200">
										<div className="px-4 py-3 border-b border-border">
											<p className="text-sm font-medium text-foreground truncate">
												{userName || 'User'}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{userEmail}
											</p>
										</div>
										<div className="py-1">
											<button
												type="button"
												onClick={() => setShowUserMenu(false)}
												className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left"
											>
												<Settings className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm text-foreground">
													Settings
												</span>
											</button>
											<div className="flex items-center justify-between px-4 py-2.5 hover:bg-accent transition-colors">
												<div className="flex items-center gap-3">
													<Sun className="w-4 h-4 text-muted-foreground dark:hidden" />
													<Moon className="w-4 h-4 text-muted-foreground hidden dark:block" />
													<span className="text-sm text-foreground">Theme</span>
												</div>
												<ThemeToggle variant="inline" />
											</div>
										</div>
										<div className="border-t border-border py-1">
											<button
												type="button"
												onClick={handleLogout}
												className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left text-red-600 dark:text-red-400"
											>
												<LogOut className="w-4 h-4" />
												<span className="text-sm font-medium">Logout</span>
											</button>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</aside>
		</>
	)
}

export const Sidebar = memo(SidebarComponent)

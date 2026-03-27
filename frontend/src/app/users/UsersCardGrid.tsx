'use client'

import { ROUTES } from '@/constants/pages.constant'
import type { IUser } from '@/types/user.interface'
import { Crown, Eye, MoreVertical, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
	formatUserDateShort,
	getUserInitials,
	normalizeUserId,
	userRoleBadgeClass,
} from './userDisplay'

interface UsersCardGridProps {
	users: IUser[]
	currentUserId: number | null
	onDeleteClick: (user: IUser) => void
}

export const UsersCardGrid = ({
	users,
	currentUserId,
	onDeleteClick,
}: UsersCardGridProps) => {
	const [menu, setMenu] = useState<{
		userId: number
		top: number
		left: number
	} | null>(null)

	useLayoutEffect(() => {
		if (!menu) return
		const onScrollOrResize = () => setMenu(null)
		window.addEventListener('scroll', onScrollOrResize, true)
		window.addEventListener('resize', onScrollOrResize)
		return () => {
			window.removeEventListener('scroll', onScrollOrResize, true)
			window.removeEventListener('resize', onScrollOrResize)
		}
	}, [menu])

	useEffect(() => {
		setMenu(null)
	}, [users])

	const openMenu = (userId: number, el: HTMLButtonElement) => {
		const r = el.getBoundingClientRect()
		const w = 192
		const gap = 4
		const pad = 8
		const menuHeight = 120
		let top = r.bottom + gap
		if (top + menuHeight > window.innerHeight - pad)
			top = Math.max(pad, r.top - menuHeight - gap)
		let left = r.right - w
		left = Math.max(pad, Math.min(left, window.innerWidth - w - pad))
		setMenu({ userId, top, left })
	}

	const closeMenu = () => setMenu(null)

	const menuUser = menu ? users.find((u) => u.id === menu.userId) : null

	const menuPortal =
		menu && menuUser && typeof document !== 'undefined'
			? createPortal(
					<>
						<button
							type="button"
							className="fixed inset-0 z-[1000] cursor-default bg-transparent border-0 p-0"
							aria-label="Close menu"
							onClick={closeMenu}
						/>
						<div
							className="fixed z-[1010] w-48 bg-popover border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
							style={{
								top: menu.top,
								left: menu.left,
								maxHeight: 'min(240px, calc(100vh - 16px))',
							}}
							role="menu"
						>
							<Link
								href={ROUTES.PRIVATE.ADMIN.USERS_ID(menuUser.id)}
								className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-sm"
								onClick={closeMenu}
							>
								<Eye className="w-4 h-4 text-muted-foreground" />
								View Details
							</Link>
							<button
								type="button"
								onClick={() => {
									onDeleteClick(menuUser)
									closeMenu()
								}}
								className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-sm text-red-600 dark:text-red-400"
							>
								<Trash2 className="w-4 h-4" />
								Delete User
							</button>
						</div>
					</>,
					document.body,
				)
			: null

	if (users.length === 0) {
		return (
			<div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="col-span-full bg-card rounded-2xl border border-border p-12 text-center">
					<div className="text-muted-foreground">
						<p className="text-lg font-medium">No users found</p>
						<p className="text-sm mt-1">Try adjusting your search or filters</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
			{menuPortal}
			<div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible">
				{users.map((user) => {
					const uid = normalizeUserId(user.id)
					const isMe = currentUserId != null && uid === currentUserId
					return (
						<div
							key={user.id}
							className={`bg-card rounded-2xl border border-border p-4 hover:border-primary/50 transition-all overflow-visible ${
								isMe ? 'border-primary/30 bg-primary/5' : ''
							}`}
						>
							<div className="flex items-start justify-between mb-4 gap-2">
								<div className="flex items-center gap-3 flex-1 min-w-0">
									{user.avatarUrl ? (
										<img
											src={user.avatarUrl}
											alt=""
											className="w-12 h-12 rounded-xl object-cover shrink-0 border-2 border-border"
										/>
									) : (
										<div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-semibold shrink-0">
											{getUserInitials(user.name)}
										</div>
									)}
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2 mb-0.5">
											<h3 className="font-semibold text-foreground truncate">{user.name}</h3>
											{isMe ? (
												<span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-semibold shrink-0">
													<Crown className="w-3 h-3" />
													You
												</span>
											) : null}
										</div>
										<p className="text-xs text-muted-foreground truncate">{user.email}</p>
									</div>
								</div>
								<div className="relative shrink-0">
									<button
										type="button"
										onClick={(e) =>
											menu?.userId === user.id
												? closeMenu()
												: openMenu(user.id, e.currentTarget)
										}
										className="p-2 hover:bg-input rounded-lg transition-colors"
										aria-expanded={menu?.userId === user.id}
										aria-haspopup="menu"
									>
										<MoreVertical className="w-4 h-4 text-muted-foreground" />
									</button>
								</div>
							</div>

							<div className="space-y-2 mb-4">
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">Role:</span>
									<span
										className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold border ${userRoleBadgeClass(user.role)}`}
									>
										{user.role}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">Created:</span>
									<span className="text-xs text-foreground">
										{formatUserDateShort(user.createdAt)}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">Updated:</span>
									<span className="text-xs text-foreground">
										{formatUserDateShort(user.updatedAt)}
									</span>
								</div>
							</div>

							<Link
								href={ROUTES.PRIVATE.ADMIN.USERS_ID(user.id)}
								className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-input hover:bg-input/80 rounded-xl transition-colors text-sm font-medium"
							>
								<Eye className="w-4 h-4" />
								View Details
							</Link>
						</div>
					)
				})}
			</div>
		</>
	)
}

'use client'

import { ROUTES } from '@/constants/pages.constant'
import type { IUser } from '@/types/user.interface'
import { Crown, Eye, MoreVertical, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
	formatUserDateShort,
	getUserInitials,
	normalizeUserId,
	userRoleBadgeClass,
} from './userDisplay'

interface UsersTableProps {
	users: IUser[]
	currentUserId: number | null
	onDeleteClick: (user: IUser) => void
}

export const UsersTable = ({
	users,
	currentUserId,
	onDeleteClick,
}: UsersTableProps) => {
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
			<div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-border bg-accent/50">
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									User
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									Role
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									Email
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									Created
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									Updated
								</th>
								<th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={6} className="px-6 py-12 text-center">
									<div className="text-muted-foreground">
										<p className="text-lg font-medium">No users found</p>
										<p className="text-sm mt-1">
											Try adjusting your search or filters
										</p>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	return (
		<>
			{menuPortal}
			<div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-border bg-accent/50">
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									User
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									Role
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									Email
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									Created
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
									Updated
								</th>
								<th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user, index) => {
								const uid = normalizeUserId(user.id)
								const isMe = currentUserId != null && uid === currentUserId
								return (
									<tr
										key={user.id}
										className={`border-b border-border hover:bg-accent/50 transition-colors ${
											index === users.length - 1 ? 'border-b-0' : ''
										} ${isMe ? 'bg-primary/5' : ''}`}
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												{user.avatarUrl ? (
													<Image
														src={user.avatarUrl}
														alt=""
														width={40}
														height={40}
														unoptimized={
															user.avatarUrl.startsWith('blob:') ||
															user.avatarUrl.startsWith('data:')
														}
														className="w-10 h-10 rounded-xl object-cover shrink-0 border-2 border-border"
													/>
												) : (
													<div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm shrink-0">
														{getUserInitials(user.name)}
													</div>
												)}
												<div className="min-w-0 flex items-center gap-2">
													<p className="font-medium text-foreground truncate">
														{user.name}
													</p>
													{isMe ? (
														<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-semibold shrink-0">
															<Crown className="w-3 h-3" />
															You
														</span>
													) : null}
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${userRoleBadgeClass(user.role)}`}
											>
												{user.role}
											</span>
										</td>
										<td className="px-6 py-4">
											<p className="text-sm text-muted-foreground">
												{user.email}
											</p>
										</td>
										<td className="px-6 py-4">
											<p className="text-sm text-muted-foreground">
												{formatUserDateShort(user.createdAt)}
											</p>
										</td>
										<td className="px-6 py-4">
											<p className="text-sm text-muted-foreground">
												{formatUserDateShort(user.updatedAt)}
											</p>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-end gap-2">
												<Link
													href={ROUTES.PRIVATE.ADMIN.USERS_ID(user.id)}
													className="p-2 hover:bg-input rounded-lg transition-colors"
													title="View Details"
													onClick={closeMenu}
												>
													<Eye className="w-4 h-4 text-muted-foreground" />
												</Link>
												<button
													type="button"
													onClick={() => {
														closeMenu()
														onDeleteClick(user)
													}}
													className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
													title="Delete"
												>
													<Trash2 className="w-4 h-4 text-red-500" />
												</button>
												<div className="shrink-0">
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
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

import type { IUser } from '@/types/user.interface'
import { UserRole } from '@/constants/pages.constant'

export function getUserInitials(name: string): string {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
}

export function formatUserDateShort(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}

export function formatUserDateLong(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export function userRoleBadgeClass(role: UserRole): string {
	switch (role) {
		case UserRole.ADMIN:
			return 'bg-primary/10 text-primary border-primary/20'
		case UserRole.WAITER:
			return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
		case UserRole.COOK:
			return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
		default:
			return 'bg-muted text-muted-foreground border-border'
	}
}

export function normalizeUserId(id: unknown): number | null {
	if (id == null || id === '') return null
	const n = Number(id)
	return Number.isFinite(n) ? n : null
}

export function mergeCurrentUserIntoList(
	list: IUser[],
	authUser: IUser | null,
): IUser[] {
	const id = normalizeUserId(authUser?.id)
	if (id == null || !authUser) return list
	if (list.some((u) => normalizeUserId(u.id) === id)) return list
	const fallback = new Date(0).toISOString()
	const row: IUser = {
		id,
		name: authUser.name,
		email: authUser.email,
		role: authUser.role,
		avatarUrl: authUser.avatarUrl,
		createdAt: authUser.createdAt?.length ? authUser.createdAt : fallback,
		updatedAt: authUser.updatedAt?.length ? authUser.updatedAt : fallback,
	}
	return [row, ...list]
}

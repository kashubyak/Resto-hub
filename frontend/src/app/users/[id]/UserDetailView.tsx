'use client'

import { NotFound } from '@/components/ui/NotFound'
import { ROUTES, UserRole } from '@/constants/pages.constant'
import { USERS_QUERY_KEY } from '@/constants/query-keys.constant'
import { useUsers } from '@/hooks/useUsers'
import { useAlert } from '@/providers/AlertContext'
import { useAuth } from '@/providers/AuthContext'
import { deleteUser } from '@/services/user/delete-user.service'
import { updateUser } from '@/services/user/update-user.service'
import { useAuthStore } from '@/store/auth.store'
import type { IUser } from '@/types/user.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useQueryClient } from '@tanstack/react-query'
import {
	ArrowLeft,
	Calendar,
	Crown,
	Edit,
	Loader2,
	Mail,
	Save,
	Shield,
	Trash2,
	Upload,
	X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DeleteConfirmModal } from '../components/DeleteConfirmModal'
import { UserOrderActivity } from './components/UserOrderActivity'
import {
	formatUserDateLong,
	getUserInitials,
	normalizeUserId,
} from '../userDisplay'

const roleColors: Record<UserRole, string> = {
	[UserRole.ADMIN]: 'bg-primary/10 text-primary border-primary/20',
	[UserRole.WAITER]:
		'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
	[UserRole.COOK]:
		'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
}

type EditableRole = UserRole.WAITER | UserRole.COOK | UserRole.ADMIN

interface UserDetailViewProps {
	idParam: string
}

export const UserDetailView = ({ idParam }: UserDetailViewProps) => {
	const numericId = Number(idParam)
	const idValid = Number.isInteger(numericId) && numericId > 0
	const router = useRouter()
	const queryClient = useQueryClient()
	const { showError, showSuccess } = useAlert()
	const { user: authUser } = useAuth()
	const setAuthUser = useAuthStore((state) => state.setUser)
	const { userQuery } = useUsers(
		idValid ? numericId : undefined,
		undefined,
		undefined,
		true,
	)

	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		role: UserRole.WAITER as EditableRole,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const avatarInputRef = useRef<HTMLInputElement>(null)

	const u = userQuery.data

	const clearAvatarDraft = useCallback(() => {
		setAvatarFile(null)
		setAvatarPreview((prev) => {
			if (prev) URL.revokeObjectURL(prev)
			return null
		})
		if (avatarInputRef.current) avatarInputRef.current.value = ''
	}, [])

	useEffect(() => {
		if (!u) return
		setFormData({
			name: u.name,
			email: u.email,
			role: u.role,
		})
		setErrors({})
	}, [u])

	useEffect(() => {
		if (!u) return
		clearAvatarDraft()
	}, [u?.id, clearAvatarDraft])

	const validateForm = () => {
		const newErrors: Record<string, string> = {}
		if (!formData.name.trim()) newErrors.name = 'Name is required'
		if (!formData.email.trim()) newErrors.email = 'Email is required'
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
			newErrors.email = 'Invalid email format'
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSave = async () => {
		if (!validateForm() || !u) return
		setIsSaving(true)
		try {
			const body = new FormData()
			body.append('name', formData.name.trim())
			body.append('email', formData.email.trim())
			if (
				u.role !== UserRole.ADMIN &&
				(formData.role === UserRole.COOK ||
					formData.role === UserRole.WAITER) &&
				formData.role !== u.role
			)
				body.append('role', formData.role)
			if (avatarFile) body.append('avatarUrl', avatarFile)
			const { data: updated } = await updateUser(u.id, body)
			void queryClient.setQueryData<IUser>(
				[USERS_QUERY_KEY.DETAIL, u.id],
				updated,
			)
			void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY.ALL] })
			clearAvatarDraft()
			setIsEditing(false)
			showSuccess('Profile updated successfully')
			const authId = normalizeUserId(authUser?.id)
			const rowId = normalizeUserId(u.id)
			if (authId != null && rowId != null && authId === rowId) {
				const cur = useAuthStore.getState().user
				if (cur) setAuthUser({ ...cur, ...updated })
			}
		} catch (err) {
			showError(parseBackendError(err as IAxiosError).join('\n'))
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancelEdit = () => {
		if (u) {
			setFormData({
				name: u.name,
				email: u.email,
				role: u.role,
			})
		}
		setErrors({})
		clearAvatarDraft()
		setIsEditing(false)
	}

	const confirmDelete = async () => {
		if (!u) return
		try {
			await deleteUser(u.id)
			void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY.ALL] })
			setDeleteModalOpen(false)
			showSuccess('User deleted successfully')
			router.push(ROUTES.PRIVATE.ADMIN.USERS)
		} catch (err) {
			showError(parseBackendError(err as IAxiosError).join('\n'))
		}
	}

	const handleDeleteClick = useCallback(() => setDeleteModalOpen(true), [])

	const onAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setAvatarFile(file)
		setAvatarPreview((prev) => {
			if (prev) URL.revokeObjectURL(prev)
			return URL.createObjectURL(file)
		})
	}

	if (!idValid) {
		return (
			<NotFound
				icon="👤"
				title="User Not Found"
				message="This user link is invalid."
			/>
		)
	}

	if (userQuery.isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="w-8 h-8 text-primary animate-spin" />
			</div>
		)
	}

	if (userQuery.isError || !u) {
		return (
			<div className="flex flex-col items-center justify-center h-96 gap-4">
				<p className="text-lg text-muted-foreground">User not found</p>
				<Link
					href={ROUTES.PRIVATE.ADMIN.USERS}
					className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Users
				</Link>
			</div>
		)
	}

	const authId = normalizeUserId(authUser?.id)
	const rowId = normalizeUserId(u.id)
	const isSelf = authId != null && rowId != null && authId === rowId
	const displayAvatarSrc = isEditing
		? (avatarPreview ?? u.avatarUrl)
		: u.avatarUrl

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			<div className="flex items-center gap-4">
				<Link
					href={ROUTES.PRIVATE.ADMIN.USERS}
					className="p-2 hover:bg-input rounded-lg transition-colors"
					title="Back to users"
				>
					<ArrowLeft className="w-5 h-5 text-muted-foreground" />
				</Link>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-3 flex-wrap">
						<h1 className="text-2xl sm:text-3xl font-bold text-foreground">
							User Details
						</h1>
						{isSelf ? (
							<span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-semibold">
								<Crown className="w-4 h-4" />
								You
							</span>
						) : null}
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						View and manage user information
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-card rounded-2xl border border-border p-6">
						<div className="flex items-start justify-between mb-6">
							<div className="flex items-center gap-4">
								<div className="relative shrink-0">
									{displayAvatarSrc ? (
										<img
											src={displayAvatarSrc}
											alt=""
											className="w-20 h-20 rounded-2xl object-cover border-2 border-border"
										/>
									) : (
										<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold text-2xl">
											{getUserInitials(isEditing ? formData.name : u.name)}
										</div>
									)}
									{isEditing ? (
										<>
											<input
												ref={avatarInputRef}
												type="file"
												accept="image/*"
												className="sr-only"
												onChange={onAvatarFileChange}
												id="user-avatar-upload"
											/>
											<label
												htmlFor="user-avatar-upload"
												className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-md transition-colors hover:bg-accent hover:text-foreground"
												title="Change photo"
											>
												<Upload className="h-4 w-4" />
											</label>
										</>
									) : null}
								</div>
								<div>
									{isEditing ? (
										<input
											type="text"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											className={`text-2xl font-bold bg-input border rounded-lg px-3 py-1 text-foreground focus:outline-none focus:border-primary/50 ${
												errors.name ? 'border-red-500' : 'border-border'
											}`}
											placeholder="Enter name"
										/>
									) : (
										<h2 className="text-2xl font-bold text-foreground">
											{u.name}
										</h2>
									)}
									{errors.name ? (
										<p className="mt-1 text-xs text-red-500">{errors.name}</p>
									) : null}
									<div className="mt-2">
										{isEditing ? (
											u.role === UserRole.ADMIN ? (
												<span
													className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${roleColors[u.role]}`}
												>
													{u.role}
												</span>
											) : (
												<select
													value={formData.role}
													onChange={(e) =>
														setFormData({
															...formData,
															role: e.target.value as EditableRole,
														})
													}
													className="px-3 py-1 bg-input border border-border rounded-lg text-sm font-semibold focus:outline-none focus:border-primary/50"
												>
													<option value={UserRole.WAITER}>WAITER</option>
													<option value={UserRole.COOK}>COOK</option>
													<option value={UserRole.ADMIN}>ADMIN</option>
												</select>
											)
										) : (
											<span
												className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${roleColors[u.role]}`}
											>
												{u.role}
											</span>
										)}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-2">
								{!isEditing ? (
									<>
										<button
											type="button"
											onClick={() => setIsEditing(true)}
											className="p-2 hover:bg-input rounded-lg transition-colors"
											title="Edit user"
										>
											<Edit className="w-5 h-5 text-muted-foreground" />
										</button>
										{!isSelf ? (
											<button
												type="button"
												onClick={handleDeleteClick}
												className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
												title="Delete user"
											>
												<Trash2 className="w-5 h-5 text-red-500" />
											</button>
										) : null}
									</>
								) : (
									<>
										<button
											type="button"
											onClick={handleCancelEdit}
											disabled={isSaving}
											className="p-2 hover:bg-input rounded-lg transition-colors disabled:opacity-50"
											title="Cancel"
										>
											<X className="w-5 h-5 text-muted-foreground" />
										</button>
										<button
											type="button"
											onClick={() => void handleSave()}
											disabled={isSaving}
											className="p-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
											title="Save changes"
										>
											{isSaving ? (
												<Loader2 className="w-5 h-5 text-primary animate-spin" />
											) : (
												<Save className="w-5 h-5 text-primary" />
											)}
										</button>
									</>
								)}
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-center gap-3 p-4 bg-accent/50 rounded-xl">
								<div className="p-2 bg-background rounded-lg">
									<Mail className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-muted-foreground mb-1">
										Email Address
									</p>
									{isEditing ? (
										<>
											<input
												type="email"
												value={formData.email}
												onChange={(e) =>
													setFormData({ ...formData, email: e.target.value })
												}
												className={`w-full bg-input border rounded-lg px-3 py-1 text-foreground text-sm focus:outline-none focus:border-primary/50 ${
													errors.email ? 'border-red-500' : 'border-border'
												}`}
												placeholder="Enter email"
											/>
											{errors.email ? (
												<p className="mt-1 text-xs text-red-500">
													{errors.email}
												</p>
											) : null}
										</>
									) : (
										<p className="text-foreground font-medium truncate">
											{u.email}
										</p>
									)}
								</div>
							</div>

							<div className="flex items-center gap-3 p-4 bg-accent/50 rounded-xl">
								<div className="p-2 bg-background rounded-lg">
									<Shield className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1">
									<p className="text-xs text-muted-foreground mb-1">Role</p>
									<p className="text-foreground font-medium">
										{isEditing ? formData.role : u.role}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-card rounded-2xl border border-border p-6">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Activity
						</h3>
						<UserOrderActivity user={u} />
					</div>
				</div>

				<div className="space-y-6">
					<div className="bg-card rounded-2xl border border-border p-6">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Information
						</h3>
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<div className="p-2 bg-accent rounded-lg mt-1">
									<Calendar className="w-4 h-4 text-primary" />
								</div>
								<div className="flex-1">
									<p className="text-xs text-muted-foreground mb-1">Created</p>
									<p className="text-sm text-foreground">
										{formatUserDateLong(u.createdAt)}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="p-2 bg-accent rounded-lg mt-1">
									<Calendar className="w-4 h-4 text-primary" />
								</div>
								<div className="flex-1">
									<p className="text-xs text-muted-foreground mb-1">
										Last Updated
									</p>
									<p className="text-sm text-foreground">
										{formatUserDateLong(u.updatedAt)}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-card rounded-2xl border border-border p-6">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Actions
						</h3>
						<div className="space-y-3">
							{!isEditing ? (
								<button
									type="button"
									onClick={() => setIsEditing(true)}
									className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 font-medium"
								>
									<Edit className="w-4 h-4" />
									Edit User
								</button>
							) : null}
							{!isSelf ? (
								<button
									type="button"
									onClick={handleDeleteClick}
									className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500/20 transition-colors font-medium border border-red-500/20"
								>
									<Trash2 className="w-4 h-4" />
									Delete User
								</button>
							) : (
								<p className="text-sm text-muted-foreground text-center py-2">
									You cannot delete your own account from this screen.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			<DeleteConfirmModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={() => void confirmDelete()}
				title="Delete User"
				message="Are you sure you want to delete this user?"
				userName={u.name}
			/>
		</div>
	)
}

'use client'

import { UserRole } from '@/constants/pages.constant'
import { useAlert } from '@/providers/AlertContext'
import { registerUser } from '@/services/user/register-user.service'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { Eye, EyeOff, Loader2, Upload, User as UserIcon, X } from 'lucide-react'
import { useCallback, useState } from 'react'

interface CreateUserModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
}

export const CreateUserModal = ({
	isOpen,
	onClose,
	onSuccess,
}: CreateUserModalProps) => {
	const { showError, showSuccess } = useAlert()
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: UserRole.WAITER as UserRole,
	})
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [showPassword, setShowPassword] = useState(false)

	const reset = useCallback(() => {
		setFormData({
			name: '',
			email: '',
			password: '',
			role: UserRole.WAITER,
		})
		setAvatarPreview(null)
		setAvatarFile(null)
		setErrors({})
		setShowPassword(false)
	}, [])

	const handleClose = useCallback(() => {
		if (!isLoading) {
			reset()
			onClose()
		}
	}, [isLoading, onClose, reset])

	if (!isOpen) return null

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		if (!file.type.startsWith('image/')) {
			setErrors((prev) => ({ ...prev, avatar: 'Please select an image file' }))
			return
		}
		if (file.size > 5 * 1024 * 1024) {
			setErrors((prev) => ({
				...prev,
				avatar: 'Image size should be less than 5MB',
			}))
			return
		}
		setAvatarFile(file)
		const reader = new FileReader()
		reader.onloadend = () => {
			setAvatarPreview(reader.result as string)
			setErrors((prev) => ({ ...prev, avatar: '' }))
		}
		reader.readAsDataURL(file)
	}

	const removeAvatar = () => {
		setAvatarPreview(null)
		setAvatarFile(null)
		const fileInput = document.getElementById(
			'avatar-upload',
		) as HTMLInputElement | null
		if (fileInput) fileInput.value = ''
	}

	const validateForm = () => {
		const newErrors: Record<string, string> = {}
		if (!formData.name.trim()) newErrors.name = 'Name is required'
		if (!formData.email.trim()) newErrors.email = 'Email is required'
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
			newErrors.email = 'Invalid email format'
		if (!formData.password) newErrors.password = 'Password is required'
		else if (formData.password.length < 6)
			newErrors.password = 'Password must be at least 6 characters'
		if (!avatarFile) newErrors.avatar = 'Profile picture is required'
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm() || !avatarFile) return
		setIsLoading(true)
		try {
			const body = new FormData()
			body.append('name', formData.name.trim())
			body.append('email', formData.email.trim())
			body.append('password', formData.password)
			body.append('role', formData.role)
			body.append('avatarUrl', avatarFile)
			await registerUser(body)
			showSuccess('User created successfully')
			reset()
			onSuccess()
			onClose()
		} catch (err) {
			showError(parseBackendError(err as IAxiosError).join('\n'))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<button
				type="button"
				className="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0 duration-200 cursor-default border-0 p-0"
				aria-label="Close dialog"
				onClick={handleClose}
			/>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
				<div
					className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full pointer-events-auto animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200"
					onClick={(e) => e.stopPropagation()}
					role="dialog"
					aria-modal="true"
					aria-labelledby="create-user-title"
				>
					<div className="flex items-center justify-between px-6 py-4 border-b border-border">
						<h2
							id="create-user-title"
							className="text-xl font-bold text-foreground"
						>
							Create New User
						</h2>
						<button
							type="button"
							onClick={handleClose}
							disabled={isLoading}
							className="p-2 hover:bg-input rounded-lg transition-colors disabled:opacity-50"
						>
							<X className="w-5 h-5 text-muted-foreground" />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Full Name
							</label>
							<input
								type="text"
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className={`w-full px-4 py-2.5 bg-input border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-all ${
									errors.name ? 'border-red-500' : 'border-border'
								}`}
								placeholder="Enter full name"
								disabled={isLoading}
							/>
							{errors.name ? (
								<p className="mt-1 text-xs text-red-500">{errors.name}</p>
							) : null}
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className={`w-full px-4 py-2.5 bg-input border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-all ${
									errors.email ? 'border-red-500' : 'border-border'
								}`}
								placeholder="Enter email address"
								disabled={isLoading}
							/>
							{errors.email ? (
								<p className="mt-1 text-xs text-red-500">{errors.email}</p>
							) : null}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? 'text' : 'password'}
									id="password"
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									className={`w-full px-4 py-2.5 pr-12 bg-input border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-all ${
										errors.password ? 'border-red-500' : 'border-border'
									}`}
									placeholder="Enter password"
									disabled={isLoading}
									autoComplete="new-password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									aria-label={showPassword ? 'Hide password' : 'Show password'}
									className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
							{errors.password ? (
								<p className="mt-1 text-xs text-red-500">{errors.password}</p>
							) : null}
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Profile Picture (Optional)
							</label>
							<div className="flex items-center gap-4">
								<div className="w-20 h-20 rounded-xl bg-input border-2 border-border flex items-center justify-center overflow-hidden shrink-0">
									{avatarPreview ? (
										<img
											src={avatarPreview}
											alt=""
											className="w-full h-full object-cover"
										/>
									) : (
										<UserIcon className="w-8 h-8 text-muted-foreground" />
									)}
								</div>
								<div className="flex-1 space-y-2">
									<label
										htmlFor="avatar-upload"
										className="inline-flex items-center gap-2 px-4 py-2 bg-input hover:bg-input/80 rounded-lg transition-colors cursor-pointer text-sm font-medium border border-border"
									>
										<Upload className="w-4 h-4" />
										{avatarPreview ? 'Change Photo' : 'Upload Photo'}
									</label>
									<input
										type="file"
										id="avatar-upload"
										accept="image/*"
										onChange={handleFileChange}
										className="hidden"
										disabled={isLoading}
									/>
									{avatarPreview ? (
										<button
											type="button"
											onClick={removeAvatar}
											disabled={isLoading}
											className="block px-4 py-2 text-sm text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
										>
											Remove Photo
										</button>
									) : null}
									<p className="text-xs text-muted-foreground">
										JPG, PNG or GIF (max. 5MB)
									</p>
								</div>
							</div>
							{errors.avatar ? (
								<p className="mt-2 text-xs text-red-500">{errors.avatar}</p>
							) : null}
						</div>

						<div>
							<label
								htmlFor="role"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Role
							</label>
							<select
								id="role"
								value={formData.role}
								onChange={(e) =>
									setFormData({ ...formData, role: e.target.value as UserRole })
								}
								className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-all"
								disabled={isLoading}
							>
								<option value={UserRole.WAITER}>Waiter</option>
								<option value={UserRole.COOK}>Cook</option>
								<option value={UserRole.ADMIN}>Admin</option>
							</select>
						</div>

						<div className="flex items-center gap-3 pt-4">
							<button
								type="button"
								onClick={handleClose}
								disabled={isLoading}
								className="flex-1 px-4 py-2.5 bg-input hover:bg-input/80 rounded-xl transition-colors font-medium text-foreground disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isLoading}
								className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
							>
								{isLoading ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Creating...
									</>
								) : (
									'Create User'
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

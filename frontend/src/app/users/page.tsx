'use client'

import { UserRole } from '@/constants/pages.constant'
import { USERS_QUERY_KEY } from '@/constants/query-keys.constant'
import type { UsersSortOption } from '@/hooks/useUsers'
import { useUsers } from '@/hooks/useUsers'
import { useAlert } from '@/providers/AlertContext'
import { useAuth } from '@/providers/AuthContext'
import { deleteUser } from '@/services/user/delete-user.service'
import type { IUser } from '@/types/user.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CreateUserModal } from './components/CreateUserModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { UsersCardGrid } from './UsersCardGrid'
import type { UsersRoleFilter } from './UsersFiltersBar'
import { UsersFiltersBar } from './UsersFiltersBar'
import { UsersListSkeleton } from './UsersListSkeleton'
import { UsersTable } from './UsersTable'
import { mergeCurrentUserIntoList, normalizeUserId } from './userDisplay'

export default function UsersPage() {
	const { user: authUser } = useAuth()
	const { showError, showSuccess } = useAlert()
	const queryClient = useQueryClient()
	const [localSearch, setLocalSearch] = useState('')
	const [searchQuery, setSearchQuery] = useState('')
	const [sortOption, setSortOption] = useState<UsersSortOption>('default')
	const [selectedRole, setSelectedRole] = useState<UsersRoleFilter>('')
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [userToDelete, setUserToDelete] = useState<IUser | null>(null)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const apiRole =
		selectedRole === UserRole.COOK || selectedRole === UserRole.WAITER
			? selectedRole
			: undefined

	const listFilters = {
		sortOption,
		...(apiRole ? { role: apiRole } : {}),
	}

	const {
		allUsers,
		isLoading,
		isError,
		error,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useUsers(undefined, searchQuery, listFilters)

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => setSearchQuery(localSearch), 500)
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [localSearch])

	const mergedList = useMemo(
		() => mergeCurrentUserIntoList(allUsers, authUser),
		[allUsers, authUser],
	)

	const displayUsers = useMemo(() => {
		let list = mergedList
		const q = searchQuery.trim().toLowerCase()
		if (q)
			list = list.filter(
				(u) =>
					u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
			)
		if (selectedRole === UserRole.ADMIN)
			return list.filter((u) => u.role === UserRole.ADMIN)
		if (selectedRole === UserRole.COOK || selectedRole === UserRole.WAITER)
			return list.filter((u) => u.role === selectedRole)
		return list
	}, [mergedList, selectedRole, searchQuery])

	const currentUserId = normalizeUserId(authUser?.id)

	const handleRetry = useCallback(() => {
		void refetch()
	}, [refetch])

	const openDeleteModal = (user: IUser) => {
		setUserToDelete(user)
		setDeleteModalOpen(true)
	}

	const closeDeleteModal = () => {
		setUserToDelete(null)
		setDeleteModalOpen(false)
	}

	const confirmDelete = async () => {
		if (!userToDelete) return
		try {
			await deleteUser(userToDelete.id)
			showSuccess('User deleted successfully')
			void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY.ALL] })
			closeDeleteModal()
		} catch (err) {
			showError(parseBackendError(err as IAxiosError).join('\n'))
		}
	}

	const handleCreateSuccess = () => {
		void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY.ALL] })
	}

	return (
		<div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-foreground">Users Management</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Manage your restaurant staff and their roles
					</p>
				</div>
				<button
					type="button"
					onClick={() => setIsCreateModalOpen(true)}
					className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 font-medium"
				>
					<Plus className="w-5 h-5" />
					<span>Add User</span>
				</button>
			</div>

			<UsersFiltersBar
				localSearch={localSearch}
				onSearchChange={setLocalSearch}
				sortOption={sortOption}
				onSortOptionChange={setSortOption}
				selectedRole={selectedRole}
				onRoleChange={setSelectedRole}
			/>

			{isLoading ? <UsersListSkeleton /> : null}

			{isError ? (
				<div className="bg-card rounded-2xl border border-destructive/30 p-8 text-center space-y-4">
					<p className="text-foreground font-medium">Could not load users</p>
					<p className="text-sm text-muted-foreground">
						{error instanceof Error ? error.message : 'Something went wrong'}
					</p>
					<button
						type="button"
						onClick={handleRetry}
						className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover transition-colors font-medium"
					>
						Try again
					</button>
				</div>
			) : null}

			{!isLoading && !isError ? (
				<>
					<UsersTable
						users={displayUsers}
						currentUserId={currentUserId}
						onDeleteClick={openDeleteModal}
					/>
					<UsersCardGrid
						users={displayUsers}
						currentUserId={currentUserId}
						onDeleteClick={openDeleteModal}
					/>
					{displayUsers.length > 0 ? (
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 text-sm text-muted-foreground">
							<span>
								Showing {displayUsers.length} of {mergedList.length} users
							</span>
							{hasNextPage ? (
								<button
									type="button"
									onClick={() => void fetchNextPage()}
									disabled={isFetchingNextPage}
									className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent transition-colors font-medium text-foreground disabled:opacity-50"
								>
									{isFetchingNextPage ? 'Loading…' : 'Load more'}
								</button>
							) : null}
						</div>
					) : null}
				</>
			) : null}

			<CreateUserModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSuccess={handleCreateSuccess}
			/>

			<DeleteConfirmModal
				isOpen={deleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={() => void confirmDelete()}
				title="Delete User"
				message="Are you sure you want to delete this user?"
				userName={userToDelete?.name}
			/>
		</div>
	)
}

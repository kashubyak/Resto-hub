'use client'

import { SafeRender } from '@/components/container/SafeRender'
import { RoleGuard } from '@/components/ui/RoleGuard'
import { UserRole } from '@/constants/pages.constant'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { memo, useCallback } from 'react'

function DashboardComponent() {
	const { user, userRole, hasRole } = useCurrentUser()

	const handleAdminActions = useCallback(() => {
		console.log('Admin Actions')
	}, [])

	return (
		<SafeRender title='Loading Dashboard...' showNetworkProgress>
			{user && userRole && (
				<p>
					Hi, {user.name}! Your role: {userRole}
				</p>
			)}

			<RoleGuard allowedRoles={[UserRole.ADMIN]}>
				<div>
					<h2>Admin Panel</h2>
					<button>Manage Users</button>
				</div>
			</RoleGuard>

			<RoleGuard allowedRoles={[UserRole.ADMIN]}>
				<div>
					<h2>Admin Reports</h2>
					<button>View Reports</button>
				</div>
			</RoleGuard>

			{hasRole(UserRole.ADMIN) && (
				<button onClick={handleAdminActions}>Admin Functions</button>
			)}
		</SafeRender>
	)
}

export const Dashboard = memo(DashboardComponent)

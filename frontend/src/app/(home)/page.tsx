'use client'

import { RoleGuard } from '@/components/ui/RoleGuard'
import { UserRole } from '@/constants/pages.constant'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useAuth } from '@/providers/AuthContext'

export default function Dashboard() {
	const { user, userRole, hasRole } = useCurrentUser()
	const { logout } = useAuth()

	return (
		<div>
			<h1>Dashboard</h1>
			{user && userRole && (
				<p>
					Hi, {user.name}! Your role: {userRole}
				</p>
			)}
			<RoleGuard allowedRoles={UserRole.ADMIN}>
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
				<button onClick={() => console.log('Admin Actions')}>Admin Functions</button>
			)}
			<button onClick={logout}>Logout</button>
		</div>
	)
}

// 'use client'

// import { useAuth } from '@/providers/AuthContext'

// export default function DashboardPage() {
// 	const { logout } = useAuth()

// 	return (
// 		<div>
// 			<h1>Dashboard</h1>
// 			<button onClick={logout}>Logout</button>
// 		</div>
// 	)
// }

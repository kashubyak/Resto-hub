'use client'

import { AnalyticsView } from '@/components/analytics/AnalyticsView'
import { RoleGuard } from '@/components/ui/RoleGuard'
import { UserRole } from '@/constants/pages.constant'

export default function AnalyticsPage() {
	return (
		<RoleGuard allowedRoles={[UserRole.ADMIN]}>
			<AnalyticsView />
		</RoleGuard>
	)
}

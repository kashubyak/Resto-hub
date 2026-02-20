import { Skeleton } from '@mui/material'
import { memo } from 'react'

interface SidebarNavSkeletonProps {
	collapsed: boolean
	itemsCount?: number
}

const NavItemSkeleton = memo(({ collapsed }: { collapsed: boolean }) => (
	<div className="flex items-center rounded-lg px-3 py-2">
		<Skeleton
			variant="rounded"
			width={24}
			height={24}
			sx={{ bgcolor: 'var(--active-item)', borderRadius: '4px' }}
		/>
		<Skeleton
			variant="text"
			width={120}
			height={20}
			sx={{
				bgcolor: 'var(--active-item)',
				ml: 1.5,
				transition: 'all 0.3s',
				opacity: collapsed ? 0 : 1,
				width: collapsed ? 0 : 120,
			}}
		/>
	</div>
))
NavItemSkeleton.displayName = 'NavItemSkeleton'

export const SidebarNavSkeleton = memo(
	({ collapsed, itemsCount = 6 }: SidebarNavSkeletonProps) => {
		return (
			<nav className="flex-1 p-2 space-y-1">
				{[...Array(itemsCount)].map((_, i) => (
					<NavItemSkeleton key={i} collapsed={collapsed} />
				))}
			</nav>
		)
	},
)

SidebarNavSkeleton.displayName = 'SidebarNavSkeleton'

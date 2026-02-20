import { Skeleton } from '@mui/material'
import { memo } from 'react'
import { SidebarHeaderSkeleton } from './SidebarHeaderSkeleton'
import { SidebarNavSkeleton } from './SidebarNavSkeleton'
import { SideBarUserSkeleton } from './SideBarUserSkeleton'

interface SidebarContentSkeletonProps {
	mode: 'desktop' | 'mobile'
	collapsed: boolean
}

const MobileHeaderSkeleton = memo(() => (
	<div className="flex items-center justify-between border-b border-border p-2">
		<Skeleton
			variant="rounded"
			width={40}
			height={40}
			sx={{ bgcolor: 'var(--active-item)', borderRadius: '6px' }}
		/>
		<Skeleton
			variant="rounded"
			width={40}
			height={40}
			sx={{ bgcolor: 'var(--active-item)', borderRadius: '8px' }}
		/>
	</div>
))
MobileHeaderSkeleton.displayName = 'MobileHeaderSkeleton'

export const SidebarContentSkeleton = memo(
	({ mode, collapsed }: SidebarContentSkeletonProps) => {
		return (
			<div className="flex flex-col h-full justify-between">
				<div>
					{mode === 'desktop' ? (
						<SidebarHeaderSkeleton collapsed={collapsed} />
					) : (
						<MobileHeaderSkeleton />
					)}
					<SidebarNavSkeleton collapsed={collapsed} />
				</div>
				<SideBarUserSkeleton collapsed={collapsed} />
			</div>
		)
	},
)

SidebarContentSkeleton.displayName = 'SidebarContentSkeleton'

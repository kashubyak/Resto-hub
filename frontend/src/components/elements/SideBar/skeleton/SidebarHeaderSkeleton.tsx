import { Skeleton } from '@mui/material'
import { memo } from 'react'

interface SidebarHeaderSkeletonProps {
	collapsed: boolean
}

const ExpandedHeaderSkeleton = memo(() => (
	<>
		<Skeleton
			variant='rounded'
			width={40}
			height={40}
			sx={{ bgcolor: 'var(--muted)', borderRadius: '6px' }}
		/>
		<Skeleton
			variant='rounded'
			width={40}
			height={40}
			sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
		/>
	</>
))
ExpandedHeaderSkeleton.displayName = 'ExpandedHeaderSkeleton'

const CollapsedHeaderSkeleton = memo(() => (
	<Skeleton
		variant='rounded'
		width={48}
		height={40}
		sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
	/>
))
CollapsedHeaderSkeleton.displayName = 'CollapsedHeaderSkeleton'

export const SidebarHeaderSkeleton = memo(({ collapsed }: SidebarHeaderSkeletonProps) => {
	return (
		<div className='flex items-center justify-between border-b border-border p-2'>
			{!collapsed ? <ExpandedHeaderSkeleton /> : <CollapsedHeaderSkeleton />}
		</div>
	)
})

SidebarHeaderSkeleton.displayName = 'SidebarHeaderSkeleton'

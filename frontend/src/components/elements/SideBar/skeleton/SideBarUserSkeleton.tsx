import { Skeleton } from '@mui/material'
import { memo } from 'react'

interface SideBarUserSkeletonProps {
	collapsed: boolean
}

const ExpandedUserSkeleton = memo(() => (
	<>
		<div className='flex items-center gap-2 overflow-hidden flex-1'>
			{/* Avatar */}
			<Skeleton
				variant='rounded'
				width={40}
				height={40}
				sx={{ bgcolor: 'var(--muted)', borderRadius: '6px' }}
			/>

			{/* User info */}
			<div className='flex flex-col gap-1 min-w-0 flex-1'>
				<Skeleton
					variant='text'
					width='80%'
					height={16}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
				<Skeleton
					variant='text'
					width='60%'
					height={14}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
			</div>
		</div>

		{/* Menu button */}
		<Skeleton
			variant='rounded'
			width={40}
			height={40}
			sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
		/>
	</>
))
ExpandedUserSkeleton.displayName = 'ExpandedUserSkeleton'

const CollapsedUserSkeleton = memo(() => (
	<Skeleton
		variant='rounded'
		width={48}
		height={40}
		sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
	/>
))
CollapsedUserSkeleton.displayName = 'CollapsedUserSkeleton'

export const SideBarUserSkeleton = memo(({ collapsed }: SideBarUserSkeletonProps) => {
	return (
		<div className='p-2 border-t border-border flex items-center justify-between'>
			{!collapsed ? <ExpandedUserSkeleton /> : <CollapsedUserSkeleton />}
		</div>
	)
})

SideBarUserSkeleton.displayName = 'SideBarUserSkeleton'

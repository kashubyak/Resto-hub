import { Skeleton } from '@mui/material'
import { memo } from 'react'

const DishListItemSkeletonComponent = () => (
	<div className="bg-background border border-border rounded-md shadow-sm hover:shadow-lg transition-all duration-300 p-4 flex flex-col sm:flex-row gap-4">
		<Skeleton
			variant="rounded"
			width={150}
			height={100}
			sx={{
				bgcolor: 'var(--muted)',
				flexShrink: 0,
			}}
		/>

		<div className="flex-grow flex flex-col justify-between">
			<div>
				<Skeleton
					variant="text"
					width="60%"
					height={28}
					sx={{ bgcolor: 'var(--muted)', mb: 1 }}
				/>
				<Skeleton
					variant="text"
					width="100%"
					height={20}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
				<Skeleton
					variant="text"
					width="90%"
					height={20}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
			</div>

			<div className="flex flex-wrap gap-2 mt-3">
				<Skeleton
					variant="rounded"
					width={70}
					height={24}
					sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
				/>
				<Skeleton
					variant="rounded"
					width={80}
					height={24}
					sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
				/>
				<Skeleton
					variant="rounded"
					width={90}
					height={24}
					sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
				/>
			</div>
		</div>

		<div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
			<Skeleton
				variant="text"
				width={80}
				height={36}
				sx={{ bgcolor: 'var(--muted)' }}
			/>
			<Skeleton
				variant="rounded"
				width={120}
				height={40}
				sx={{ bgcolor: 'var(--muted)' }}
			/>
		</div>
	</div>
)

export const DishListItemSkeleton = memo(DishListItemSkeletonComponent)

import { Skeleton } from '@mui/material'
import { memo } from 'react'

const DishCardSkeletonComponent = () => (
	<div className="bg-card border-2 border-border rounded-2xl overflow-hidden flex flex-col">
		<div className="relative aspect-square bg-background overflow-hidden">
			<Skeleton
				variant="rectangular"
				width="100%"
				height="100%"
				sx={{ bgcolor: 'var(--muted)' }}
			/>
		</div>

		<div className="p-4 space-y-3">
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1 min-w-0 space-y-1">
					<Skeleton
						variant="text"
						width="70%"
						height={22}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
					<Skeleton
						variant="text"
						width="100%"
						height={16}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
				</div>
				<Skeleton
					variant="text"
					width={56}
					height={28}
					sx={{ bgcolor: 'var(--muted)', flexShrink: 0 }}
				/>
			</div>

			<div className="flex items-center gap-4">
				<Skeleton
					variant="rounded"
					width={48}
					height={14}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
				<Skeleton
					variant="rounded"
					width={56}
					height={14}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
			</div>

			<div className="space-y-1.5">
				<Skeleton
					variant="text"
					width={80}
					height={12}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
				<div className="flex flex-wrap gap-1.5">
					{[1, 2, 3].map((i) => (
						<Skeleton
							key={i}
							variant="rounded"
							width={60}
							height={24}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '6px' }}
						/>
					))}
				</div>
			</div>

			<Skeleton
				variant="rounded"
				width="100%"
				height={40}
				sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
			/>
		</div>
	</div>
)

export const DishCardSkeleton = memo(DishCardSkeletonComponent)

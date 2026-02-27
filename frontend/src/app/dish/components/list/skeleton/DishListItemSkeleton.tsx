import { Skeleton } from '@mui/material'
import { memo } from 'react'

const DishListItemSkeletonComponent = () => (
	<div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
		<div className="flex flex-col sm:flex-row">
			<div className="relative w-full sm:w-64 h-48 sm:aspect-square bg-background overflow-hidden flex-shrink-0">
				<Skeleton
					variant="rectangular"
					width="100%"
					height="100%"
					sx={{ bgcolor: 'var(--muted)' }}
				/>
			</div>

			<div className="flex-1 p-5 sm:p-6 flex flex-col">
				<div className="flex items-start justify-between gap-4 mb-3">
					<div className="flex-1 min-w-0 space-y-1">
						<Skeleton
							variant="text"
							width="60%"
							height={26}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="text"
							width="100%"
							height={16}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="text"
							width="80%"
							height={16}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
					</div>
					<div className="flex items-center gap-3 flex-shrink-0">
						<Skeleton
							variant="text"
							width={64}
							height={32}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="rounded"
							width={88}
							height={28}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
						/>
					</div>
				</div>

				<div className="flex items-center gap-6 mb-3">
					<div className="flex items-center gap-1.5">
						<Skeleton
							variant="rounded"
							width={28}
							height={28}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
						/>
						<div className="space-y-1">
							<Skeleton
								variant="text"
								width={40}
								height={12}
								sx={{ bgcolor: 'var(--muted)' }}
							/>
							<Skeleton
								variant="text"
								width={36}
								height={18}
								sx={{ bgcolor: 'var(--muted)' }}
							/>
						</div>
					</div>
					<div className="flex items-center gap-1.5">
						<Skeleton
							variant="rounded"
							width={28}
							height={28}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
						/>
						<div className="space-y-1">
							<Skeleton
								variant="text"
								width={44}
								height={12}
								sx={{ bgcolor: 'var(--muted)' }}
							/>
							<Skeleton
								variant="text"
								width={48}
								height={18}
								sx={{ bgcolor: 'var(--muted)' }}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-2 mb-4">
					<Skeleton
						variant="text"
						width={80}
						height={12}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
					<div className="flex flex-wrap gap-2">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton
								key={i}
								variant="rounded"
								width={56}
								height={28}
								sx={{ bgcolor: 'var(--muted)', borderRadius: '6px' }}
							/>
						))}
					</div>
				</div>

				<div className="mt-auto">
					<Skeleton
						variant="rounded"
						width="100%"
						height={40}
						sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
					/>
				</div>
			</div>
		</div>
	</div>
)

export const DishListItemSkeleton = memo(DishListItemSkeletonComponent)

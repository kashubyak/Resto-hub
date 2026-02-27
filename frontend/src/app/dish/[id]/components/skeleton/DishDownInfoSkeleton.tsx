import { Skeleton } from '@mui/material'

export const DishDownInfoSkeleton = () => {
	return (
		<>
			<div className="grid grid-cols-2 gap-3 pt-2">
				<div className="bg-background rounded-xl p-3 border-2 border-border">
					<div className="flex items-center gap-2 mb-1">
						<Skeleton
							variant="rounded"
							width={16}
							height={16}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="text"
							width={48}
							height={14}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
					</div>
					<Skeleton
						variant="text"
						width={64}
						height={28}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
				</div>
				<div className="bg-background rounded-xl p-3 border-2 border-border">
					<div className="flex items-center gap-2 mb-1">
						<Skeleton
							variant="rounded"
							width={16}
							height={16}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="text"
							width={52}
							height={14}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
					</div>
					<Skeleton
						variant="text"
						width={72}
						height={28}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
				</div>
			</div>
			<div className="space-y-2 pt-2 border-t border-border">
				<Skeleton
					variant="text"
					width={80}
					height={16}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
				<div className="flex flex-wrap gap-1.5">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton
							key={i}
							variant="rounded"
							width={64}
							height={28}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
						/>
					))}
				</div>
			</div>
		</>
	)
}

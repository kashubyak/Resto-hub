import { Skeleton } from '@mui/material'

export const DishTopInfoSkeleton = () => {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="flex items-start justify-between gap-3">
					<Skeleton
						variant="text"
						width="70%"
						height={32}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
					<Skeleton
						variant="rounded"
						width={100}
						height={28}
						sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
					/>
				</div>
				<Skeleton
					variant="text"
					width={80}
					height={36}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
			</div>
			<div className="space-y-2 pt-2 border-t border-border">
				<Skeleton
					variant="text"
					width="100%"
					height={16}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
				<Skeleton
					variant="text"
					width="95%"
					height={16}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
				<Skeleton
					variant="text"
					width="60%"
					height={16}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
			</div>
		</div>
	)
}

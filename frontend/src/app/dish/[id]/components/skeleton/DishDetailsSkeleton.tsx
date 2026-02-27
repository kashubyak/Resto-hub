import { Skeleton } from '@mui/material'

export const DishDetailsSkeleton = () => {
	return (
		<>
			<Skeleton
				variant="text"
				width={90}
				height={18}
				sx={{ bgcolor: 'var(--muted)' }}
			/>
			<div className="space-y-2.5">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="flex items-center justify-between text-sm"
					>
						<Skeleton
							variant="text"
							width={90}
							height={18}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="text"
							width={100}
							height={18}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
					</div>
				))}
			</div>
		</>
	)
}

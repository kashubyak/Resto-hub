import { Skeleton } from '@mui/material'

export const DishActionsSkeleton = () => {
	return (
		<>
			<Skeleton
				variant="text"
				width={60}
				height={18}
				sx={{ bgcolor: 'var(--muted)' }}
			/>
			<div className="space-y-2.5">
				{[1, 2, 3, 4].map((i) => (
					<Skeleton
						key={i}
						variant="rounded"
						width="100%"
						height={44}
						sx={{ bgcolor: 'var(--muted)', borderRadius: '12px' }}
					/>
				))}
			</div>
		</>
	)
}

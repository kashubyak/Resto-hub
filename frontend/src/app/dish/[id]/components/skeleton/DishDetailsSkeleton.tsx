import { Skeleton } from '@mui/material'

export const DishDetailsSkeleton = () => {
	return (
		<div className="space-y-3 pt-4">
			<Skeleton
				variant="text"
				width={120}
				height={28}
				sx={{ bgcolor: 'var(--muted)' }}
			/>

			<div className="space-y-2">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="flex justify-between items-center">
						<Skeleton
							variant="text"
							width={100}
							height={20}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="text"
							width={120}
							height={20}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

import { Skeleton } from '@mui/material'

export const DishActionsSkeleton = () => {
	return (
		<div className="px-4 lg:px-6 lg:pr-0 py-6 bg-muted/30">
			<div className="space-y-4">
				<Skeleton
					variant="text"
					width={80}
					height={24}
					sx={{ bgcolor: 'var(--muted)', mb: 2 }}
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton
							key={i}
							variant="rounded"
							width="100%"
							height={40}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '6px' }}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

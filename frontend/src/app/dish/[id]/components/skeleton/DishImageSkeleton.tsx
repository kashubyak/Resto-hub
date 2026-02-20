import { Skeleton } from '@mui/material'

export const DishImageSkeleton = () => {
	return (
		<div className="lg:col-span-2 relative flex items-center justify-center lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start">
			<div className="relative w-full max-w-7xl">
				<div className="relative w-full aspect-[4/3] lg:h-[70vh]">
					<Skeleton
						variant="rectangular"
						width="100%"
						height="100%"
						sx={{
							bgcolor: 'var(--muted)',
							borderRadius: '8px',
						}}
					/>
				</div>
			</div>
		</div>
	)
}

import { Skeleton } from '@mui/material'

export const DishImageSkeleton = () => {
	return (
		<div className="lg:col-span-7 xl:col-span-8">
			<div className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
				<div className="relative w-full h-full min-h-[280px] aspect-square lg:aspect-auto bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl overflow-hidden">
					<Skeleton
						variant="rectangular"
						width="100%"
						height="100%"
						sx={{
							bgcolor: 'var(--muted)',
							borderRadius: '0',
						}}
					/>
				</div>
			</div>
		</div>
	)
}

import { DishActionsSkeleton } from './DishActionsSkeleton'
import { DishDetailsSkeleton } from './DishDetailsSkeleton'
import { DishDownInfoSkeleton } from './DishDownInfoSkeleton'
import { DishImageSkeleton } from './DishImageSkeleton'
import { DishTopInfoSkeleton } from './DishTopInfoSkeleton'

export const DishPageSkeleton = () => {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
				{/* Compact header */}
				<div className="flex items-center gap-3 mb-4">
					<Skeleton
						variant="rounded"
						width={40}
						height={40}
						sx={{ bgcolor: 'var(--muted)', borderRadius: '12px' }}
					/>
					<Skeleton
						variant="text"
						width={120}
						height={28}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
					<DishImageSkeleton />
					<div className="lg:col-span-5 xl:col-span-4 space-y-4 pb-4 lg:pb-8">
						<div className="bg-card border-2 border-border rounded-2xl p-5 space-y-4">
							<DishTopInfoSkeleton />
							<DishDownInfoSkeleton />
						</div>
						<div className="bg-card border-2 border-border rounded-2xl p-5 space-y-3">
							<DishDetailsSkeleton />
						</div>
						<div className="bg-card border-2 border-border rounded-2xl p-5 space-y-3">
							<DishActionsSkeleton />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

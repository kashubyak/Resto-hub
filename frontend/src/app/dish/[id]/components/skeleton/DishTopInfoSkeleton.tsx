import { Skeleton } from '@mui/material'

export const DishTopInfoSkeleton = () => {
	return (
		<div className="space-y-3">
			<Skeleton
				variant="text"
				width="80%"
				height={48}
				sx={{ bgcolor: 'var(--muted)' }}
			/>
			<Skeleton
				variant="text"
				width="50%"
				height={48}
				sx={{ bgcolor: 'var(--muted)', display: { xs: 'none', lg: 'block' } }}
			/>

			<Skeleton
				variant="text"
				width={120}
				height={48}
				sx={{ bgcolor: 'var(--muted)' }}
			/>

			<div className="flex items-center gap-3 flex-wrap">
				<Skeleton
					variant="rounded"
					width={90}
					height={26}
					sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
				/>
				<Skeleton
					variant="rounded"
					width={80}
					height={26}
					sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
				/>
			</div>

			<div className="space-y-2 pt-1">
				<Skeleton
					variant="text"
					width="100%"
					height={24}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
				<Skeleton
					variant="text"
					width="95%"
					height={24}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
				<Skeleton
					variant="text"
					width="85%"
					height={24}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
			</div>
		</div>
	)
}

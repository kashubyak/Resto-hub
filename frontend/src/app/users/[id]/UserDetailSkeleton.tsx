import { Skeleton } from '@mui/material'

export const UserDetailSkeleton = () => {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="flex items-center gap-4">
				<Skeleton
					variant="rounded"
					width={40}
					height={40}
					sx={{ bgcolor: 'var(--muted)', borderRadius: '12px' }}
				/>
				<div className="space-y-2">
					<Skeleton variant="rounded" width={200} height={32} sx={{ bgcolor: 'var(--muted)' }} />
					<Skeleton variant="rounded" width={260} height={18} sx={{ bgcolor: 'var(--muted)' }} />
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-card rounded-2xl border border-border p-6 space-y-4">
						<div className="flex gap-4">
							<Skeleton variant="rounded" width={80} height={80} sx={{ bgcolor: 'var(--muted)' }} />
							<div className="flex-1 space-y-2">
								<Skeleton variant="rounded" height={32} sx={{ bgcolor: 'var(--muted)' }} />
								<Skeleton variant="rounded" width={100} height={28} sx={{ bgcolor: 'var(--muted)' }} />
							</div>
						</div>
						<Skeleton variant="rounded" height={80} sx={{ bgcolor: 'var(--muted)' }} />
						<Skeleton variant="rounded" height={80} sx={{ bgcolor: 'var(--muted)' }} />
					</div>
					<div className="bg-card rounded-2xl border border-border p-6">
						<Skeleton variant="rounded" width={120} height={24} sx={{ bgcolor: 'var(--muted)' }} />
						<Skeleton
							variant="rounded"
							height={120}
							sx={{ bgcolor: 'var(--muted)', mt: 2 }}
						/>
					</div>
				</div>
				<div className="space-y-6">
					<div className="bg-card rounded-2xl border border-border p-6 space-y-4">
						<Skeleton variant="rounded" width={100} height={24} sx={{ bgcolor: 'var(--muted)' }} />
						<Skeleton variant="rounded" height={64} sx={{ bgcolor: 'var(--muted)' }} />
						<Skeleton variant="rounded" height={64} sx={{ bgcolor: 'var(--muted)' }} />
					</div>
				</div>
			</div>
		</div>
	)
}

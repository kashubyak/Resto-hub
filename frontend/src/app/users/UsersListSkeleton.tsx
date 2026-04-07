import { Skeleton } from '@mui/material'

export const UsersListSkeleton = () => {
	return (
		<div className="space-y-4 sm:space-y-6 animate-pulse">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="space-y-2">
					<Skeleton
						variant="rounded"
						width={280}
						height={36}
						sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
					/>
					<Skeleton
						variant="rounded"
						width={320}
						height={20}
						sx={{ bgcolor: 'var(--muted)', borderRadius: '8px' }}
					/>
				</div>
			</div>
			<div className="bg-card rounded-2xl border border-border p-4 space-y-3">
				<Skeleton
					variant="rounded"
					height={44}
					sx={{ bgcolor: 'var(--muted)', borderRadius: '12px' }}
				/>
				<Skeleton
					variant="rounded"
					height={40}
					width={120}
					sx={{ bgcolor: 'var(--muted)', borderRadius: '12px' }}
				/>
			</div>
			<div className="hidden lg:block bg-card rounded-2xl border border-border overflow-hidden">
				<div className="p-4 space-y-3 border-b border-border bg-accent/30">
					<Skeleton
						variant="rounded"
						height={20}
						width="100%"
						sx={{ bgcolor: 'var(--muted)' }}
					/>
				</div>
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						key={i}
						className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-b-0"
					>
						<Skeleton
							variant="rounded"
							width={40}
							height={40}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="rounded"
							width="25%"
							height={20}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="rounded"
							width="15%"
							height={24}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
						<Skeleton
							variant="rounded"
							width="30%"
							height={20}
							sx={{ bgcolor: 'var(--muted)' }}
						/>
					</div>
				))}
			</div>
			<div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="bg-card rounded-2xl border border-border p-4 space-y-3"
					>
						<div className="flex gap-3">
							<Skeleton
								variant="rounded"
								width={48}
								height={48}
								sx={{ bgcolor: 'var(--muted)' }}
							/>
							<div className="flex-1 space-y-2">
								<Skeleton
									variant="rounded"
									height={20}
									sx={{ bgcolor: 'var(--muted)' }}
								/>
								<Skeleton
									variant="rounded"
									height={16}
									width="80%"
									sx={{ bgcolor: 'var(--muted)' }}
								/>
							</div>
						</div>
						<Skeleton
							variant="rounded"
							height={40}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '12px' }}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

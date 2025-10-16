import { Skeleton } from '@mui/material'
import { memo } from 'react'

const DishCardSkeletonComponent = () => (
	<div className='bg-background border border-border rounded-md shadow-sm flex flex-col overflow-hidden h-full'>
		<Skeleton
			variant='rectangular'
			width='100%'
			height={250}
			sx={{ bgcolor: 'var(--muted)' }}
		/>

		<div className='p-5 flex flex-col flex-grow'>
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4'>
				<div className='flex-grow space-y-2'>
					<Skeleton
						variant='text'
						width='70%'
						height={28}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
					<Skeleton
						variant='text'
						width='100%'
						height={20}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
					<Skeleton
						variant='text'
						width='85%'
						height={20}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
				</div>

				<div className='flex flex-col items-start sm:items-end gap-2 flex-shrink-0'>
					<Skeleton
						variant='text'
						width={80}
						height={36}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
					<div className='flex flex-wrap gap-2'>
						<Skeleton
							variant='rounded'
							width={80}
							height={24}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
						/>
						<Skeleton
							variant='rounded'
							width={70}
							height={24}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
						/>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-3 mb-4'>
				<div className='flex flex-col space-y-1'>
					<Skeleton
						variant='text'
						width={60}
						height={16}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
					<Skeleton
						variant='text'
						width={50}
						height={20}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
				</div>
				<div className='flex flex-col space-y-1'>
					<Skeleton
						variant='text'
						width={60}
						height={16}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
					<Skeleton
						variant='text'
						width={70}
						height={20}
						sx={{ bgcolor: 'var(--muted)' }}
					/>
				</div>
			</div>

			<div className='mb-4'>
				<Skeleton
					variant='text'
					width={100}
					height={16}
					sx={{ bgcolor: 'var(--muted)', mb: 1 }}
				/>
				<div className='flex flex-wrap gap-1'>
					{[1, 2, 3].map(i => (
						<Skeleton
							key={i}
							variant='rounded'
							width={80}
							height={28}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
						/>
					))}
				</div>
			</div>

			<div className='mt-auto'>
				<Skeleton
					variant='rounded'
					width='100%'
					height={40}
					sx={{ bgcolor: 'var(--muted)' }}
				/>
			</div>
		</div>
	</div>
)

export const DishCardSkeleton = memo(DishCardSkeletonComponent)

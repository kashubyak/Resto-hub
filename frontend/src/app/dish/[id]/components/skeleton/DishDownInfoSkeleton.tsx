import { Skeleton } from '@mui/material'

export const DishDownInfoSkeleton = () => {
	return (
		<>
			<div className='grid grid-cols-2 gap-4'>
				<div className='text-center'>
					<Skeleton
						variant='text'
						width={80}
						height={40}
						sx={{ bgcolor: 'var(--muted)', margin: '0 auto', mb: 1 }}
					/>
					<Skeleton
						variant='text'
						width={60}
						height={16}
						sx={{ bgcolor: 'var(--muted)', margin: '0 auto' }}
					/>
				</div>
				<div className='text-center'>
					<Skeleton
						variant='text'
						width={80}
						height={40}
						sx={{ bgcolor: 'var(--muted)', margin: '0 auto', mb: 1 }}
					/>
					<Skeleton
						variant='text'
						width={60}
						height={16}
						sx={{ bgcolor: 'var(--muted)', margin: '0 auto' }}
					/>
				</div>
			</div>

			<div className='space-y-3'>
				<Skeleton
					variant='text'
					width={150}
					height={28}
					sx={{ bgcolor: 'var(--muted)' }}
				/>

				<div className='flex flex-wrap gap-2'>
					{[1, 2, 3, 4, 5].map(i => (
						<Skeleton
							key={i}
							variant='rounded'
							width={90}
							height={32}
							sx={{ bgcolor: 'var(--muted)', borderRadius: '9999px' }}
						/>
					))}
				</div>
			</div>
		</>
	)
}

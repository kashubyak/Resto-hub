import { memo } from 'react'

interface ILoadingProps {
	title?: string
}

export const Loading = memo<ILoadingProps>(({ title }) => {
	return (
		<div className='flex flex-1 items-center justify-center py-12'>
			<div className='text-center space-y-6'>
				<div className='w-20 h-20 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto'></div>
				{title && <p className='text-lg text-muted-foreground'>{title}</p>}
			</div>
		</div>
	)
})

Loading.displayName = 'Loading'

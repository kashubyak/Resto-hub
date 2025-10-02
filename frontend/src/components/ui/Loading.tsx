import { memo } from 'react'

interface ILoadingProps {
	title?: string
}

export const Loading = memo<ILoadingProps>(({ title }) => {
	return (
		<div className='min-h-screen flex items-center justify-center bg-background'>
			<div className='text-center space-y-6'>
				<div className='w-20 h-20 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto'></div>
				{title && <p className='text-xl text-secondary-foreground'>{title}</p>}
			</div>
		</div>
	)
})

Loading.displayName = 'Loading'

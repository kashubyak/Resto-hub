import { useSidebarStore } from '@/store/sidebar.store'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { ViewableImage } from '../ImageViewer/ViewableImage'

export const SidebarHeader = () => {
	const { collapsed, setCollapsed } = useSidebarStore()
	return (
		<div className='flex items-center justify-between border-b border-border p-2'>
			{!collapsed ? (
				<>
					<div className='w-10 h-10 flex items-center justify-center'>
						<ViewableImage
							src='/Resto-Hub.png'
							alt='Logo'
							width={40}
							height={40}
							className='object-contain rounded-md'
						/>
					</div>
					<button
						onClick={() => setCollapsed(true)}
						className='w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground'
						aria-label='Collapse sidebar'
					>
						<ChevronLeftIcon fontSize='medium' />
					</button>
				</>
			) : (
				<button
					onClick={() => setCollapsed(false)}
					className='group w-12 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground relative overflow-hidden'
					aria-label='Expand sidebar'
				>
					<span className='relative w-10 h-10 flex items-center justify-center'>
						<span className='absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0'>
							<ViewableImage
								src='/Resto-Hub.png'
								alt='Logo'
								width={40}
								height={40}
								className='object-contain rounded-md'
							/>
						</span>
						<span className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
							<ChevronRightIcon fontSize='medium' />
						</span>
					</span>
				</button>
			)}
		</div>
	)
}

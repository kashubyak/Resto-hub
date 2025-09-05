import { cn } from '@/utils/cn'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Image from 'next/image'

interface SidebarHeaderProps {
	collapsed: boolean
	setCollapsed: (collapsed: boolean) => void
}

export const SidebarHeader = ({ collapsed, setCollapsed }: SidebarHeaderProps) => {
	return (
		<div
			className={cn(
				'flex items-center justify-between border-b border-border',
				collapsed ? 'p-2' : 'p-4',
			)}
		>
			{!collapsed ? (
				<>
					<div className='w-10 h-10 flex items-center justify-center'>
						<Image src='/Resto Hub Logo Sora.png' alt='Logo' width={40} height={40} />
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
					className='group w-full h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground relative overflow-hidden'
					aria-label='Expand sidebar'
				>
					<span className='relative w-full h-full flex items-center justify-center'>
						<span className='absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0'>
							<Image
								src='/Resto Hub Logo Sora.png'
								alt='Logo'
								width={32}
								height={32}
								className='w-8 h-8 object-contain'
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

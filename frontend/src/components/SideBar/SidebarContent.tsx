import { cn } from '@/utils/cn'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { SidebarHeader } from './SidebarHeader'
import { SidebarNav } from './SidebarNav'
import { SideBarUser } from './SideBarUser'

interface ISidebarContentProps {
	mode: 'desktop' | 'mobile'
	collapsed: boolean
	pathname: string
	onClose: () => void
}

export const SidebarContent = ({
	mode,
	collapsed,
	pathname,
	onClose,
}: ISidebarContentProps) => {
	return (
		<div className='flex flex-col h-full justify-between'>
			<div>
				{mode === 'desktop' ? (
					<SidebarHeader />
				) : (
					<div className='flex items-center justify-between border-b border-border p-2'>
						<div className='w-10 h-10 flex items-center justify-center'>
							<Image src='/Resto-Hub.png' alt='Logo' width={40} height={40} />
						</div>
						<button
							onClick={onClose}
							className={cn(
								'p-2 rounded-lg hover:bg-secondary',
								'transition-colors duration-200',
							)}
							aria-label='Open menu'
						>
							<CloseIcon />
						</button>
					</div>
				)}

				<SidebarNav collapsed={collapsed} pathname={pathname} />
			</div>
			<SideBarUser collapsed={collapsed} />
		</div>
	)
}

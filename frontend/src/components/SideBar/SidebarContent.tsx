import { useAuth } from '@/providers/AuthContext'
import { cn } from '@/utils/cn'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Image from 'next/image'
import { SidebarHeader } from './SidebarHeader'
import { SidebarNav } from './SidebarNav'

interface SidebarContentProps {
	mode: 'desktop' | 'mobile'
	collapsed: boolean
	setCollapsed: (value: boolean) => void
	routes: { name: string; path: string; icon: React.ElementType }[]
	pathname: string
	onClose: () => void
}

export const SidebarContent = ({
	mode,
	collapsed,
	setCollapsed,
	routes,
	pathname,
	onClose,
}: SidebarContentProps) => {
	const { user } = useAuth()
	return (
		<div className='flex flex-col h-full justify-between'>
			<div>
				{mode === 'desktop' ? (
					<SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
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

				<SidebarNav collapsed={collapsed} routes={routes} pathname={pathname} />
			</div>

			<div className='p-2 border-t border-border flex items-center justify-between'>
				<div className='flex items-center gap-2 overflow-hidden'>
					<Image
						src={user?.avatarUrl || '/Resto-Hub.png'}
						alt='User avatar'
						width={40}
						height={40}
						className='rounded-full'
					/>
					{!collapsed && (
						<div className='flex flex-col min-w-0'>
							<span className='text-sm font-medium text-foreground truncate'>
								{user?.name}
							</span>
							<span className='text-xs text-secondary truncate'>{user?.email}</span>
						</div>
					)}
				</div>
				{!collapsed && (
					<button
						className='w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground'
						aria-label='User menu'
					>
						<MoreVertIcon fontSize='small' />
					</button>
				)}
			</div>
		</div>
	)
}

import { useAuth } from '@/providers/AuthContext'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Image from 'next/image'

interface ISideBarUser {
	collapsed: boolean
}

export const SideBarUser = ({ collapsed }: ISideBarUser) => {
	const { user } = useAuth()

	return (
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
	)
}

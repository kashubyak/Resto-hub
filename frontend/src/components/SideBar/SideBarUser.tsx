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
			{!collapsed ? (
				<>
					<div className='flex items-center gap-2 overflow-hidden'>
						<Image
							src={user?.avatarUrl || '/Resto-Hub.png'}
							alt='User avatar'
							width={40}
							height={40}
							className='rounded-md'
						/>
						<div className='flex flex-col min-w-0'>
							<span className='text-sm font-medium text-foreground truncate'>
								{user?.name}
							</span>
							<span className='text-xs text-secondary truncate'>{user?.email}</span>
						</div>
					</div>
					<button
						className='w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground'
						aria-label='User menu'
					>
						<MoreVertIcon fontSize='small' />
					</button>
				</>
			) : (
				<button
					onClick={() => {}}
					className='group w-12 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground relative overflow-hidden'
					aria-label='User menu'
				>
					<span className='relative w-10 h-10 flex items-center justify-center'>
						<span className='absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0'>
							<Image
								src={user?.avatarUrl || '/Resto-Hub.png'}
								alt='User avatar'
								width={40}
								height={40}
								className='object-cover rounded-md'
							/>
						</span>
						<span className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
							<MoreVertIcon fontSize='small' />
						</span>
					</span>
				</button>
			)}
		</div>
	)
}

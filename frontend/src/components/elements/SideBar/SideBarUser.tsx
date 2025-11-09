'use client'

import { useDropdownMenu } from '@/hooks/useDropdownMenu'
import { useAuth } from '@/providers/AuthContext'
import type { IUser } from '@/types/user.interface'
import LogoutIcon from '@mui/icons-material/Logout'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { memo, useMemo } from 'react'
import { KebabMenu, type IMenuItem } from '../../ui/KebabMenu'
import { ViewableImage } from '../ImageViewer/ViewableImage'

const ExpandedUserView = memo(
	({
		user,
		buttonRef,
		toggleMenu,
		isOpen,
	}: {
		user: IUser | null
		buttonRef: React.RefObject<HTMLButtonElement | null>
		toggleMenu: () => void
		isOpen: boolean
	}) => (
		<>
			<div className='flex items-center gap-2 overflow-hidden'>
				<ViewableImage
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
				ref={buttonRef}
				onClick={toggleMenu}
				className='w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground transition-colors duration-150'
				aria-label='User menu'
				aria-expanded={isOpen}
				aria-haspopup='true'
			>
				<MoreVertIcon fontSize='small' />
			</button>
		</>
	),
)
ExpandedUserView.displayName = 'ExpandedUserView'

const CollapsedUserView = memo(
	({
		user,
		buttonRef,
		toggleMenu,
		isOpen,
	}: {
		user: IUser | null
		buttonRef: React.RefObject<HTMLButtonElement | null>
		toggleMenu: () => void
		isOpen: boolean
	}) => (
		<button
			ref={buttonRef}
			onClick={toggleMenu}
			className='group w-12 h-10 flex items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground relative overflow-hidden transition-colors duration-150'
			aria-label='User menu'
			aria-expanded={isOpen}
			aria-haspopup='true'
		>
			<span className='relative w-10 h-10 flex items-center justify-center'>
				<span className='absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0'>
					<ViewableImage
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
	),
)
CollapsedUserView.displayName = 'CollapsedUserView'

export const SideBarUser = memo(({ collapsed }: { collapsed: boolean }) => {
	const { user, logout } = useAuth()
	const { isOpen, position, toggleMenu, closeMenu, menuRef, buttonRef } =
		useDropdownMenu()

	const menuItems: IMenuItem[] = useMemo(
		() => [
			{
				id: 'logout',
				label: 'Logout',
				onClick: logout,
				icon: <LogoutIcon fontSize='small' />,
			},
		],
		[logout],
	)

	return (
		<div className='p-2 border-t border-border flex items-center justify-between relative'>
			{!collapsed ? (
				<ExpandedUserView
					user={user}
					buttonRef={buttonRef}
					toggleMenu={toggleMenu}
					isOpen={isOpen}
				/>
			) : (
				<CollapsedUserView
					user={user}
					buttonRef={buttonRef}
					toggleMenu={toggleMenu}
					isOpen={isOpen}
				/>
			)}

			<KebabMenu
				isOpen={isOpen}
				position={position}
				menuRef={menuRef}
				items={menuItems}
				onClose={closeMenu}
			/>
		</div>
	)
})

SideBarUser.displayName = 'SideBarUser'

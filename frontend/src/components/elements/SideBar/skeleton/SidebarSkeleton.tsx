import { useSidebarStore } from '@/store/sidebar.store'
import { cn } from '@/utils/cn'
import { memo, useCallback } from 'react'
import { SidebarContentSkeleton } from './SidebarContentSkeleton'

const MobileOverlay = memo(({ onClose }: { onClose: () => void }) => (
	<div
		className="absolute inset-0 bg-background opacity-50"
		onClick={onClose}
		aria-hidden="true"
	/>
))
MobileOverlay.displayName = 'MobileOverlay'

const DesktopSidebarSkeleton = memo(({ collapsed }: { collapsed: boolean }) => (
	<aside
		className={cn(
			'h-screen border-r border-border text-secondary-foreground flex-col transition-all duration-300 hidden md:flex',
			collapsed ? 'w-16 bg-background' : 'w-56 bg-secondary',
		)}
	>
		<SidebarContentSkeleton mode="desktop" collapsed={collapsed} />
	</aside>
))
DesktopSidebarSkeleton.displayName = 'DesktopSidebarSkeleton'

const MobileSidebarSkeleton = memo(
	({ isOpen, collapsed }: { isOpen: boolean; collapsed: boolean }) => (
		<aside
			className={cn(
				'absolute left-0 top-0 h-full w-56 bg-secondary border-r border-border flex flex-col transition-transform duration-300',
				isOpen ? 'translate-x-0' : '-translate-x-full',
			)}
		>
			<SidebarContentSkeleton mode="mobile" collapsed={collapsed && !isOpen} />
		</aside>
	),
)
MobileSidebarSkeleton.displayName = 'MobileSidebarSkeleton'

export const SidebarSkeleton = memo(() => {
	const mobileOpen = useSidebarStore((state) => state.mobileOpen)
	const collapsed = useSidebarStore((state) => state.collapsed)
	const setMobileOpen = useSidebarStore((state) => state.setMobileOpen)
	const handleMobileClose = useCallback(
		() => setMobileOpen(false),
		[setMobileOpen],
	)

	return (
		<>
			<DesktopSidebarSkeleton collapsed={collapsed} />
			<div
				className={cn(
					'fixed inset-0 z-40 md:hidden transition-opacity duration-300',
					mobileOpen
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none',
				)}
			>
				<MobileOverlay onClose={handleMobileClose} />
				<MobileSidebarSkeleton isOpen={mobileOpen} collapsed={collapsed} />
			</div>
		</>
	)
})

SidebarSkeleton.displayName = 'SidebarSkeleton'

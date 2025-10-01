'use client'

import { Header } from '@/components/container/Header'
import React, { memo } from 'react'
import { Sidebar } from './Sidebar'

type Props = { children: React.ReactNode }

export const SidebarShell = memo(({ children }: Props) => {
	return (
		<div className='flex h-screen'>
			<Sidebar />
			<div className='flex-1 flex flex-col'>
				<Header />
				<main className='flex-1 overflow-y-auto'>{children}</main>
			</div>
		</div>
	)
})

SidebarShell.displayName = 'SidebarShell'

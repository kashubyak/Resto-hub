'use client'

import { Header } from '@/components/container/Header'
import React from 'react'
import { Sidebar } from './Sidebar'

type Props = { children: React.ReactNode }

export const SidebarShell = ({ children }: Props) => {
	return (
		<div className='flex h-screen'>
			<Sidebar />
			<div className='flex-1 flex flex-col'>
				<Header />
				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</div>
	)
}

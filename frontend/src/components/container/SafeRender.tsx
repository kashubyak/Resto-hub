'use client'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useNetworkProgress } from '@/hooks/useNetworkProgress'
import { type JSX, type ReactElement, type ReactNode } from 'react'
import { LoadingPage } from '../ui/LoadingPage'

interface ISafeRenderProps {
	children: ReactNode
	fallback?: ReactElement
	title?: string
	waitForUser?: boolean
	showNetworkProgress?: boolean
}

export function SafeRender({
	children,
	fallback,
	title = 'Loading...',
	waitForUser = true,
	showNetworkProgress = false,
}: ISafeRenderProps): JSX.Element | null {
	const { loading: userLoading, totalProgress: userProgress } = useCurrentUser()
	const { totalProgress: networkProgress, isLoading: networkLoading } =
		useNetworkProgress()

	const isLoading = (waitForUser && userLoading) || networkLoading

	if (isLoading) {
		if (fallback) return fallback
		const finalProgress =
			showNetworkProgress && networkLoading ? networkProgress : userProgress

		return <LoadingPage progress={finalProgress} title={title} />
	}

	return children as ReactElement
}

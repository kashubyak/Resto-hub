import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useNetworkProgress } from '@/hooks/useNetworkProgress'
import { type ReactNode } from 'react'
import { LoadingPage } from '../ui/LoadingPage'

interface ISafeRenderProps {
	children: ReactNode
	fallback?: ReactNode
	title?: string
	waitForUser?: boolean
	showNetworkProgress?: boolean
}

export const SafeRender = ({
	children,
	fallback,
	title = 'Loading...',
	waitForUser = true,
	showNetworkProgress = false,
}: ISafeRenderProps) => {
	const { loading: userLoading, totalProgress: userProgress } = useCurrentUser()
	const { totalProgress: networkProgress, isLoading: networkLoading } =
		useNetworkProgress()

	const isLoading = (waitForUser && userLoading) || networkLoading

	if (isLoading) {
		if (fallback) return fallback as React.ReactElement
		const finalProgress =
			showNetworkProgress && networkLoading ? networkProgress : userProgress

		return <LoadingPage progress={finalProgress} title={title} />
	}

	return children as React.ReactElement
}

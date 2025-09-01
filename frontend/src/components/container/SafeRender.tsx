import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useNetworkProgress } from '@/hooks/useNetworkProgress'
import { useEffect, useState, type ReactNode } from 'react'
import { Loading } from '../ui/Loading'

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
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setIsMounted(true), 50)
		return () => clearTimeout(timer)
	}, [])

	const isLoading =
		!isMounted || (waitForUser && userLoading) || (showNetworkProgress && networkLoading)

	if (isLoading) {
		if (fallback) return fallback as React.ReactElement

		const finalProgress =
			showNetworkProgress && networkLoading ? networkProgress : userProgress

		return <Loading progress={finalProgress} title={title} />
	}

	return children as React.ReactElement
}

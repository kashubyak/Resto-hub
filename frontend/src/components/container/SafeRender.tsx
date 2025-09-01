import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useNetworkProgress } from '@/hooks/useNetworkProgress'
import { useEffect, useState, type ReactNode } from 'react'
import { Loading } from '../ui/Loading'

interface ISafeRenderProps {
	children: ReactNode
	fallback?: ReactNode
	title?: string
	waitForUser?: boolean
	loadingProgress?: number
	showNetworkProgress?: boolean
}

export const SafeRender = ({
	children,
	fallback,
	title = 'Loading...',
	waitForUser = true,
	loadingProgress,
	showNetworkProgress = false,
}: ISafeRenderProps) => {
	const { loading: userLoading, loadingProgress: userProgress } = useCurrentUser()
	const { totalProgress: networkProgress, isLoading: networkLoading } =
		useNetworkProgress()
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setIsMounted(true), 100)
		return () => clearTimeout(timer)
	}, [])

	const isLoading =
		!isMounted || (waitForUser && userLoading) || (showNetworkProgress && networkLoading)

	if (isLoading) {
		if (fallback) return fallback as React.ReactElement

		let finalProgress = loadingProgress
		if (!finalProgress) {
			if (showNetworkProgress && networkLoading) {
				finalProgress = networkProgress
			} else if (userLoading) {
				finalProgress = userProgress
			} else {
				finalProgress = undefined
			}
		}

		return <Loading progress={finalProgress} title={title} />
	}

	return children as React.ReactElement
}

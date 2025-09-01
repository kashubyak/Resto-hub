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
	minLoadingTime?: number // анти-блим
}

export const SafeRender = ({
	children,
	fallback,
	title = 'Loading...',
	waitForUser = true,
	showNetworkProgress = false,
	minLoadingTime = 400,
}: ISafeRenderProps) => {
	const { loading: userLoading, totalProgress: userProgress } = useCurrentUser()
	const { totalProgress: networkProgress, isLoading: networkLoading } =
		useNetworkProgress()
	const [showLoader, setShowLoader] = useState(true)

	useEffect(() => {
		let timer: NodeJS.Timeout

		if (!userLoading && !networkLoading) {
			timer = setTimeout(() => setShowLoader(false), minLoadingTime)
		} else {
			setShowLoader(true)
		}

		return () => clearTimeout(timer)
	}, [userLoading, networkLoading, minLoadingTime])

	if (showLoader) {
		if (fallback) return fallback as React.ReactElement
		const finalProgress =
			showNetworkProgress && networkLoading ? networkProgress : userProgress

		return <Loading progress={finalProgress} title={title} />
	}

	return children as React.ReactElement
}

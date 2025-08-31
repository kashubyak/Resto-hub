import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useEffect, useState, type ReactNode } from 'react'
import { Loading } from '../ui/Loading'

interface ISafeRenderProps {
	children: ReactNode
	fallback?: ReactNode
	title?: string
	waitForUser?: boolean
	loadingProgress?: number
}

export const SafeRender = ({
	children,
	fallback,
	title = 'Loading...',
	waitForUser = true,
	loadingProgress,
}: ISafeRenderProps) => {
	const { loading } = useCurrentUser()
	const [isMounted, setIsMounted] = useState(false)
	const [mountProgress, setMountProgress] = useState(0)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsMounted(true)
			setMountProgress(100)
		}, 500)

		const progressTimer = setInterval(() => {
			setMountProgress(prev => {
				if (prev >= 90) return prev
				return prev + 10
			})
		}, 50)

		return () => {
			clearTimeout(timer)
			clearInterval(progressTimer)
		}
	}, [])

	const isLoading = !isMounted || (waitForUser && loading)

	if (isLoading) {
		if (fallback) return fallback as React.ReactElement
		let totalProgress = loadingProgress
		if (!totalProgress) {
			if (!isMounted) {
				totalProgress = mountProgress
			} else if (loading) {
				totalProgress = 95
			}
		}

		return <Loading progress={totalProgress} title={title} />
	}

	return children as React.ReactElement
}

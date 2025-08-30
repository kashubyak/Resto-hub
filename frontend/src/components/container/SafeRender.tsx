import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useEffect, useState, type ReactNode } from 'react'

interface ISafeRenderProps {
	children: ReactNode
	fallback?: ReactNode
	title?: string
	waitForUser?: boolean
}
export const SafeRender = ({
	children,
	fallback,
	title,
	waitForUser = true,
}: ISafeRenderProps) => {
	const { loading } = useCurrentUser()
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => setIsMounted(true), [])
	const isLoading = !isMounted || (waitForUser && loading)
	if (isLoading) {
		if (fallback) return fallback as React.ReactElement

		return (
			<div>
				{title && <h1>{title}</h1>}
				<p>Loading...</p>
			</div>
		)
	}

	return children as React.ReactElement
}

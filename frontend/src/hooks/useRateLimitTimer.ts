import { useEffect, useRef, useState } from 'react'

export const useRateLimitTimer = (retryAfter: number | null | undefined) => {
	const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	useEffect(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = null
		}

		if (retryAfter === null || retryAfter === undefined || retryAfter <= 0) {
			setSecondsLeft(null)
			return
		}

		setSecondsLeft(retryAfter)

		intervalRef.current = setInterval(() => {
			setSecondsLeft(prev => {
				if (prev === null || prev <= 1) {
					if (intervalRef.current) {
						clearInterval(intervalRef.current)
						intervalRef.current = null
					}
					return null
				}
				return prev - 1
			})
		}, 1000)

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
	}, [retryAfter])

	return secondsLeft
}


export const formatRetryTime = (seconds: number): string => {
	if (seconds <= 0) return '0s'

	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60

	if (minutes > 0) return `${minutes}m ${remainingSeconds}s`
	return `${seconds}s`
}

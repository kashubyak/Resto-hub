import { useEffect, useState } from 'react'

interface UseLoadingProgressProps {
	isLoading: boolean
	minDuration?: number
	steps?: number
}

export function useLoadingProgress({
	isLoading,
	minDuration = 2000,
	steps = 20,
}: UseLoadingProgressProps) {
	const [progress, setProgress] = useState(0)
	const [smoothProgress, setSmoothProgress] = useState(0)

	useEffect(() => {
		if (!isLoading) {
			setProgress(100)
			setSmoothProgress(100)
			return
		}

		setProgress(0)
		setSmoothProgress(0)

		const stepInterval = minDuration / steps
		let currentStep = 0

		const interval = setInterval(() => {
			currentStep++

			const slowdownFactor = 1 - Math.pow(currentStep / steps, 2) * 0.5
			const baseProgress =
				(currentStep / steps) * 85 * slowdownFactor + (currentStep / steps) * 15

			const randomVariation = (Math.random() - 0.5) * 5
			const adjustedProgress = Math.min(Math.max(baseProgress + randomVariation, 0), 85)

			setProgress(adjustedProgress)

			if (currentStep >= steps) {
				clearInterval(interval)
			}
		}, stepInterval + Math.random() * 100)

		return () => clearInterval(interval)
	}, [isLoading, minDuration, steps])

	useEffect(() => {
		const animate = () => {
			setSmoothProgress(prev => {
				const diff = progress - prev
				if (Math.abs(diff) < 0.1) return progress
				return prev + diff * 0.1
			})
		}

		const animationFrame = setInterval(animate, 16)
		return () => clearInterval(animationFrame)
	}, [progress])

	return Math.round(smoothProgress)
}

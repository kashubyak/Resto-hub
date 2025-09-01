import { useEffect, useState } from 'react'

interface NetworkRequest {
	url: string
	progress: number
	completed: boolean
	timestamp: number
	interval?: NodeJS.Timeout
}

const networkRequests = new Map<string, NetworkRequest>()
const progressListeners = new Set<(progress: number) => void>()

function notifyListeners() {
	const requests = Array.from(networkRequests.values())
	const avgProgress =
		requests.length > 0
			? requests.reduce((sum, req) => sum + req.progress, 0) / requests.length
			: 0

	progressListeners.forEach(listener => listener(avgProgress))
}

export function useNetworkProgress() {
	const [totalProgress, setTotalProgress] = useState(0)
	const [activeRequests, setActiveRequests] = useState(0)

	useEffect(() => {
		const updateProgress = (progress: number) => {
			setTotalProgress(Math.round(progress))
			setActiveRequests(networkRequests.size)
		}

		progressListeners.add(updateProgress)

		return () => {
			progressListeners.delete(updateProgress)
		}
	}, [])

	return {
		totalProgress,
		activeRequests,
		isLoading: activeRequests > 0,
	}
}

export function startNetworkRequest(url: string): string {
	const requestId = `${url}_${Date.now()}_${Math.random()}`

	const interval = setInterval(() => {
		const request = networkRequests.get(requestId)
		if (!request || request.completed) {
			clearInterval(interval)
			return
		}

		const increment = Math.random() * 10 + 5
		const newProgress = Math.min(request.progress + increment, 85)

		networkRequests.set(requestId, {
			...request,
			progress: newProgress,
		})

		notifyListeners()
	}, 150 + Math.random() * 100)

	networkRequests.set(requestId, {
		url,
		progress: 0,
		completed: false,
		timestamp: Date.now(),
		interval,
	})

	notifyListeners()
	return requestId
}

export function completeNetworkRequest(requestId: string) {
	const request = networkRequests.get(requestId)
	if (request) {
		if (request.interval) clearInterval(request.interval)

		networkRequests.set(requestId, {
			...request,
			progress: 100,
			completed: true,
			interval: undefined,
		})

		notifyListeners()

		setTimeout(() => {
			networkRequests.delete(requestId)
			notifyListeners()
		}, 300)
	}
}

export function failNetworkRequest(requestId: string) {
	const request = networkRequests.get(requestId)
	if (request?.interval) {
		clearInterval(request.interval)
	}
	networkRequests.delete(requestId)
	notifyListeners()
}

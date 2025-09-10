import { useEffect, useState } from 'react'

interface INetworkRequest {
	url: string
	progress: number
	completed: boolean
	timestamp: number
}

const networkRequests = new Map<string, INetworkRequest>()
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
	networkRequests.set(requestId, {
		url,
		progress: 0,
		completed: false,
		timestamp: Date.now(),
	})
	notifyListeners()
	return requestId
}

export function updateNetworkProgress(requestId: string, loaded: number, total?: number) {
	const request = networkRequests.get(requestId)
	if (!request) return

	const progress = total ? Math.min((loaded / total) * 100, 99) : request.progress
	networkRequests.set(requestId, { ...request, progress })
	notifyListeners()
}

export function completeNetworkRequest(requestId: string) {
	if (networkRequests.has(requestId)) {
		networkRequests.delete(requestId)
		notifyListeners()
	}
}

export function failNetworkRequest(requestId: string) {
	networkRequests.delete(requestId)
	notifyListeners()
}

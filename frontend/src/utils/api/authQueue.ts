let isRefreshing = false
let failedQueue: {
	resolve: (value?: unknown) => void
	reject: (error?: unknown) => void
}[] = []

export const getIsRefreshing = () => isRefreshing
export const setIsRefreshing = (val: boolean) => {
	isRefreshing = val
}

export const pushToQueue = (
	resolve: (value?: unknown) => void,
	reject: (error?: unknown) => void,
) => {
	failedQueue.push({ resolve, reject })
}

export const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach(prom => {
		if (error) prom.reject(error)
		else prom.resolve(token)
	})
	failedQueue = []
}

interface IQueueItem {
	resolve: (value?: unknown) => void
	reject: (error?: unknown) => void
}

let isRefreshing = false
let failedQueue: IQueueItem[] = []

export const getIsRefreshing = (): boolean => isRefreshing
export const setIsRefreshing = (val: boolean): void => {
	isRefreshing = val
}

export const pushToQueue = (
	resolve: (value?: unknown) => void,
	reject: (error?: unknown) => void,
): void => {
	failedQueue.push({ resolve, reject })
}

export const processQueue = (
	error: unknown,
	token: string | null = null,
): void => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error)
		else prom.resolve(token)
	})
	failedQueue = []
}

export const clearQueue = (): void => {
	failedQueue = []
}

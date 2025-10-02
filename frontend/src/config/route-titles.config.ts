import { API_URL } from './api'

const titleCache = new Map<string, string>()
export const DYNAMIC_ROUTE_TITLES: Record<string, (id: string) => string> = {
	[API_URL.DISH.ROOT]: id => `Dish #${id}`,
	[API_URL.CATEGORY.ROOT]: id => `Category #${id}`,
	[API_URL.ORDER.ROOT]: id => `Order #${id}`,
	[API_URL.TABLE.ROOT]: id => `Table #${id}`,
	[API_URL.USER.ROOT]: id => `User #${id}`,
}

export const getPageTitle = (
	pathname: string,
	params: Readonly<{ [key: string]: string | string[] | undefined }>,
	fallbackName?: string,
): string => {
	const id = params?.id

	if (id && typeof id === 'string') {
		const cacheKey = `${pathname}-${id}`
		if (titleCache.has(cacheKey)) return titleCache.get(cacheKey)!

		for (const [route, formatter] of Object.entries(DYNAMIC_ROUTE_TITLES)) {
			if (pathname.includes(route)) {
				const title = formatter(id)
				titleCache.set(cacheKey, title)
				return title
			}
		}
	}

	return fallbackName ?? 'Page'
}
export const clearTitleCache = () => titleCache.clear()

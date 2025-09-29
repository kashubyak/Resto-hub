import { API_URL } from './api'

export const DYNAMIC_ROUTE_TITLES: Record<string, (id: string) => string> = {
	[API_URL.DISH.ROOT]: id => `Dish #${id}`,
	[API_URL.CATEGORY.ROOT]: id => `Category #${id}`,
	[API_URL.ORDER.ROOT]: id => `Order #${id}`,
	[API_URL.TABLE.ROOT]: id => `Table #${id}`,
	[API_URL.USER.ROOT]: id => `User #${id}`,
}

/**
 * @param pathname
 * @param params
 * @param fallbackName
 * @returns
 */

export const getPageTitle = (
	pathname: string,
	params: Readonly<{ [key: string]: string | string[] | undefined }>,
	fallbackName?: string,
): string => {
	const id = params?.id

	if (id && typeof id === 'string') {
		for (const [route, formatter] of Object.entries(DYNAMIC_ROUTE_TITLES))
			if (pathname.includes(route)) return formatter(id)
	}

	return fallbackName ?? 'Page'
}

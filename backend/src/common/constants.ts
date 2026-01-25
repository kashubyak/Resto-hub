export const IS_PUBLIC_KEY = 'PUBLIC_METHOD'
export const socket_events = {
	NEW_ORDER: 'new-order',
	ORDER_COMPLETED: 'order-completed',
}
export const socket_rooms = {
	KITCHEN: 'kitchen',
	WAITER: (waiterId: number) => `waiter-${waiterId}`,
}
export const size_of_image = 10

const isTestEnv = process.env.NODE_ENV === 'test'
export const folder_dish = isTestEnv ? 'test/dishes' : 'dishes'
export const folder_avatar = isTestEnv ? 'test/avatars' : 'avatars'
export const company_avatar = isTestEnv
	? 'test/company-avatars'
	: 'company-avatars'

export const companyIdFromSubdomain = 'companyIdFromSubdomain'

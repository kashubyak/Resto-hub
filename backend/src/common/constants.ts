export const IS_PUBLIC_KEY = 'PUBLIC_METHOD';
export const socket_events = {
  NEW_ORDER: 'new-order',
  ORDER_COMPLETED: 'order-completed',
};
export const socket_rooms = {
  KITCHEN: 'kitchen',
  WAITER: (waiterId: number) => `waiter-${waiterId}`,
};
export const size_of_image = 15;

export const folder_dish = 'dishes';
export const folder_avatar = 'avatars';
export const company_avatar = 'company-avatars';

export const companyIdFromSubdomain = 'companyIdFromSubdomain';

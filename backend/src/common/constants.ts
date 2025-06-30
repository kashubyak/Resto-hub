export const IS_PUBLIC_KEY = 'PUBLIC_METHOD';
export const socket_events = {
  NEW_ORDER: 'new-order',
  ORDER_COMPLETED: 'order-completed',
};
export const socket_rooms = {
  KITCHEN: 'kitchen',
  WAITER: (waiterId: number) => `waiter-${waiterId}`,
};

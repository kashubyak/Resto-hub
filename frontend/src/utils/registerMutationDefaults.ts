import { MUTATION_KEY } from '@/constants/mutation-keys.constant'
import { deleteCompanyService } from '@/services/company/delete-company.service'
import {
	buildUpdateCompanyFormData,
	updateCompanyService,
} from '@/services/company/update-company.service'
import { deleteDishFromCategory } from '@/services/dish/delete-dish-category.service'
import { deleteDish } from '@/services/dish/delete-dish.service'
import { updateDishService } from '@/services/dish/update-dish.service'
import { assignOrderService } from '@/services/order/assign-order.service'
import { cancelOrderService } from '@/services/order/cancel-order.service'
import { updateOrderStatusService } from '@/services/order/update-order-status.service'
import { createTableService } from '@/services/table/create-table.service'
import { deleteTableService } from '@/services/table/delete-table.service'
import { updateTableService } from '@/services/table/update-table.service'
import type { OrderStatus } from '@/types/order.interface'
import type { QueryClient } from '@tanstack/react-query'

export const registerMutationDefaults = (queryClient: QueryClient): void => {
	queryClient.setMutationDefaults(MUTATION_KEY.DISH.DELETE, {
		mutationFn: async (id: number) => {
			const response = await deleteDish(id)
			return response.data
		},
	})

	queryClient.setMutationDefaults(MUTATION_KEY.DISH.DELETE_FROM_CATEGORY, {
		mutationFn: async (id: number) => {
			const response = await deleteDishFromCategory(id)
			return response.data
		},
	})

	queryClient.setMutationDefaults(MUTATION_KEY.DISH.ASSIGN_CATEGORY, {
		mutationFn: ({ id, categoryId }: { id: number; categoryId: number }) =>
			updateDishService({ id, categoryId }),
	})

	queryClient.setMutationDefaults(MUTATION_KEY.ORDER.ASSIGN, {
		mutationFn: (orderId: number) => assignOrderService(orderId),
	})

	queryClient.setMutationDefaults(MUTATION_KEY.ORDER.UPDATE_STATUS, {
		mutationFn: ({
			orderId,
			status,
		}: {
			orderId: number
			status: OrderStatus
		}) => updateOrderStatusService(orderId, { status }),
	})

	queryClient.setMutationDefaults(MUTATION_KEY.ORDER.CANCEL, {
		mutationFn: (orderId: number) => cancelOrderService(orderId),
	})

	queryClient.setMutationDefaults(MUTATION_KEY.TABLE.CREATE, {
		mutationFn: (data: { number: number; seats: number }) =>
			createTableService(data),
	})

	queryClient.setMutationDefaults(MUTATION_KEY.TABLE.UPDATE, {
		mutationFn: (data: { id: number; number: number; seats: number }) =>
			updateTableService(data.id, {
				number: data.number,
				seats: data.seats,
			}),
	})

	queryClient.setMutationDefaults(MUTATION_KEY.TABLE.TOGGLE_ACTIVE, {
		mutationFn: (data: { id: number; active: boolean }) =>
			updateTableService(data.id, { active: data.active }),
	})

	queryClient.setMutationDefaults(MUTATION_KEY.TABLE.DELETE, {
		mutationFn: (id: number) => deleteTableService(id),
	})

	queryClient.setMutationDefaults(MUTATION_KEY.COMPANY.UPDATE, {
		mutationFn: (payload: Parameters<typeof buildUpdateCompanyFormData>[0]) =>
			updateCompanyService(buildUpdateCompanyFormData(payload)),
	})

	queryClient.setMutationDefaults(MUTATION_KEY.COMPANY.DELETE, {
		mutationFn: () => deleteCompanyService(),
	})
}

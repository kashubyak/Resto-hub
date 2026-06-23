import {
	useMutation,
	type UseMutationOptions,
} from '@tanstack/react-query'

export const useRegisteredMutation = <
	TData = unknown,
	TError = Error,
	TVariables = void,
	TContext = unknown,
>(
	options: Omit<
		UseMutationOptions<TData, TError, TVariables, TContext>,
		'mutationFn'
	> & { mutationKey: readonly unknown[] },
) => useMutation<TData, TError, TVariables, TContext>(options)

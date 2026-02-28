import type { AlertSeverity } from '@/types/alert.interface'

type ShowAlertFunction = (
	severity: AlertSeverity,
	text: string | string[],
) => void
let globalShowAlert: ShowAlertFunction | null = null

export function setGlobalAlertFunction(showAlert: ShowAlertFunction): void {
	globalShowAlert = showAlert
}

export const getGlobalShowAlert = (): ShowAlertFunction | null =>
	globalShowAlert

export const clearGlobalAlertFunction = (): void => {
	globalShowAlert = null
}

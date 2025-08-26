import type { AlertSeverity } from '@/types/alert.interface'

let globalShowAlert: ((severity: AlertSeverity, text: string | string[]) => void) | null =
	null

export function setGlobalAlertFunction(
	showAlert: (severity: AlertSeverity, text: string | string[]) => void,
) {
	globalShowAlert = showAlert
}

export const getGlobalShowAlert = () => globalShowAlert

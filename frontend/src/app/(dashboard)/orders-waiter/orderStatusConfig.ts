import type { OrderStatus } from '@/types/order.interface'
import {
	CheckCircle2,
	Clock,
	Loader2,
	type LucideIcon,
	XCircle,
} from 'lucide-react'

export const orderStatusConfig: Record<
	OrderStatus,
	{
		label: string
		icon: LucideIcon
		colorClass: string
		bgClass: string
	}
> = {
	PENDING: {
		label: 'Pending',
		icon: Clock,
		colorClass: 'text-warning',
		bgClass: 'bg-warning/10 border-warning/20',
	},
	IN_PROGRESS: {
		label: 'In Progress',
		icon: Loader2,
		colorClass: 'text-info',
		bgClass: 'bg-info/10 border-info/20',
	},
	COMPLETE: {
		label: 'Complete',
		icon: CheckCircle2,
		colorClass: 'text-success',
		bgClass: 'bg-success/10 border-success/20',
	},
	CANCELED: {
		label: 'Canceled',
		icon: XCircle,
		colorClass: 'text-destructive',
		bgClass: 'bg-destructive/10 border-destructive/20',
	},
	DELIVERED: {
		label: 'Delivered',
		icon: CheckCircle2,
		colorClass: 'text-success',
		bgClass: 'bg-success/10 border-success/20',
	},
	FINISHED: {
		label: 'Finished',
		icon: CheckCircle2,
		colorClass: 'text-muted-foreground',
		bgClass: 'bg-muted border-border',
	},
}

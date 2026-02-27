'use client'

import type { IDish } from '@/types/dish.interface'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteDishModalProps {
	open: boolean
	onClose: () => void
	dish: IDish | undefined
	onConfirm: () => void
	isPending: boolean
}

export function DeleteDishModal({
	open,
	onClose,
	dish,
	onConfirm,
	isPending,
}: DeleteDishModalProps) {
	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Close modal"
				onClick={onClose}
				className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300"
			/>
			<div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 overflow-hidden">
				<div className="bg-gradient-to-br from-red-500/10 to-red-500/5 p-6 border-b-2 border-border">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
							<AlertTriangle className="w-6 h-6 text-red-600" />
						</div>
						<div className="flex-1">
							<h3 className="text-xl font-bold text-foreground">
								Delete Dish?
							</h3>
							<p className="text-sm text-muted-foreground mt-1">
								This action cannot be undone.
							</p>
						</div>
						<button
							type="button"
							onClick={onClose}
							aria-label="Close"
							className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
						>
							<X className="w-5 h-5 text-muted-foreground" />
						</button>
					</div>
				</div>
				<div className="p-6">
					{dish && (
						<div className="p-4 bg-background border-2 border-border rounded-xl mb-6">
							<p className="text-sm font-semibold text-foreground mb-1">
								{dish.name}
							</p>
							<p className="text-xs text-muted-foreground">ID: {dish.id}</p>
							{dish.category && (
								<p className="text-xs text-muted-foreground mt-1">
									Category: {dish.category.name}
								</p>
							)}
						</div>
					)}
					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 h-11 rounded-xl border-2 border-border bg-transparent text-foreground font-medium hover:bg-accent transition-colors"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={onConfirm}
							disabled={isPending}
							className="flex-1 h-11 rounded-xl border-2 border-red-500 bg-red-500 text-red-50 font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
						>
							<Trash2 className="w-4 h-4" />
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

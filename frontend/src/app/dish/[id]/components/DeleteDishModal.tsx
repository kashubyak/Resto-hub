import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useEffect } from "react";

interface DeleteDishModalProps {
	open: boolean;
	onClose: () => void;
	dish?: { id: number; name: string; category?: { name: string } };
	onConfirm: () => void;
	isPending: boolean;
}

export function DeleteDishModal({
	open,
	onClose,
	dish,
	onConfirm,
	isPending,
}: DeleteDishModalProps) {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [open])

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in-0 slide-in-from-bottom-4 duration-300">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-border">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
							<AlertTriangle className="w-5 h-5 text-red-500" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-foreground">Delete Dish</h2>
							<p className="text-xs text-muted-foreground mt-0.5">
								This action cannot be undone
							</p>
						</div>
					</div>

					<button
						onClick={onClose}
						className="w-9 h-9 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{dish && (
						<div className="p-4 bg-background border border-border rounded-xl space-y-2">
							<div>
								<p className="text-xs font-medium text-muted-foreground">Dish name</p>
								<p className="text-sm font-semibold text-foreground">{dish.name}</p>
							</div>
							<div>
								<p className="text-xs font-medium text-muted-foreground">Dish ID</p>
								<p className="text-sm text-foreground">{dish.id}</p>
							</div>
							{dish.category && (
								<div>
									<p className="text-xs font-medium text-muted-foreground">Category</p>
									<p className="text-sm text-foreground">{dish.category.name}</p>
								</div>
							)}
						</div>
					)}

					<div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl mt-4">
						<AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
						<p className="text-xs text-muted-foreground">
							This dish will be permanently deleted from the system. This action cannot be undone.
						</p>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="px-6 py-5 border-t border-border">
					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 h-11 bg-accent hover:bg-accent/80 text-foreground rounded-xl font-semibold transition-all"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={onConfirm}
							disabled={isPending}
							className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isPending ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									<span>Deleting...</span>
								</>
							) : (
								<>
									<Trash2 className="w-4 h-4" />
									<span>Delete</span>
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

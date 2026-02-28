import { AlertTriangle, Loader2, X } from "lucide-react";
import { memo, useEffect } from "react";

interface DeleteConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	categoryName?: string;
	dishCount?: number;
	isLoading?: boolean;
}

const DeleteConfirmDialogComponent = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Delete Item",
	message,
	categoryName,
	dishCount = 0,
	isLoading = false,
}: DeleteConfirmDialogProps) => {
	const handleClose = () => {
		if (!isLoading) onClose();
	};

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
				onClick={handleClose}
			/>

			{/* Modal */}
			<div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in-0 slide-in-from-bottom-4 duration-300">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-border">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
							<AlertTriangle className="w-5 h-5 text-red-500" />
						</div>
						<h2 className="text-xl font-bold text-foreground">{title}</h2>
					</div>

					<button
						onClick={handleClose}
						disabled={isLoading}
						className="w-9 h-9 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					{/* Message */}
					<p className="text-sm text-foreground">
						{message ||
							(categoryName ? (
								<>
									Are you sure you want to delete{" "}
									<span className="font-semibold">"{categoryName}"</span>?
								</>
							) : (
								"Are you sure you want to delete this item?"
							))}
					</p>

					{/* Warning box for categories with dishes */}
					{categoryName && dishCount > 0 && (
						<div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
							<AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
							<div className="space-y-1">
								<p className="text-sm font-semibold text-red-600 dark:text-red-400">
									This category contains {dishCount}{" "}
									{dishCount === 1 ? "dish" : "dishes"}
								</p>
								<p className="text-xs text-muted-foreground">
									Deleting this category will unassign all dishes. The dishes
									themselves will not be deleted.
								</p>
							</div>
						</div>
					)}

					{/* Warning box for items without dependencies */}
					{(!categoryName || dishCount === 0) && (
						<div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
							<AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
							<p className="text-xs text-muted-foreground">
								This action cannot be undone. The item will be permanently deleted.
							</p>
						</div>
					)}
				</div>

				{/* Footer Actions */}
				<div className="px-6 py-5 border-t border-border">
					<div className="flex gap-3">
						<button
							type="button"
							onClick={handleClose}
							disabled={isLoading}
							className="flex-1 h-11 bg-accent hover:bg-accent/80 text-foreground rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={onConfirm}
							disabled={isLoading}
							className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									<span>Deleting...</span>
								</>
							) : (
								<span>Delete</span>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export const DeleteConfirmDialog = memo(DeleteConfirmDialogComponent);

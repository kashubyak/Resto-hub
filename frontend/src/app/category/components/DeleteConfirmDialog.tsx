'use client'

import { AlertTriangle, Loader2, X } from 'lucide-react'
import { memo } from 'react'

interface DeleteConfirmDialogProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	categoryName: string
	dishCount: number
	isLoading?: boolean
}

const DeleteConfirmDialogComponent = ({
	isOpen,
	onClose,
	onConfirm,
	categoryName,
	dishCount,
	isLoading = false,
}: DeleteConfirmDialogProps) => {
	const handleClose = () => {
		if (!isLoading) onClose()
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
				onClick={handleClose}
				aria-hidden
			/>

			<div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl animate-in zoom-in-95 fade-in-0 slide-in-from-bottom-4 duration-300 overflow-hidden">
				<div className="relative bg-gradient-to-br from-red-500/90 to-red-600/90 px-6 py-6">
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
							<AlertTriangle className="w-7 h-7 text-white" />
						</div>
						<h2 className="text-2xl font-bold text-white">Delete Category</h2>
					</div>

					<button
						type="button"
						onClick={handleClose}
						disabled={isLoading}
						className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						aria-label="Close dialog"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="p-8 space-y-6">
					<div className="space-y-4">
						<p className="text-base text-white/90">
							Are you sure you want to delete{' '}
							<span className="font-bold text-white">"{categoryName}"</span>?
						</p>

						{dishCount > 0 && (
							<div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
								<div className="w-5 h-5 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
									<AlertTriangle className="w-3 h-3 text-red-400" />
								</div>
								<div className="space-y-1">
									<p className="text-sm font-semibold text-red-400">
										Warning: This category contains {dishCount}{' '}
										{dishCount === 1 ? 'dish' : 'dishes'}
									</p>
									<p className="text-sm text-red-400/70">
										Deleting this category will unassign all dishes. The dishes
										themselves will not be deleted.
									</p>
								</div>
							</div>
						)}

						{dishCount === 0 && (
							<div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
								<div className="w-5 h-5 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
									<AlertTriangle className="w-3 h-3 text-red-400" />
								</div>
								<div className="space-y-1">
									<p className="text-sm text-red-400/70">
										This action cannot be undone. The category will be
										permanently deleted.
									</p>
								</div>
							</div>
						)}
					</div>

					<div className="flex gap-4 pt-2">
						<button
							type="button"
							onClick={handleClose}
							disabled={isLoading}
							className="flex-1 h-14 bg-transparent border-2 border-white/10 hover:bg-white/5 text-white rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={onConfirm}
							disabled={isLoading}
							className="flex-1 h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-semibold transition-all hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									<span>Deleting...</span>
								</>
							) : (
								<span>Delete Category</span>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export const DeleteConfirmDialog = memo(DeleteConfirmDialogComponent)

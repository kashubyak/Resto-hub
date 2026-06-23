'use client'

import { Modal } from '@/components/ui/Modal'
import { Loader2, Trash2 } from 'lucide-react'
import { memo } from 'react'

interface DeleteCompanyDialogProps {
	isOpen: boolean
	companyName: string
	onClose: () => void
	onConfirm: () => void
	isLoading: boolean
}

const DeleteCompanyDialogComponent = ({
	isOpen,
	companyName,
	onClose,
	onConfirm,
	isLoading,
}: DeleteCompanyDialogProps) => {
	const handleClose = () => {
		if (!isLoading) onClose()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			disableClose={isLoading}
			aria-labelledby="delete-company-title"
		>
			<div className="flex items-center gap-4 p-6 border-b border-border">
				<div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
					<Trash2 className="w-6 h-6 text-red-500" />
				</div>
				<div className="flex-1 min-w-0">
					<h2
						id="delete-company-title"
						className="text-xl font-bold text-foreground"
					>
						Delete Company
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						This action cannot be undone
					</p>
				</div>
			</div>

			<div className="p-6">
				<p className="text-foreground">
					Are you sure you want to delete{' '}
					<span className="font-semibold">{companyName}</span>? This will
					permanently remove all company data and cannot be reversed.
				</p>
			</div>

			<div className="flex items-center justify-end gap-3 p-6 border-t border-border">
				<button
					type="button"
					onClick={handleClose}
					disabled={isLoading}
					className="h-11 px-6 bg-input hover:bg-input/80 text-foreground rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onConfirm}
					disabled={isLoading}
					className="inline-flex items-center gap-2 h-11 px-6 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? (
						<>
							<Loader2 className="w-5 h-5 animate-spin" />
							<span>Deleting...</span>
						</>
					) : (
						<>
							<Trash2 className="w-5 h-5" />
							<span>Delete Company</span>
						</>
					)}
				</button>
			</div>
		</Modal>
	)
}

export const DeleteCompanyDialog = memo(DeleteCompanyDialogComponent)

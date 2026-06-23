'use client'

import { Modal } from '@/components/ui/Modal'
import { AlertTriangle, X } from 'lucide-react'

interface DeleteConfirmModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
	userName?: string
}

export const DeleteConfirmModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	userName,
}: DeleteConfirmModalProps) => {
	const handleConfirm = () => {
		onConfirm()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			aria-labelledby="delete-user-title"
		>
			<div className="flex items-center justify-between px-6 py-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-red-500/10 rounded-lg">
						<AlertTriangle className="w-5 h-5 text-red-500" />
					</div>
					<h2
						id="delete-user-title"
						className="text-xl font-bold text-foreground"
					>
						{title}
					</h2>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="p-2 hover:bg-input rounded-lg transition-colors"
				>
					<X className="w-5 h-5 text-muted-foreground" />
				</button>
			</div>

			<div className="px-6 py-6 space-y-4">
				<p className="text-muted-foreground">{message}</p>
				{userName ? (
					<div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
						<p className="text-sm text-foreground">
							<span className="font-semibold">User:</span> {userName}
						</p>
					</div>
				) : null}
				<div className="p-4 bg-accent rounded-xl">
					<p className="text-sm text-muted-foreground">
						This action cannot be undone. All data associated with this user
						will be permanently deleted.
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3 px-6 py-4 border-t border-border">
				<button
					type="button"
					onClick={onClose}
					className="flex-1 px-4 py-2.5 bg-input hover:bg-input/80 rounded-xl transition-colors font-medium text-foreground"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={handleConfirm}
					className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium shadow-lg shadow-red-500/25"
				>
					Delete User
				</button>
			</div>
		</Modal>
	)
}

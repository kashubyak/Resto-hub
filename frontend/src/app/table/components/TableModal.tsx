'use client'

import { Hash, Loader2, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TableModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (number: number, seats: number) => void
	mode: 'create' | 'edit'
	initialNumber?: number
	initialSeats?: number
	isLoading?: boolean
}

export function TableModal({
	isOpen,
	onClose,
	onSubmit,
	mode,
	initialNumber = 1,
	initialSeats = 4,
	isLoading = false,
}: TableModalProps) {
	const [number, setNumber] = useState(initialNumber)
	const [seats, setSeats] = useState(initialSeats)
	const [errors, setErrors] = useState<{ number?: string; seats?: string }>({})

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
			setNumber(initialNumber)
			setSeats(initialSeats)
			setErrors({})
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen, initialNumber, initialSeats])

	const validate = (): boolean => {
		const newErrors: { number?: string; seats?: string } = {}

		if (!number || number < 1) {
			newErrors.number = 'Table number must be at least 1'
		}

		if (!seats || seats < 1) {
			newErrors.seats = 'Seats must be at least 1'
		}

		if (seats > 20) {
			newErrors.seats = 'Seats cannot exceed 20'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validate()) return

		onSubmit(number, seats)
	}

	const handleClose = () => {
		if (!isLoading) onClose()
	}

	if (!isOpen) return null

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
						<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
							<Users className="w-5 h-5 text-primary" />
						</div>
						<h2 className="text-xl font-bold text-foreground">
							{mode === 'create' ? 'Add New Table' : 'Edit Table'}
						</h2>
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
				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{/* Table Number */}
					<div className="space-y-2">
						<label
							htmlFor="table-number"
							className="text-sm font-semibold text-foreground flex items-center gap-1.5"
						>
							<Hash className="w-3.5 h-3.5 text-muted-foreground" />
							Table Number
							<span className="text-red-500">*</span>
						</label>
						<input
							id="table-number"
							type="number"
							min="1"
							value={number}
							onChange={(e) => {
								setNumber(parseInt(e.target.value) || 1)
								setErrors({ ...errors, number: undefined })
							}}
							placeholder="Enter table number"
							disabled={isLoading}
							className={`w-full h-11 px-4 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
								errors.number
									? 'border-red-500 focus:ring-red-500/20'
									: 'border-border focus:ring-primary/20 focus:border-primary'
							}`}
							autoFocus
						/>
						{errors.number && (
							<p className="text-sm text-red-500 animate-in fade-in-0 slide-in-from-top-1 duration-200">
								{errors.number}
							</p>
						)}
					</div>

					{/* Seats */}
					<div className="space-y-2">
						<label
							htmlFor="table-seats"
							className="text-sm font-semibold text-foreground flex items-center gap-1.5"
						>
							<Users className="w-3.5 h-3.5 text-muted-foreground" />
							Number of Seats
							<span className="text-red-500">*</span>
						</label>
						<input
							id="table-seats"
							type="number"
							min="1"
							max="20"
							value={seats}
							onChange={(e) => {
								setSeats(parseInt(e.target.value) || 1)
								setErrors({ ...errors, seats: undefined })
							}}
							placeholder="Enter number of seats"
							disabled={isLoading}
							className={`w-full h-11 px-4 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
								errors.seats
									? 'border-red-500 focus:ring-red-500/20'
									: 'border-border focus:ring-primary/20 focus:border-primary'
							}`}
						/>
						{errors.seats && (
							<p className="text-sm text-red-500 animate-in fade-in-0 slide-in-from-top-1 duration-200">
								{errors.seats}
							</p>
						)}
					</div>

					{/* Quick Seat Selection */}
					<div className="space-y-2">
						<label className="text-sm font-semibold text-muted-foreground">
							Quick Select Seats
						</label>
						<div className="grid grid-cols-5 gap-2">
							{[2, 4, 6, 8, 10].map((seatCount) => (
								<button
									key={seatCount}
									type="button"
									onClick={() => {
										setSeats(seatCount)
										setErrors({ ...errors, seats: undefined })
									}}
									disabled={isLoading}
									className={`h-10 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
										seats === seatCount
											? 'bg-primary text-white shadow-md scale-105'
											: 'bg-accent hover:bg-accent/80 text-foreground'
									}`}
								>
									{seatCount}
								</button>
							))}
						</div>
						<p className="text-xs text-muted-foreground">
							Maximum 20 seats per table
						</p>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-3">
						<button
							type="button"
							onClick={handleClose}
							disabled={isLoading}
							className="flex-1 h-11 bg-accent hover:bg-accent/80 text-foreground rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="flex-1 h-11 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									<span>{mode === 'create' ? 'Creating...' : 'Saving...'}</span>
								</>
							) : (
								<span>
									{mode === 'create' ? 'Create Table' : 'Save Changes'}
								</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

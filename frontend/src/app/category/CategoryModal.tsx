'use client'

import { ChevronDown, ChevronUp, Loader2, X } from 'lucide-react'
import { memo, useEffect, useState } from 'react'

const ALL_EMOJI_OPTIONS = [
	'🍎',
	'🍏',
	'🍊',
	'🍋',
	'🍌',
	'🍉',
	'🍇',
	'🍓',
	'🫐',
	'🍈',
	'🍒',
	'🍑',
	'🥭',
	'🍍',
	'🥥',
	'🥝',
	'🍅',
	'🍆',
	'🥑',
	'🥦',
	'🥬',
	'🥒',
	'🌶️',
	'🫑',
	'🌽',
	'🥕',
	'🫒',
	'🧄',
	'🧅',
	'🥔',
	'🍠',
	'🫘',
	'🥐',
	'🥖',
	'🫓',
	'🥨',
	'🥯',
	'🥞',
	'🧇',
	'🧀',
	'🍖',
	'🍗',
	'🥩',
	'🥓',
	'🍔',
	'🍟',
	'🍕',
	'🌭',
	'🥪',
	'🌮',
	'🌯',
	'🫔',
	'🥙',
	'🧆',
	'🥚',
	'🍳',
	'🥘',
	'🍲',
	'🫕',
	'🥣',
	'🥗',
	'🍿',
	'🧈',
	'🧂',
	'🍱',
	'🍘',
	'🍙',
	'🍚',
	'🍛',
	'🍜',
	'🍝',
	'🍠',
	'🍢',
	'🍣',
	'🍤',
	'🍥',
	'🥮',
	'🍡',
	'🥟',
	'🥠',
	'🥡',
	'🦀',
	'🦞',
	'🦐',
	'🦑',
	'🦪',
	'🍦',
	'🍧',
	'🍨',
	'🍩',
	'🍪',
	'🎂',
	'🍰',
	'🧁',
	'🥧',
	'🍫',
	'🍬',
	'🍭',
	'🍮',
	'🍯',
	'🍼',
	'🥛',
	'☕',
	'🫖',
	'🍵',
	'🍶',
	'🍾',
	'🍷',
	'🍸',
	'🍹',
	'🍺',
	'🍻',
	'🥂',
	'🥃',
	'🫗',
	'🥤',
	'🧋',
	'🧃',
	'🧉',
	'🧊',
	'🍴',
	'🥄',
	'🔪',
	'🫙',
	'🏺',
	'🍽️',
	'🥢',
	'🥡',
] as const

const INITIAL_DISPLAY_COUNT = 32

interface CategoryModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (name: string, icon: string) => void
	mode: 'create' | 'edit'
	initialName?: string
	initialIcon?: string
	isLoading?: boolean
}

const CategoryModalComponent = ({
	isOpen,
	onClose,
	onSubmit,
	mode,
	initialName = '',
	initialIcon = '🍴',
	isLoading = false,
}: CategoryModalProps) => {
	const [name, setName] = useState(initialName)
	const [selectedIcon, setSelectedIcon] = useState(initialIcon)
	const [error, setError] = useState('')
	const [showAllEmojis, setShowAllEmojis] = useState(false)

	const displayedEmojis = showAllEmojis
		? ALL_EMOJI_OPTIONS
		: ALL_EMOJI_OPTIONS.slice(0, INITIAL_DISPLAY_COUNT)

	useEffect(() => {
		if (isOpen) {
			setName(initialName)
			setSelectedIcon(initialIcon || '🍴')
			setError('')
			setShowAllEmojis(false)
		}
	}, [isOpen, initialName, initialIcon])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!name.trim()) {
			setError('Category name is required')
			return
		}

		if (name.trim().length < 2) {
			setError('Category name must be at least 2 characters')
			return
		}

		onSubmit(name.trim(), selectedIcon)
	}

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

			<div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl animate-in zoom-in-95 fade-in-0 slide-in-from-bottom-4 duration-300 overflow-hidden max-h-[90vh] flex flex-col">
				<div
					className="relative px-6 py-6 flex-shrink-0"
					style={{
						backgroundImage:
							'linear-gradient(to bottom right, var(--primary), var(--primary-hover))',
					}}
				>
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
							{selectedIcon}
						</div>
						<h2 className="text-2xl font-bold text-white">
							{mode === 'create' ? 'Create New Category' : 'Edit Category'}
						</h2>
					</div>

					<button
						type="button"
						onClick={handleClose}
						disabled={isLoading}
						className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						aria-label="Close modal"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
					<div className="p-8 space-y-6">
						<div className="space-y-2">
							<label
								htmlFor="category-name"
								className="text-base font-bold text-foreground"
							>
								Category Name <span className="text-red-500">*</span>
							</label>
							<input
								id="category-name"
								type="text"
								value={name}
								onChange={(e) => {
									setName(e.target.value)
									setError('')
								}}
								placeholder="e.g., Appetizers, Main Courses, Desserts..."
								disabled={isLoading}
								className={`w-full h-14 px-5 bg-background border-2 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
									error
										? 'border-red-500 focus:border-red-500'
										: 'border-primary/60 focus:border-primary'
								}`}
								autoFocus
							/>
							{error && (
								<p className="text-sm text-red-400 animate-in fade-in-0 slide-in-from-top-1 duration-200">
									{error}
								</p>
							)}
						</div>

						<div className="space-y-3">
							<label className="text-base font-bold text-foreground">
								Choose Icon
							</label>
							<div className="space-y-4">
								<div className="grid grid-cols-8 gap-2">
									{displayedEmojis.map((emoji) => (
										<button
											key={emoji}
											type="button"
											onClick={() => setSelectedIcon(emoji)}
											disabled={isLoading}
											className={`w-full aspect-square rounded-xl text-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
												selectedIcon === emoji
													? 'bg-primary scale-110 shadow-lg shadow-primary/30'
													: 'bg-muted hover:bg-muted-hover hover:scale-105'
											}`}
										>
											{emoji}
										</button>
									))}
								</div>

								{ALL_EMOJI_OPTIONS.length > INITIAL_DISPLAY_COUNT && (
									<button
										type="button"
										onClick={() => setShowAllEmojis(!showAllEmojis)}
										disabled={isLoading}
										className="w-full h-12 bg-muted hover:bg-muted-hover border border-border rounded-xl text-foreground font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										{showAllEmojis ? (
											<>
												<ChevronUp className="w-5 h-5" />
												<span>Show Less</span>
											</>
										) : (
											<>
												<ChevronDown className="w-5 h-5" />
												<span>
													Show More (
													{ALL_EMOJI_OPTIONS.length - INITIAL_DISPLAY_COUNT}{' '}
													more icons)
												</span>
											</>
										)}
									</button>
								)}
							</div>
						</div>

						<div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
							<div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
								<svg
									className="w-3 h-3 text-primary"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-semibold text-foreground">
									Categories help organize your menu
								</p>
								<p className="text-sm text-muted-foreground">
									You can assign dishes to categories later from the dishes
									page.
								</p>
							</div>
						</div>
					</div>
				</form>

				<div className="flex-shrink-0 p-8 pt-0">
					<div className="flex gap-4">
						<button
							type="button"
							onClick={handleClose}
							disabled={isLoading}
							className="flex-1 h-14 bg-transparent border-2 border-border hover:bg-muted text-foreground rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							type="submit"
							onClick={handleSubmit}
							disabled={isLoading}
							className="flex-1 h-14 bg-primary hover:bg-primary-hover text-white rounded-2xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									<span>{mode === 'create' ? 'Creating...' : 'Saving...'}</span>
								</>
							) : (
								<span>
									{mode === 'create' ? 'Create Category' : 'Save Changes'}
								</span>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export const CategoryModal = memo(CategoryModalComponent)

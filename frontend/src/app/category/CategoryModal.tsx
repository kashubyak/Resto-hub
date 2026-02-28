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

const INITIAL_DISPLAY_COUNT = 40

interface CategoryModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (name: string, icon: string) => void
	mode: 'create' | 'edit'
	initialName?: string
	initialEmoji?: string
	isLoading?: boolean
}

const CategoryModalComponent = ({
	isOpen,
	onClose,
	onSubmit,
	mode,
	initialName = '',
	initialEmoji = '🍴',
	isLoading = false,
}: CategoryModalProps) => {
	const [name, setName] = useState(initialName)
	const [selectedEmoji, setSelectedEmoji] = useState(initialEmoji)
	const [error, setError] = useState('')
	const [showAllEmojis, setShowAllEmojis] = useState(false)

	const displayedEmojis = showAllEmojis
		? ALL_EMOJI_OPTIONS
		: ALL_EMOJI_OPTIONS.slice(0, INITIAL_DISPLAY_COUNT)

	useEffect(() => {
		if (isOpen) {
			setName(initialName)
			setSelectedEmoji(initialEmoji || '🍴')
			setError('')
			setShowAllEmojis(false)
		}
	}, [isOpen, initialName, initialEmoji])

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

		onSubmit(name.trim(), selectedEmoji)
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
			<div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in-0 slide-in-from-bottom-4 duration-300 max-h-[85vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
							{selectedEmoji}
						</div>
						<h2 className="text-xl font-bold text-foreground">
							{mode === 'create' ? 'Create New Category' : 'Edit Category'}
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
				<form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
					<div className="p-6 space-y-5">
						{/* Category Name */}
						<div className="space-y-2">
							<label
								htmlFor="category-name"
								className="text-sm font-semibold text-foreground"
							>
								Category Name
								<span className="text-red-500 ml-1">*</span>
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
								className={`w-full h-11 px-4 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
									error
										? 'border-red-500 focus:ring-red-500/20'
										: 'border-border focus:ring-primary/20 focus:border-primary'
								}`}
								autoFocus
							/>
							{error && (
								<p className="text-sm text-red-500 animate-in fade-in-0 slide-in-from-top-1 duration-200">
									{error}
								</p>
							)}
						</div>

						{/* Emoji Picker */}
						<div className="space-y-3">
							<label className="text-sm font-semibold text-foreground">
								Choose Icon
							</label>
							<div className="space-y-3">
								<div className="grid grid-cols-8 gap-2">
									{displayedEmojis.map((emoji) => (
										<button
											key={emoji}
											type="button"
											onClick={() => setSelectedEmoji(emoji)}
											disabled={isLoading}
											className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
												selectedEmoji === emoji
													? 'bg-primary scale-105 shadow-md'
													: 'bg-accent hover:bg-accent/80 hover:scale-105'
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
										className="w-full h-10 bg-accent hover:bg-accent/80 border border-border rounded-lg text-foreground text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										{showAllEmojis ? (
											<>
												<ChevronUp className="w-4 h-4" />
												<span>Show Less</span>
											</>
										) : (
											<>
												<ChevronDown className="w-4 h-4" />
												<span>
													Show More (
													{ALL_EMOJI_OPTIONS.length - INITIAL_DISPLAY_COUNT}{' '}
													more)
												</span>
											</>
										)}
									</button>
								)}
							</div>
						</div>
					</div>
				</form>

				{/* Footer Actions */}
				<div className="flex-shrink-0 px-6 py-5 border-t border-border">
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
							type="submit"
							onClick={handleSubmit}
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

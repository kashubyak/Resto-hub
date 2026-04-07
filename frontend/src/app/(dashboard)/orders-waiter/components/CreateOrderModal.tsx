'use client'

import { createOrderService } from '@/services/order/create-order.service'
import { getAllDishes } from '@/services/dish/get-dishes.service'
import { getTablesService } from '@/services/table/get-tables.service'
import type { IDish } from '@/types/dish.interface'
import type { ITable } from '@/types/table.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useAlert } from '@/providers/AlertContext'
import {
	CheckCircle2,
	Loader2,
	Minus,
	Plus,
	Search,
	ShoppingCart,
	Trash2,
	X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

interface ICreateOrderModalProps {
	onClose: () => void
	onSuccess: (orderId?: number) => void
}

interface IOrderLine {
	dishId: number
	dish: IDish
	quantity: number
	notes: string
}

async function loadAllAvailableDishes(): Promise<IDish[]> {
	const collected: IDish[] = []
	let page = 1
	const limit = 100
	while (true) {
		const res = await getAllDishes({ page, limit, available: true })
		const pageData = res.data?.data ?? []
		collected.push(...pageData)
		if (pageData.length < limit) break
		page += 1
	}
	return collected
}

export function CreateOrderModal({
	onClose,
	onSuccess,
}: ICreateOrderModalProps) {
	const { showError } = useAlert()
	const [dishes, setDishes] = useState<IDish[]>([])
	const [tables, setTables] = useState<ITable[]>([])
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)

	const [selectedTable, setSelectedTable] = useState<number | null>(null)
	const [orderItems, setOrderItems] = useState<IOrderLine[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('All')

	const loadData = useCallback(async () => {
		try {
			setLoading(true)
			const [dishesData, tablesRes] = await Promise.all([
				loadAllAvailableDishes(),
				getTablesService(),
			])
			setDishes(dishesData)
			setTables((tablesRes.data ?? []).filter((t) => t.active))
		} catch (err) {
			showError(parseBackendError(err as unknown as IAxiosError).join('\n'))
		} finally {
			setLoading(false)
		}
	}, [showError])

	useEffect(() => {
		void loadData()
	}, [loadData])

	const categories = useMemo(() => {
		const names = new Set<string>()
		for (const d of dishes) {
			names.add(d.category?.name ?? 'Uncategorized')
		}
		return ['All', ...Array.from(names).sort()]
	}, [dishes])

	const filteredDishes = useMemo(() => {
		const q = searchQuery.trim().toLowerCase()
		return dishes.filter((dish) => {
			const cat = dish.category?.name ?? 'Uncategorized'
			const matchesSearch =
				!q ||
				dish.name.toLowerCase().includes(q) ||
				dish.description?.toLowerCase().includes(q)
			const matchesCategory =
				selectedCategory === 'All' || cat === selectedCategory
			return matchesSearch && matchesCategory
		})
	}, [dishes, searchQuery, selectedCategory])

	const addDish = (dish: IDish) => {
		setOrderItems((prev) => {
			const existing = prev.find((item) => item.dishId === dish.id)
			if (existing)
				return prev.map((item) =>
					item.dishId === dish.id
						? { ...item, quantity: item.quantity + 1 }
						: item,
				)
			return [...prev, { dishId: dish.id, dish, quantity: 1, notes: '' }]
		})
	}

	const updateQuantity = (dishId: number, delta: number) => {
		setOrderItems((prev) =>
			prev
				.map((item) =>
					item.dishId === dishId
						? { ...item, quantity: item.quantity + delta }
						: item,
				)
				.filter((item) => item.quantity > 0),
		)
	}

	const updateNotes = (dishId: number, notes: string) => {
		setOrderItems((prev) =>
			prev.map((item) => (item.dishId === dishId ? { ...item, notes } : item)),
		)
	}

	const removeItem = (dishId: number) => {
		setOrderItems((prev) => prev.filter((item) => item.dishId !== dishId))
	}

	const handleSubmit = async () => {
		if (!selectedTable || orderItems.length === 0) return

		try {
			setSubmitting(true)
			const res = await createOrderService({
				tableId: selectedTable,
				items: orderItems.map((item) => ({
					dishId: item.dishId,
					quantity: item.quantity,
					notes: item.notes.trim() || undefined,
				})),
			})
			onSuccess(res.data.id)
		} catch (err) {
			showError(parseBackendError(err as unknown as IAxiosError).join('\n'))
		} finally {
			setSubmitting(false)
		}
	}

	const totalPrice = orderItems.reduce(
		(sum, item) => sum + item.dish.price * item.quantity,
		0,
	)

	const canSubmit = Boolean(
		selectedTable && orderItems.length > 0 && !submitting,
	)

	const selectedTableNumber = tables.find((t) => t.id === selectedTable)?.number

	const modal = (
		<div
			className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-labelledby="create-order-modal-title"
		>
			<div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
				<div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border shrink-0">
					<div>
						<h2
							id="create-order-modal-title"
							className="text-foreground font-semibold"
						>
							Create New Order
						</h2>
						<p className="text-sm text-muted-foreground">
							Select table and add items
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-input transition-colors"
					>
						<X className="w-5 h-5 text-muted-foreground" />
					</button>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-12">
						<div className="flex flex-col items-center gap-3">
							<Loader2 className="w-8 h-8 text-primary animate-spin" />
							<p className="text-sm text-muted-foreground">Loading menu...</p>
						</div>
					</div>
				) : (
					<div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">
						<div className="flex-1 flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r border-border min-h-0">
							<div className="px-4 sm:px-6 py-4 border-b border-border shrink-0">
								<div className="flex items-center justify-between mb-2">
									<label className="text-sm text-foreground">
										Select Table *
									</label>
									{selectedTableNumber != null && (
										<span className="text-xs text-muted-foreground">
											Table {selectedTableNumber} selected
										</span>
									)}
								</div>
								<div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2 max-h-32 overflow-y-auto">
									{tables.slice(0, 40).map((table) => (
										<button
											key={table.id}
											type="button"
											onClick={() => setSelectedTable(table.id)}
											className={`h-10 rounded-lg text-sm font-medium transition-all ${
												selectedTable === table.id
													? 'bg-gradient-primary text-primary-foreground shadow-md'
													: 'bg-input text-foreground hover:bg-input/80'
											}`}
										>
											{table.number}
										</button>
									))}
								</div>
							</div>

							<div className="px-4 sm:px-6 py-3 space-y-3 border-b border-border shrink-0">
								<div className="flex items-center gap-2 bg-input rounded-xl px-3 py-2 border border-border focus-within:border-primary/50 focus-within:bg-background transition-all">
									<Search className="w-4 h-4 text-muted-foreground shrink-0" />
									<input
										type="text"
										placeholder="Search dishes..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
									/>
								</div>

								<div className="flex gap-2 overflow-x-auto pb-1 -mx-4 sm:-mx-6 px-4 sm:px-6 scrollbar-hide">
									{categories.map((category) => (
										<button
											key={category}
											type="button"
											onClick={() => setSelectedCategory(category)}
											className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
												selectedCategory === category
													? 'bg-primary text-primary-foreground'
													: 'bg-input text-muted-foreground hover:text-foreground hover:bg-input/80'
											}`}
										>
											{category}
										</button>
									))}
								</div>
							</div>

							<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-0">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{filteredDishes.map((dish) => {
										const inCart = orderItems.find(
											(item) => item.dishId === dish.id,
										)

										return (
											<button
												key={dish.id}
												type="button"
												onClick={() => addDish(dish)}
												className="group flex items-start gap-3 p-3 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-md transition-all text-left relative"
											>
												<div className="flex-1 min-w-0">
													<h4 className="text-sm font-medium text-foreground mb-1 truncate">
														{dish.name}
													</h4>
													{dish.description && (
														<p className="text-xs text-muted-foreground line-clamp-2 mb-2">
															{dish.description}
														</p>
													)}
													<span className="text-sm font-semibold text-primary">
														${dish.price.toFixed(2)}
													</span>
												</div>
												{inCart && (
													<div className="shrink-0 w-6 h-6 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
														{inCart.quantity}
													</div>
												)}
											</button>
										)
									})}
								</div>
							</div>
						</div>

						<div className="w-full lg:w-96 flex flex-col bg-muted/30 min-h-0 max-h-[50vh] lg:max-h-none">
							<div className="px-4 sm:px-6 py-4 border-b border-border shrink-0">
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-2">
										<ShoppingCart className="w-5 h-5 text-primary" />
										<h3 className="text-foreground font-semibold">
											Order Items
										</h3>
										{orderItems.length > 0 && (
											<span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold">
												{orderItems.length}
											</span>
										)}
									</div>
									{orderItems.length > 0 && (
										<button
											type="button"
											onClick={() => setOrderItems([])}
											className="text-xs text-destructive hover:text-destructive-hover font-medium transition-colors"
										>
											Clear all
										</button>
									)}
								</div>
							</div>

							<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-0">
								{orderItems.length === 0 ? (
									<div className="flex flex-col items-center justify-center h-full text-center py-8">
										<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
											<ShoppingCart className="w-6 h-6 text-primary" />
										</div>
										<p className="text-sm text-muted-foreground">
											No items added yet
											<br />
											Select dishes from the menu
										</p>
									</div>
								) : (
									<div className="space-y-3">
										{orderItems.map((item) => (
											<div
												key={item.dishId}
												className="bg-card border border-border rounded-xl p-3 space-y-2"
											>
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1 min-w-0">
														<h4 className="text-sm font-medium text-foreground truncate">
															{item.dish.name}
														</h4>
														<p className="text-xs text-muted-foreground">
															${item.dish.price.toFixed(2)} each
														</p>
													</div>
													<button
														type="button"
														onClick={() => removeItem(item.dishId)}
														className="shrink-0 w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors"
													>
														<Trash2 className="w-3.5 h-3.5 text-destructive" />
													</button>
												</div>

												<div className="flex items-center gap-2">
													<button
														type="button"
														onClick={() => updateQuantity(item.dishId, -1)}
														className="w-8 h-8 rounded-lg bg-input hover:bg-input/80 flex items-center justify-center transition-colors"
													>
														<Minus className="w-4 h-4 text-foreground" />
													</button>
													<div className="flex-1 text-center">
														<span className="text-sm font-semibold text-foreground">
															{item.quantity}
														</span>
													</div>
													<button
														type="button"
														onClick={() => updateQuantity(item.dishId, 1)}
														className="w-8 h-8 rounded-lg bg-input hover:bg-input/80 flex items-center justify-center transition-colors"
													>
														<Plus className="w-4 h-4 text-foreground" />
													</button>
													<div className="flex-1 text-right">
														<span className="text-sm font-semibold text-primary">
															${(item.dish.price * item.quantity).toFixed(2)}
														</span>
													</div>
												</div>

												<div className="space-y-1.5">
													<label className="text-xs font-medium text-muted-foreground">
														Special Instructions (optional)
													</label>
													<textarea
														placeholder="E.g., no onions, extra sauce, well-done, allergies..."
														value={item.notes}
														onChange={(e) =>
															updateNotes(item.dishId, e.target.value)
														}
														rows={2}
														className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-all resize-none"
													/>
													<div className="flex flex-wrap gap-1">
														{[
															'No onions',
															'Extra sauce',
															'Well done',
															'No salt',
															'Spicy',
														].map((quickNote) => (
															<button
																key={quickNote}
																type="button"
																onClick={() => {
																	const current = item.notes
																	const newNote = current
																		? `${current}, ${quickNote}`
																		: quickNote
																	updateNotes(item.dishId, newNote)
																}}
																className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
															>
																+ {quickNote}
															</button>
														))}
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="px-4 sm:px-6 py-4 border-t border-border space-y-3 shrink-0">
								<div className="flex items-center justify-between">
									<div>
										<span className="text-foreground font-semibold">Total</span>
										<span className="text-xs text-muted-foreground ml-2">
											(
											{orderItems.reduce((sum, item) => sum + item.quantity, 0)}{' '}
											items)
										</span>
									</div>
									<span className="text-2xl font-bold text-primary">
										${totalPrice.toFixed(2)}
									</span>
								</div>

								<button
									type="button"
									onClick={() => void handleSubmit()}
									disabled={!canSubmit}
									className="w-full flex items-center justify-center gap-2 px-4 h-12 rounded-xl bg-gradient-primary text-primary-foreground transition-opacity hover:opacity-90 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
								>
									{submitting ? (
										<>
											<Loader2 className="w-5 h-5 animate-spin" />
											<span className="font-semibold">Creating Order...</span>
										</>
									) : (
										<>
											<CheckCircle2 className="w-5 h-5" />
											<span className="font-semibold">
												Create Order
												{selectedTableNumber != null &&
													` for Table ${selectedTableNumber}`}
											</span>
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)

	if (typeof document === 'undefined') return null

	return createPortal(modal, document.body)
}

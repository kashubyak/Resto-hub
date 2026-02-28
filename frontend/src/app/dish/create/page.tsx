'use client'

import { CategorySelect } from '@/app/dish/components/create/CategorySelect'
import { ROUTES } from '@/constants/pages.constant'
import { useDishModal } from '@/hooks/useDishModal'
import type { IDishFormValues } from '@/types/dish.interface'
import {
	caloriesValidation,
	dishNameValidation,
	imageValidation,
	priceValidation,
	VALID_NUMBER_PATTERN,
	weightValidation,
} from '@/validation/dish.validation'
import {
	AlertCircle,
	ArrowLeft,
	Check,
	ChefHat,
	DollarSign,
	Flame,
	GripVertical,
	Image as ImageIcon,
	Info,
	Plus,
	Scale,
	Tag,
	Upload,
	X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'

const maxDescriptionLength = 1500

const descriptionValidation = {
	required: 'Dish description is required',
	validate: {
		minLength: (v: string) =>
			v.trim().length >= 5 || 'Description must be at least 5 characters',
		maxLength: (v: string) =>
			v.trim().length <= maxDescriptionLength ||
			`Description can be at most ${maxDescriptionLength} characters`,
		noOnlySpaces: (v: string) =>
			v.trim().length > 0 || 'Description cannot be only spaces',
	},
}

function CreateDishForm() {
	const router = useRouter()
	const onClose = useCallback(
		() => router.push(ROUTES.PRIVATE.ADMIN.DISH),
		[router],
	)
	const {
		onSubmit: onSubmitFromHook,
		register,
		errors,
		handleSubmit,
		control,
		setValue,
		setError,
		clearErrors,
		watch,
	} = useDishModal(onClose)

	const onSubmit = useCallback(
		(data: IDishFormValues) => {
			if (!data.ingredients?.length) {
				setError('ingredients', {
					type: 'required',
					message: 'At least one ingredient is required',
				})
				return
			}
			void onSubmitFromHook(data)
		},
		[onSubmitFromHook, setError],
	)

	const [focusedField, setFocusedField] = useState<string | null>(null)
	const [newIngredient, setNewIngredient] = useState('')
	const [draggedItem, setDraggedItem] = useState<number | null>(null)
	const [isDraggingOver, setIsDraggingOver] = useState(false)
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const imageUrlRegister = register('imageUrl', imageValidation)

	const watched = {
		name: watch('name') ?? '',
		description: watch('description') ?? '',
		price: watch('price'),
		categoryId: watch('categoryId'),
		ingredients: watch('ingredients') ?? [],
		imageUrl: watch('imageUrl'),
		available: watch('available'),
	}

	const formCompletion = useMemo(() => {
		let completed = 0
		const total = 6
		if (watched.name?.trim()) completed++
		if (
			watched.price !== undefined &&
			watched.price !== '' &&
			Number(watched.price) > 0
		)
			completed++
		if (watched.categoryId != null) completed++
		if (watched.description?.trim()) completed++
		if (Array.isArray(watched.ingredients) && watched.ingredients.length > 0)
			completed++
		if (watched.imageUrl?.[0]) completed++
		return Math.round((completed / total) * 100)
	}, [
		watched.name,
		watched.price,
		watched.categoryId,
		watched.description,
		watched.ingredients,
		watched.imageUrl,
	])

	const getDescriptionColor = useCallback(() => {
		const len = (watched.description ?? '').length
		const percentage = (len / maxDescriptionLength) * 100
		if (percentage < 50) return 'text-muted-foreground'
		if (percentage < 80) return 'text-primary'
		if (percentage < 95) return 'text-amber-500'
		return 'text-red-500'
	}, [watched.description])

	const previewUrl = useMemo(() => {
		const file = watched.imageUrl?.[0]
		if (!file) return null
		return URL.createObjectURL(file)
	}, [watched.imageUrl])
	useEffect(
		() => () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl)
		},
		[previewUrl],
	)

	const handleAddIngredient = useCallback(() => {
		const val = newIngredient.trim()
		if (!val) {
			setError('ingredients', {
				type: 'required',
				message: 'Ingredient is required',
			})
			return
		}
		const current = watch('ingredients') ?? []
		if (current.includes(val)) {
			setError('ingredients', {
				type: 'duplicate',
				message: 'Duplicate ingredients are not allowed',
			})
			return
		}
		if (!/^[\p{L}\p{N}\s\-&,.'()]{2,50}$/u.test(val)) {
			setError('ingredients', {
				type: 'pattern',
				message: 'Invalid ingredient format (2–50 chars)',
			})
			return
		}
		setValue('ingredients', [...current, val])
		setNewIngredient('')
		clearErrors('ingredients')
	}, [newIngredient, setValue, setError, clearErrors, watch])

	const handleRemoveIngredient = useCallback(
		(index: number) => {
			const current = watch('ingredients') ?? []
			const next = current.filter((_, i) => i !== index)
			setValue('ingredients', next)
			if (next.length === 0)
				setError('ingredients', {
					type: 'required',
					message: 'At least one ingredient is required',
				})
			else clearErrors('ingredients')
		},
		[setValue, setError, clearErrors, watch],
	)

	const handleDragStart = useCallback(
		(index: number) => setDraggedItem(index),
		[],
	)
	const handleDragEnd = useCallback(() => setDraggedItem(null), [])
	const handleDragOver = useCallback(
		(e: React.DragEvent, index: number) => {
			e.preventDefault()
			if (draggedItem === null || draggedItem === index) return
			const current = watch('ingredients') ?? []
			const next = [...current]
			const [removed] = next.splice(draggedItem, 1)
			if (removed) next.splice(index, 0, removed)
			setValue('ingredients', next)
			setDraggedItem(index)
		},
		[draggedItem, watch, setValue],
	)

	const handlePriceChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let value = e.target.value
			if (value === '') {
				setValue('price', '')
				return
			}
			value = value.replace(',', '.')
			if (VALID_NUMBER_PATTERN.test(value)) setValue('price', value)
		},
		[setValue],
	)

	const ingredients = watched.ingredients ?? []

	return (
		<>
			<div className="fixed right-0 top-0 h-screen w-1.5 bg-border/30 z-40 hidden sm:block">
				<div
					className="transition-all duration-500 ease-out w-full"
					style={{
						height: `${formCompletion}%`,
						backgroundImage:
							'linear-gradient(to bottom, var(--primary), rgba(0, 0, 0, 0))',
					}}
				/>
				<div
					className="absolute right-3 transition-all duration-500 ease-out"
					style={{ top: `${Math.max(10, formCompletion)}%` }}
				>
					<div className="bg-card border border-border rounded-lg px-2 py-1 shadow-lg">
						<span className="text-xs font-bold text-primary">
							{formCompletion}%
						</span>
					</div>
				</div>
			</div>

			<div className="max-w-5xl mx-auto">
				<div className="flex items-center gap-4 mb-6">
					<Link
						href={ROUTES.PRIVATE.ADMIN.DISH}
						className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-card border border-border hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<div className="flex-1">
						<h1 className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center gap-3">
							<ChefHat className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
							Create New Dish
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground mt-1">
							Add a new item to your restaurant menu
						</p>
					</div>
				</div>

				<form
					onSubmit={(e) => {
						void handleSubmit(onSubmit)(e)
					}}
					className="space-y-6"
				>
					{/* Basic Information */}
					<div className="bg-card rounded-2xl p-6 sm:p-8 border border-border space-y-6 hover:border-primary/30 transition-all duration-300">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-primary-soft flex items-center justify-center">
								<Tag className="w-5 h-5 text-primary" />
							</div>
							<h2 className="text-xl font-semibold text-foreground">
								Basic Information
							</h2>
						</div>

						<div className="space-y-5">
							<div className="relative">
								<input
									type="text"
									id="dishName"
									{...register('name', dishNameValidation)}
									onFocus={() => setFocusedField('dishName')}
									onBlur={() => setFocusedField(null)}
									placeholder=" "
									className="peer w-full h-14 px-4 pt-5 pb-1 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
								/>
								<label
									htmlFor="dishName"
									className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs"
								>
									Dish Name <span className="text-red-500">*</span>
								</label>
								{focusedField === 'dishName' && (
									<div className="absolute right-3 top-1/2 -translate-y-1/2">
										<div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
									</div>
								)}
								{errors.name?.message && (
									<p className="text-sm text-red-500 mt-1">
										{errors.name.message}
									</p>
								)}
							</div>

							<div className="relative">
								<div className="relative">
									<textarea
										id="description"
										{...register('description', descriptionValidation)}
										onFocus={() => setFocusedField('description')}
										onBlur={() => setFocusedField(null)}
										placeholder="Describe your dish, its unique features, and what makes it special..."
										maxLength={maxDescriptionLength}
										rows={5}
										className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
									/>
									{focusedField === 'description' && (
										<div className="absolute right-3 top-3">
											<div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
										</div>
									)}
								</div>
								<div className="flex justify-between items-center mt-2">
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<Info className="w-3 h-3" />
										<span>Optional but recommended</span>
									</div>
									<span
										className={`text-xs font-medium ${getDescriptionColor()} transition-colors`}
									>
										{watched.description.length} / {maxDescriptionLength}
									</span>
								</div>
								{errors.description?.message && (
									<p className="text-sm text-red-500 mt-1">
										{errors.description.message}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Pricing & Category */}
					<div className="bg-card rounded-2xl p-6 sm:p-8 border border-border space-y-6 hover:border-primary/30 transition-all duration-300">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-primary-soft flex items-center justify-center">
								<DollarSign className="w-5 h-5 text-primary" />
							</div>
							<h2 className="text-xl font-semibold text-foreground">
								Pricing & Category
							</h2>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<div className="space-y-2">
								<label
									htmlFor="price"
									className="block text-sm font-medium text-foreground"
								>
									Price <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
										<DollarSign className="w-5 h-5" />
									</div>
									<Controller
										name="price"
										control={control}
										rules={priceValidation}
										render={({ field }) => (
											<input
												type="text"
												id="price"
												value={
													typeof field.value === 'number'
														? String(field.value)
														: (field.value ?? '')
												}
												onChange={handlePriceChange}
												onFocus={() => setFocusedField('price')}
												onBlur={() => setFocusedField(null)}
												placeholder="0.00"
												className="w-full h-14 pl-12 pr-4 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
											/>
										)}
									/>
								</div>
								{errors.price?.message && (
									<p className="text-sm text-red-500">{errors.price.message}</p>
								)}
							</div>

							<Controller
								name="categoryId"
								control={control}
								render={({ field }) => (
									<CategorySelect
										value={field.value ?? null}
										onChange={field.onChange}
										error={errors.categoryId?.message}
									/>
								)}
							/>
						</div>
					</div>

					{/* Dish Availability */}
					<div className="bg-card rounded-2xl p-6 sm:p-8 border border-border space-y-6 hover:border-primary/30 transition-all duration-300">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-primary-soft flex items-center justify-center">
								<ChefHat className="w-5 h-5 text-primary" />
							</div>
							<h2 className="text-xl font-semibold text-foreground">
								Dish Availability
							</h2>
						</div>

						<div className="flex gap-4">
							<Controller
								name="available"
								control={control}
								render={({ field }) => (
									<>
										<label className="relative flex-1 cursor-pointer group">
											<input
												type="radio"
												name="availability"
												checked={field.value === true}
												onChange={() => field.onChange(true)}
												className="sr-only peer"
											/>
											<div className="h-14 flex items-center gap-3 px-4 rounded-xl border-2 border-border bg-background peer-checked:border-green-500 peer-checked:bg-green-500/5 transition-all duration-200 group-hover:border-green-500/50">
												<div className="w-5 h-5 rounded-full border-2 border-border peer-checked:border-green-500 peer-checked:bg-green-500 flex items-center justify-center transition-all duration-200">
													{field.value === true && (
														<div className="w-2.5 h-2.5 rounded-full bg-white" />
													)}
												</div>
												<span className="text-sm font-medium text-foreground">
													Available
												</span>
											</div>
										</label>
										<label className="relative flex-1 cursor-pointer group">
											<input
												type="radio"
												name="availability"
												checked={field.value === false}
												onChange={() => field.onChange(false)}
												className="sr-only peer"
											/>
											<div className="h-14 flex items-center gap-3 px-4 rounded-xl border-2 border-border bg-background peer-checked:border-red-500 peer-checked:bg-red-500/5 transition-all duration-200 group-hover:border-red-500/50">
												<div className="w-5 h-5 rounded-full border-2 border-border peer-checked:border-red-500 peer-checked:bg-red-500 flex items-center justify-center transition-all duration-200">
													{field.value === false && (
														<div className="w-2.5 h-2.5 rounded-full bg-white" />
													)}
												</div>
												<span className="text-sm font-medium text-foreground">
													Not Available
												</span>
											</div>
										</label>
									</>
								)}
							/>
						</div>
					</div>

					{/* Ingredients */}
					<div className="bg-card rounded-2xl p-6 sm:p-8 border border-border space-y-6 hover:border-primary/30 transition-all duration-300">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-primary-soft flex items-center justify-center">
								<span className="text-lg">🥕</span>
							</div>
							<div className="flex-1">
								<h2 className="text-xl font-semibold text-foreground">
									Ingredients
								</h2>
								<p className="text-xs text-muted-foreground mt-0.5">
									{ingredients.length} ingredient
									{ingredients.length !== 1 ? 's' : ''} added
								</p>
							</div>
						</div>

						<div className="flex gap-3">
							<div className="relative flex-1">
								<input
									type="text"
									value={newIngredient}
									onChange={(e) => setNewIngredient(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault()
											handleAddIngredient()
										}
									}}
									placeholder="Type ingredient name and press Enter"
									className="w-full h-12 px-4 pr-20 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
								/>
								{newIngredient && (
									<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
										Press ↵
									</span>
								)}
							</div>
							<button
								type="button"
								onClick={handleAddIngredient}
								disabled={!newIngredient.trim()}
								style={{
									backgroundImage:
										'linear-gradient(to bottom right, var(--primary), var(--primary-hover))',
								}}
								className="w-12 h-12 flex items-center justify-center rounded-xl text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
							>
								<Plus className="w-5 h-5" />
							</button>
						</div>

						{errors.ingredients?.message && (
							<p className="text-sm text-red-500">
								{errors.ingredients.message}
							</p>
						)}

						{ingredients.length > 0 && (
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
									<GripVertical className="w-3 h-3" />
									<span>Drag to reorder ingredients</span>
								</div>
								{ingredients.map((ingredient, index) => (
									<div
										key={`${ingredient}-${index}`}
										draggable
										onDragStart={() => handleDragStart(index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDragEnd={handleDragEnd}
										className={`group flex items-center gap-3 px-4 py-3 bg-background border-2 border-border rounded-xl cursor-move hover:border-primary hover:shadow-md transition-all duration-200 ${
											draggedItem === index ? 'opacity-50 scale-95' : ''
										}`}
									>
										<GripVertical className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
										<div className="flex-1 flex items-center gap-2">
											<span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
												{index + 1}
											</span>
											<span className="text-sm font-medium text-foreground">
												{ingredient}
											</span>
										</div>
										<button
											type="button"
											onClick={() => handleRemoveIngredient(index)}
											className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						)}

						{ingredients.length === 0 && (
							<div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
								<div className="w-16 h-16 rounded-2xl bg-gradient-primary-soft flex items-center justify-center mx-auto mb-4">
									<AlertCircle className="w-8 h-8 text-primary" />
								</div>
								<p className="text-sm font-medium text-foreground mb-1">
									No ingredients yet
								</p>
								<p className="text-xs text-muted-foreground">
									Add your first ingredient above
								</p>
							</div>
						)}
					</div>

					{/* Dish Image */}
					<div className="bg-card rounded-2xl p-6 sm:p-8 border border-border space-y-6 hover:border-primary/30 transition-all duration-300">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-primary-soft flex items-center justify-center">
								<ImageIcon className="w-5 h-5 text-primary" />
							</div>
							<h2 className="text-xl font-semibold text-foreground">
								Dish Image
							</h2>
						</div>

						{previewUrl ? (
							<div className="relative group w-full h-64">
								<Image
									src={previewUrl}
									alt="Uploaded dish"
									fill
									className="object-cover rounded-2xl"
								/>
								<div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
									>
										Change
									</button>
									<button
										type="button"
										onClick={() => {
											if (fileInputRef.current) fileInputRef.current.value = ''
											setValue(
												'imageUrl',
												new DataTransfer().files as unknown as FileList,
											)
										}}
										className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
									>
										Remove
									</button>
								</div>
							</div>
						) : (
							<div
								onDrop={(e) => {
									e.preventDefault()
									setIsDraggingOver(false)
									const file = e.dataTransfer.files?.[0]
									if (file?.type.startsWith('image/')) {
										const dt = new DataTransfer()
										dt.items.add(file)
										setValue('imageUrl', dt.files)
									}
								}}
								onDragOver={(e) => e.preventDefault()}
								onDragEnter={(e) => {
									e.preventDefault()
									setIsDraggingOver(true)
								}}
								onDragLeave={(e) => {
									e.preventDefault()
									setIsDraggingOver(false)
								}}
								onClick={() => fileInputRef.current?.click()}
								className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer group ${
									isDraggingOver
										? 'border-primary bg-primary/5 scale-105'
										: 'border-border hover:border-primary hover:bg-primary/5'
								}`}
							>
								<div className="flex flex-col items-center gap-4">
									<div className="w-16 h-16 rounded-2xl bg-gradient-primary-soft group-hover:bg-gradient-primary-soft-hover flex items-center justify-center transition-all duration-300 group-hover:scale-110">
										<Upload className="w-8 h-8 text-primary" />
									</div>
									<div>
										<p className="text-base font-medium text-foreground mb-1">
											{isDraggingOver
												? 'Drop image here'
												: 'Click or drag & drop an image'}
										</p>
										<p className="text-sm text-muted-foreground">
											PNG, JPG up to 10MB
										</p>
									</div>
								</div>
							</div>
						)}
						<input
							type="file"
							accept="image/*"
							className="hidden"
							{...imageUrlRegister}
							ref={(el) => {
								imageUrlRegister.ref(el)
								fileInputRef.current = el
							}}
						/>
						{errors.imageUrl?.message && (
							<p className="text-sm text-red-500">{errors.imageUrl.message}</p>
						)}
					</div>

					{/* Nutritional Information */}
					<div className="bg-card rounded-2xl p-6 sm:p-8 border border-border space-y-6 hover:border-primary/30 transition-all duration-300">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-primary-soft flex items-center justify-center">
								<Scale className="w-5 h-5 text-primary" />
							</div>
							<div className="flex-1">
								<h2 className="text-xl font-semibold text-foreground">
									Nutritional Information
								</h2>
								<p className="text-xs text-muted-foreground mt-0.5">
									Optional details
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<div className="relative">
								<Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
								<input
									type="number"
									id="weight"
									{...register('weightGr', weightValidation)}
									placeholder=" "
									min={0}
									className="peer w-full h-14 pl-12 pr-4 pt-5 pb-1 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
								/>
								<label
									htmlFor="weight"
									className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs"
								>
									Weight (grams)
								</label>
								{errors.weightGr?.message && (
									<p className="text-sm text-red-500 mt-1">
										{errors.weightGr.message}
									</p>
								)}
							</div>

							<div className="relative">
								<Flame className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
								<input
									type="number"
									id="calories"
									{...register('calories', caloriesValidation)}
									placeholder=" "
									min={0}
									className="peer w-full h-14 pl-12 pr-4 pt-5 pb-1 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
								/>
								<label
									htmlFor="calories"
									className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs"
								>
									Calories (kcal)
								</label>
								{errors.calories?.message && (
									<p className="text-sm text-red-500 mt-1">
										{errors.calories.message}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 pb-8">
						<Link
							href={ROUTES.PRIVATE.ADMIN.DISH}
							className="flex-1 h-14 px-6 bg-card border-2 border-border rounded-xl text-foreground font-medium hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 flex items-center justify-center"
						>
							Cancel
						</Link>
						<button
							type="submit"
							className="flex-1 h-14 px-6 bg-gradient-success text-white rounded-xl font-medium hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
						>
							<Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
							Create Dish
						</button>
					</div>
				</form>
			</div>
		</>
	)
}

export default function CreateDishPage() {
	return <CreateDishForm />
}

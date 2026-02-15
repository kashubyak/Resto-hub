'use client'

import { AlertCircle, Loader2, MapPin, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface LocationResult {
	display_name: string
	lat: string
	lon: string
	address: {
		city?: string
		town?: string
		village?: string
		country?: string
		state?: string
	}
}

interface LocationSearchProps {
	onLocationSelect: (lat: number, lng: number, address: string) => void
	selectedLocation?: string
	onClear: () => void
	error?: string
}

export function LocationSearch({
	onLocationSelect,
	selectedLocation,
	onClear,
	error,
}: LocationSearchProps) {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<LocationResult[]>([])
	const [loading, setLoading] = useState(false)
	const [showDropdown, setShowDropdown] = useState(false)
	const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const abortControllerRef = useRef<AbortController | null>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (query.length < 3) {
			setResults([])
			setShowDropdown(false)
			return
		}

		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current)
		}

		searchTimeoutRef.current = setTimeout(async () => {
			abortControllerRef.current?.abort()
			abortControllerRef.current = new AbortController()
			const signal = abortControllerRef.current.signal

			setLoading(true)
			try {
				const response = await fetch(
					`/api/geocode/search?q=${encodeURIComponent(query)}`,
					{ signal },
				)
				if (!response.ok)
					throw new Error(`Search error: ${response.status}`)

				const data = await response.json()
				setResults(Array.isArray(data) ? data : [])
				setShowDropdown(true)
			} catch (err) {
				if (err instanceof Error && err.name === 'AbortError') return
				setResults([])
			} finally {
				setLoading(false)
			}
		}, 500)

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current)
				searchTimeoutRef.current = null
			}
			abortControllerRef.current?.abort()
			abortControllerRef.current = null
		}
	}, [query])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			)
				setShowDropdown(false)
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSelectLocation = (result: LocationResult) => {
		const lat = parseFloat(result.lat)
		const lng = parseFloat(result.lon)
		onLocationSelect(lat, lng, result.display_name)
		setQuery('')
		setShowDropdown(false)
	}

	const handleClear = () => {
		setQuery('')
		setResults([])
		setShowDropdown(false)
		onClear()
	}

	const getLocationLabel = (result: LocationResult) => {
		const city =
			result.address.city ||
			result.address.town ||
			result.address.village ||
			''
		const country = result.address.country || ''
		if (city && country) {
			return { primary: city, secondary: country }
		}
		return { primary: result.display_name, secondary: '' }
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value)
	}

	return (
		<div className="space-y-2" ref={dropdownRef}>
			<label className="block text-sm font-medium text-card-foreground">
				Company location
			</label>
			<div className="relative">
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
					</div>
					<input
						type="text"
						value={query}
						onChange={handleInputChange}
						onFocus={() => setShowDropdown(true)}
						placeholder="Search for a city in Ukraine..."
						disabled={!!selectedLocation}
						className={`w-full pl-9 sm:pl-12 pr-9 sm:pr-12 py-2.5 sm:py-3 bg-input rounded-xl border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
							error
								? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
								: 'border-border focus:border-primary focus:ring-primary/20'
						}`}
					/>
					{query && !selectedLocation && (
						<button
							type="button"
							onClick={handleClear}
							className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-card-foreground transition-colors"
						>
							<X className="h-4 w-4 sm:h-5 sm:w-5" />
						</button>
					)}
				</div>

				{loading && (
					<div className="absolute right-3 top-2.5 sm:top-3">
						<Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
					</div>
				)}

				{showDropdown && results.length > 0 && !selectedLocation && (
					<div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-2xl max-h-[280px] overflow-y-auto location-dropdown-scroll">
						{results.map((result, index) => {
							const { primary, secondary } = getLocationLabel(result)
							return (
								<button
									key={index}
									type="button"
									onClick={() => handleSelectLocation(result)}
									className="w-full text-left px-3 py-2.5 hover:bg-muted-hover transition-colors border-b border-border/50 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
								>
									<div className="flex items-start gap-2">
										<MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
										<div className="flex-1 min-w-0">
											<div className="text-sm font-medium text-foreground break-words">
												{primary}
											</div>
											{secondary && (
												<div className="text-xs text-muted-foreground mt-0.5 break-words">
													{secondary}
												</div>
											)}
										</div>
									</div>
								</button>
							)
						})}
					</div>
				)}

				{selectedLocation && (
					<div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
						<div className="flex items-start gap-2 flex-1 min-w-0">
							<MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
							<div className="min-w-0 flex-1">
								<div className="text-xs text-muted-foreground mb-0.5">
									Selected:
								</div>
								<div className="text-sm text-foreground truncate">
									{selectedLocation}
								</div>
							</div>
						</div>
						<button
							type="button"
							onClick={handleClear}
							className="ml-2 text-xs text-primary hover:text-primary-hover font-medium transition-colors flex-shrink-0"
						>
							Change
						</button>
					</div>
				)}

				{!selectedLocation && !error && (
					<p className="text-xs text-muted-foreground">
						Select from the list or click on the map
					</p>
				)}

				{error && (
					<div className="flex items-center gap-1.5 text-red-500">
						<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
						<p className="text-xs">{error}</p>
					</div>
				)}
			</div>
		</div>
	)
}

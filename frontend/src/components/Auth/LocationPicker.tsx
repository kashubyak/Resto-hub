'use client'
import { API_URL } from '@/constants/api'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useCallback, useEffect, useRef, useState } from 'react'

type Coordinates = {
	lat: number
	lng: number
	address: string
}

type LocationPickerProps = {
	onSelectLocation: (location: Coordinates) => void
}

interface ISearchResult {
	placeId: string
	mainText: string
	secondaryText: string
	fullAddress: string
}

const libraries: 'geometry'[] = ['geometry']

const containerStyle = {
	width: '100%',
	height: '15rem',
}

const defaultCenter = {
	lat: 50.4501,
	lng: 30.5234,
}

export const LocationPicker = ({ onSelectLocation }: LocationPickerProps) => {
	const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
	const [searchValue, setSearchValue] = useState('')
	const [searchResults, setSearchResults] = useState<ISearchResult[]>([])
	const [showResults, setShowResults] = useState(false)
	const [isSearching, setIsSearching] = useState(false)

	const mapRef = useRef<google.maps.Map | null>(null)
	const geocoder = useRef<google.maps.Geocoder | null>(null)
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: API_URL.GOOGLE_MAPS!,
		libraries,
		language: 'en',
		region: 'UA',
	})

	useEffect(() => {
		if (!isLoaded || !window.google) return
		geocoder.current = new window.google.maps.Geocoder()
	}, [isLoaded])

	const searchPlaces = useCallback((query: string) => {
		if (!geocoder.current || !query.trim() || query.length < 2) {
			setSearchResults([])
			setShowResults(false)
			setIsSearching(false)
			return
		}
		setIsSearching(true)

		const searchPromises = [
			new Promise<google.maps.GeocoderResult[]>(resolve => {
				geocoder.current!.geocode(
					{
						address: query,
						componentRestrictions: { country: 'UA' },
						region: 'UA',
					},
					(results, status) => {
						resolve(status === 'OK' && results ? results : [])
					},
				)
			}),
			new Promise<google.maps.GeocoderResult[]>(resolve => {
				geocoder.current!.geocode(
					{
						address: query,
						region: 'UA',
					},
					(results, status) => {
						resolve(status === 'OK' && results ? results : [])
					},
				)
			}),
		]

		Promise.all(searchPromises)
			.then(resultArrays => {
				const allResults = resultArrays.flat()
				const uniqueResults = allResults.filter(
					(result, index, self) =>
						index === self.findIndex(r => r.place_id === result.place_id),
				)

				const formattedResults: ISearchResult[] = uniqueResults
					.slice(0, 8)
					.map(result => {
						const components = result.address_components
						const mainComponent = components[0]?.long_name || ''
						const secondaryComponents = components
							.slice(1)
							.map(c => c.long_name)
							.join(', ')

						return {
							placeId: result.place_id,
							mainText: mainComponent || result.formatted_address.split(',')[0],
							secondaryText:
								secondaryComponents ||
								result.formatted_address.split(',').slice(1).join(',').trim(),
							fullAddress: result.formatted_address,
						}
					})

				setSearchResults(formattedResults)
				setShowResults(formattedResults.length > 0)
			})
			.catch(error => {
				setSearchResults([])
				setShowResults(false)
			})
			.finally(() => {
				setIsSearching(false)
			})
	}, [])

	const handleSearch = useCallback(
		(value: string) => {
			setSearchValue(value)
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
			searchTimeoutRef.current = setTimeout(() => {
				searchPlaces(value)
			}, 400)
		},
		[searchPlaces],
	)

	const handleResultSelect = useCallback(
		(result: ISearchResult) => {
			if (!geocoder.current) return

			geocoder.current.geocode({ placeId: result.placeId }, (results, status) => {
				if (status === 'OK' && results?.[0]) {
					const location = results[0].geometry.location
					const lat = location.lat()
					const lng = location.lng()
					const address = result.fullAddress

					const coords = { lat, lng, address }
					setPosition({ lat, lng })
					setSearchValue(address)
					setShowResults(false)
					onSelectLocation(coords)

					if (mapRef.current) {
						mapRef.current.panTo({ lat, lng })
						const types = results[0].types
						let zoom = 12
						if (types.includes('country')) zoom = 6
						else if (types.includes('administrative_area_level_1')) zoom = 8
						else if (types.includes('locality')) zoom = 12
						else if (types.includes('establishment')) zoom = 16

						mapRef.current.setZoom(zoom)
					}
				}
			})
		},
		[onSelectLocation],
	)

	// Обробка кліку по карті
	const handleMapClick = useCallback(
		(event: google.maps.MapMouseEvent) => {
			if (!event.latLng || !geocoder.current) return

			const lat = event.latLng.lat()
			const lng = event.latLng.lng()

			setPosition({ lat, lng })

			geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
				if (status === 'OK' && results?.[0]) {
					const address = results[0].formatted_address
					setSearchValue(address)
					onSelectLocation({ lat, lng, address })
				} else {
					const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
					setSearchValue(address)
					onSelectLocation({ lat, lng, address })
				}
			})
		},
		[onSelectLocation],
	)

	const onMapLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map
	}, [])

	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
		}
	}, [])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && searchResults.length > 0) {
				e.preventDefault()
				handleResultSelect(searchResults[0])
			}
			if (e.key === 'Escape') setShowResults(false)
		},
		[searchResults, handleResultSelect],
	)

	return (
		<div className='flex flex-col gap-4'>
			<div className='relative'>
				<div className='relative'>
					<input
						type='text'
						value={searchValue}
						onChange={e => handleSearch(e.target.value)}
						onKeyDown={handleKeyDown}
						onFocus={() => {
							if (searchResults.length > 0) {
								setShowResults(true)
							}
						}}
						placeholder='Введіть назву міста будь-якою мовою (Київ, Paris, Лондон)...'
						className='w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base'
					/>

					{isSearching && (
						<div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
							<div className='animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent'></div>
						</div>
					)}

					{searchValue && !isSearching && (
						<button
							onClick={() => {
								setSearchValue('')
								setSearchResults([])
								setShowResults(false)
								setPosition(null)
							}}
							className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
						>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					)}
				</div>

				{/* Список результатів пошуку */}
				{showResults && searchResults.length > 0 && (
					<div className='absolute z-10 w-full mt-2 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-64 overflow-y-auto'>
						{searchResults.map(result => (
							<button
								key={result.placeId}
								onClick={() => handleResultSelect(result)}
								className='w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg transition-colors'
							>
								<div className='font-medium text-gray-900 mb-1'>{result.mainText}</div>
								<div className='text-sm text-gray-600'>{result.secondaryText}</div>
							</button>
						))}
					</div>
				)}

				{/* Повідомлення про відсутність результатів */}
				{showResults &&
					searchResults.length === 0 &&
					!isSearching &&
					searchValue.length > 2 && (
						<div className='absolute z-10 w-full mt-2 bg-white border border-neutral-300 rounded-lg shadow-lg p-4 text-center text-gray-500'>
							<div className='mb-2'>🔍</div>
							<div>Нічого не знайдено для `${searchValue}`</div>
							<div className='text-xs mt-1'>
								Спробуйте інший запит або скористайтесь картою нижче
							</div>
						</div>
					)}
			</div>

			<div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
				<div className='text-sm text-blue-700'>
					<div className='font-medium mb-1'>💡 Як користуватися:</div>
					<div className='space-y-1'>
						<div>• Введіть назву міста будь-якою мовою: Київ, Kiev, Paris, Москва</div>
						<div>• Натисніть Enter для вибору першого результату</div>
						<div>• Клікніть по карті, щоб встановити мітку в конкретному місці</div>
					</div>
				</div>
			</div>

			<div className='rounded-lg overflow-hidden border border-neutral-300 shadow-sm'>
				{isLoaded && (
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={position || defaultCenter}
						zoom={position ? 12 : 6}
						onLoad={onMapLoad}
						onClick={handleMapClick}
						options={{
							streetViewControl: false,
							mapTypeControl: true,
							fullscreenControl: true,
							zoomControl: true,
							mapTypeControlOptions: {
								style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
								position: google.maps.ControlPosition.BOTTOM_CENTER,
							},
							styles: [
								{
									featureType: 'poi',
									elementType: 'labels',
									stylers: [{ visibility: 'on' }],
								},
							],
						}}
					>
						{position && (
							<Marker
								position={position}
								animation={google.maps.Animation.DROP}
								title={searchValue || 'Вибране місце'}
							/>
						)}
					</GoogleMap>
				)}
			</div>

			{showResults && (
				<div className='fixed inset-0 z-0' onClick={() => setShowResults(false)} />
			)}
		</div>
	)
}

import { API_URL } from '@/config/api'
import { useAlert } from '@/providers/AlertContext'
import type {
	IAutocompleteSuggestionStatic,
	ILocationPickerProps,
	ISearchResult,
	ISuggestion,
} from '@/types/locationPicker.interface'
import { useJsApiLoader } from '@react-google-maps/api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const LIBRARIES: ('geometry' | 'places')[] = ['geometry', 'places']
const SEARCH_DEBOUNCE_MS = 400
const MIN_SEARCH_LENGTH = 2

const getReadableAddress = (results: google.maps.GeocoderResult[]): string => {
	if (!results || results.length === 0) return ''

	for (const result of results) {
		const address = result.formatted_address
		const plusCodePattern = /^[A-Z0-9+]{4,}/
		if (!plusCodePattern.test(address)) return address
	}

	const firstResult = results[0]
	const components = firstResult.address_components

	const addressParts: string[] = []
	const locality = components.find(c => c.types.includes('locality'))?.long_name
	const area1 = components.find(c =>
		c.types.includes('administrative_area_level_1'),
	)?.long_name
	const area2 = components.find(c =>
		c.types.includes('administrative_area_level_2'),
	)?.long_name
	const country = components.find(c => c.types.includes('country'))?.long_name

	if (locality) addressParts.push(locality)
	else if (area2) addressParts.push(area2)
	if (area1 && area1 !== locality) addressParts.push(area1)
	if (country) addressParts.push(country)

	return addressParts.length > 0 ? addressParts.join(', ') : firstResult.formatted_address
}

interface IExtendedLocationPickerProps extends ILocationPickerProps {
	initialLocation?: {
		lat: number
		lng: number
		address: string
	}
}

export const useLocationPicker = ({
	onSelectLocation,
	initialLocation,
}: IExtendedLocationPickerProps) => {
	const [locationState, setLocationState] = useState<{
		position: { lat: number; lng: number } | null
		searchValue: string
	}>({
		position: initialLocation
			? { lat: initialLocation.lat, lng: initialLocation.lng }
			: null,
		searchValue: initialLocation?.address || '',
	})

	const [searchResults, setSearchResults] = useState<ISearchResult[]>([])
	const [showResults, setShowResults] = useState(false)
	const [isSearching, setIsSearching] = useState(false)
	const { showError, showWarning } = useAlert()

	const mapRef = useRef<google.maps.Map | null>(null)
	const geocoder = useRef<google.maps.Geocoder | null>(null)
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const isInitializedRef = useRef(false)

	const loaderConfig = useMemo(
		() => ({
			googleMapsApiKey: API_URL.GOOGLE_MAPS!,
			libraries: LIBRARIES,
			language: 'en',
			region: 'UA',
		}),
		[],
	)

	const { isLoaded } = useJsApiLoader(loaderConfig)

	useEffect(() => {
		if (!isLoaded || !window.google || geocoder.current) return
		geocoder.current = new window.google.maps.Geocoder()
	}, [isLoaded])

	useEffect(() => {
		if (isInitializedRef.current || !initialLocation) return
		if (initialLocation.address && !locationState.position) {
			setLocationState({
				position: { lat: initialLocation.lat, lng: initialLocation.lng },
				searchValue: initialLocation.address,
			})
			isInitializedRef.current = true
		}
	}, [initialLocation, locationState.position])

	const searchPlaces = useCallback(
		async (query: string) => {
			if (!window.google?.maps?.importLibrary || query.length < MIN_SEARCH_LENGTH) {
				setSearchResults([])
				setShowResults(false)
				setIsSearching(false)
				return
			}

			setIsSearching(true)
			try {
				const lib = (await window.google.maps.importLibrary('places')) as {
					AutocompleteSuggestion: IAutocompleteSuggestionStatic
				}
				const { suggestions } =
					await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
						input: query,
						includedRegionCodes: [],
						includedPrimaryTypes: ['locality', 'geocode'],
					})

				const formatted = suggestions.map((s: ISuggestion) => ({
					placeId: s.placePrediction.placeId,
					mainText: s.placePrediction.mainText.text,
					secondaryText: s.placePrediction.secondaryText?.text || '',
					fullAddress: `${s.placePrediction.mainText.text}, ${
						s.placePrediction.secondaryText?.text || ''
					}`,
				}))

				setSearchResults(formatted)
				setShowResults(formatted.length > 0)
				if (formatted.length === 0) showWarning(`No results found for "${query}"`)
			} catch {
				setSearchResults([])
				setShowResults(false)
				showError('Failed to fetch places. Please try again.')
			} finally {
				setIsSearching(false)
			}
		},
		[showError, showWarning],
	)

	const handleSearch = useCallback(
		(value: string) => {
			setLocationState(prev => ({ ...prev, searchValue: value }))
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

			searchTimeoutRef.current = setTimeout(() => {
				searchPlaces(value)
			}, SEARCH_DEBOUNCE_MS)
		},
		[searchPlaces],
	)

	const handleClear = useCallback(() => {
		if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

		setLocationState({ position: null, searchValue: '' })
		setSearchResults([])
		setShowResults(false)
		setIsSearching(false)
		onSelectLocation({ lat: 0, lng: 0, address: '' })
	}, [onSelectLocation])

	const handleResultSelect = useCallback(
		(result: ISearchResult) => {
			if (!geocoder.current) return

			geocoder.current.geocode({ placeId: result.placeId }, (results, status) => {
				if (status !== 'OK' || !results?.[0]) return

				const location = results[0].geometry.location
				const lat = location.lat()
				const lng = location.lng()
				const address = result.fullAddress

				setLocationState({ position: { lat, lng }, searchValue: address })
				setShowResults(false)
				onSelectLocation({ lat, lng, address })

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
			})
		},
		[onSelectLocation],
	)

	const handleMapClick = useCallback(
		(event: google.maps.MapMouseEvent) => {
			if (!event.latLng || !geocoder.current) return

			const lat = event.latLng.lat()
			const lng = event.latLng.lng()

			setLocationState(prev => ({ ...prev, position: { lat, lng } }))

			geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
				const address =
					status === 'OK' && results
						? getReadableAddress(results)
						: `${lat.toFixed(6)}, ${lng.toFixed(6)}`

				setLocationState(prev => ({ ...prev, searchValue: address }))
				onSelectLocation({ lat, lng, address })
			})
		},
		[onSelectLocation],
	)

	const onMapLoad = useCallback((map: google.maps.Map): void => {
		mapRef.current = map
	}, [])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && searchResults.length > 0) {
				e.preventDefault()
				handleResultSelect(searchResults[0])
			} else if (e.key === 'Escape') setShowResults(false)
		},
		[searchResults, handleResultSelect],
	)

	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
		}
	}, [])

	return {
		position: locationState.position,
		searchValue: locationState.searchValue,
		isSearching,
		searchResults,
		showResults,
		isLoaded,
		handleSearch,
		handleKeyDown,
		handleResultSelect,
		handleClear,
		setShowResults,
		onMapLoad,
		handleMapClick,
	}
}

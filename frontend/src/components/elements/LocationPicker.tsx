'use client'

import { useLocationPicker } from '@/hooks/useLocationPicker'
import type { ILocationPickerProps } from '@/types/locationPicker.interface'
import Close from '@mui/icons-material/Close'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { memo, useMemo } from 'react'
import { Input } from '../ui/Input'

const CONTAINER_STYLE = {
	width: '100%',
	height: '15rem',
}

const DEFAULT_CENTER = {
	lat: 50.4501,
	lng: 30.5234,
}

const getMapOptions = () => ({
	disableDefaultUI: true,
	fullscreenControl: true,
	fullscreenControlOptions: {
		position: google?.maps?.ControlPosition?.TOP_RIGHT ?? 2,
	},
	gestureHandling: 'greedy' as const,
})

interface ExtendedLocationPickerProps extends ILocationPickerProps {
	initialLocation?: {
		lat: number
		lng: number
		address: string
	}
}

const LoadingSpinner = memo(() => (
	<div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
		<div className='animate-spin rounded-full h-5 w-5 border-2 border-[var(--primary)] border-t-transparent' />
	</div>
))
LoadingSpinner.displayName = 'LoadingSpinner'

const ClearButton = memo(({ onClick }: { onClick: () => void }) => (
	<button
		onMouseDown={e => {
			e.preventDefault()
			onClick()
		}}
		className='absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground'
	>
		<Close className='w-5 h-5' />
	</button>
))
ClearButton.displayName = 'ClearButton'

const SearchResult = memo(
	({
		result,
		onClick,
	}: {
		result: { placeId: string; mainText: string; secondaryText: string }
		onClick: () => void
	}) => (
		<button
			type='button'
			onClick={onClick}
			className='w-full px-4 py-3 text-left bg-muted hover:bg-hover border-b border-border last:border-b-0 first:rounded-t-md last:rounded-b-md transition-colors'
		>
			<div className='font-medium text-foreground mb-1'>{result.mainText}</div>
			<div className='text-sm text-muted-foreground'>{result.secondaryText}</div>
		</button>
	),
)
SearchResult.displayName = 'SearchResult'

const NoResultsMessage = memo(({ searchValue }: { searchValue: string }) => (
	<div className='absolute z-10 w-full mt-2 bg-muted border border-border rounded-md shadow-lg p-4 text-center text-muted-foreground'>
		<div className='mb-2'>🔍</div>
		<div>Nothing found for `${searchValue}`</div>
		<div className='text-xs mt-1'>Try a different query or use the map below</div>
	</div>
))
NoResultsMessage.displayName = 'NoResultsMessage'

const HelpInfo = memo(() => (
	<div className='bg-info rounded-md p-3'>
		<div className='text-sm stable-light'>
			<div className='font-medium mb-1'>💡 How to use:</div>
			<div className='space-y-1'>
				<div>
					• Enter the name of the city in any language: Kyiv, Kiev, Paris, Berlin, etc.
				</div>
				<div>• Press Enter to select the first result</div>
				<div>• Click on the map to place a marker at a specific location</div>
			</div>
		</div>
	</div>
))
HelpInfo.displayName = 'HelpInfo'

export const LocationPicker = memo(
	({ onSelectLocation, initialLocation }: ExtendedLocationPickerProps) => {
		const {
			position,
			searchValue,
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
		} = useLocationPicker({ onSelectLocation, initialLocation })

		const inputEndAdornment = useMemo(
			() => (
				<>
					{isSearching && <LoadingSpinner />}
					{searchValue && !isSearching && <ClearButton onClick={handleClear} />}
				</>
			),
			[isSearching, searchValue, handleClear],
		)

		const resultsList = useMemo(
			() =>
				searchResults.map(result => (
					<SearchResult
						key={result.placeId}
						result={result}
						onClick={() => handleResultSelect(result)}
					/>
				)),
			[searchResults, handleResultSelect],
		)

		const mapCenter = useMemo(() => position || DEFAULT_CENTER, [position])
		const mapZoom = useMemo(() => (position ? 12 : 6), [position])
		const markerTitle = useMemo(() => searchValue || 'Selected Location', [searchValue])

		const mapOptions = useMemo(() => (isLoaded ? getMapOptions() : undefined), [isLoaded])

		const handleFocus = useMemo(
			() => () => {
				if (searchResults.length > 0) setShowResults(true)
			},
			[searchResults.length, setShowResults],
		)

		const handleOverlayClick = useMemo(
			() => () => setShowResults(false),
			[setShowResults],
		)

		return (
			<div className='flex flex-col gap-4'>
				<div className='relative'>
					<div className='relative'>
						<Input
							value={searchValue}
							onChange={e => handleSearch(e.target.value)}
							onKeyDown={handleKeyDown}
							onFocus={handleFocus}
							label='Enter the name of the city in any language (Kyiv, Paris, London)'
							InputProps={{
								endAdornment: inputEndAdornment,
							}}
						/>
					</div>

					{showResults && searchResults.length > 0 && (
						<div className='absolute z-10 w-full mt-2 bg-muted border border-border rounded-md shadow-lg max-h-64 overflow-y-auto'>
							{resultsList}
						</div>
					)}

					{showResults &&
						searchResults.length === 0 &&
						!isSearching &&
						searchValue.length > 2 && <NoResultsMessage searchValue={searchValue} />}
				</div>

				<HelpInfo />

				<div className='rounded-lg overflow-hidden shadow-sm'>
					{isLoaded && mapOptions && (
						<GoogleMap
							mapContainerStyle={CONTAINER_STYLE}
							center={mapCenter}
							zoom={mapZoom}
							onLoad={onMapLoad}
							onClick={handleMapClick}
							options={mapOptions}
						>
							{position && (
								<Marker
									position={position}
									animation={google.maps.Animation.DROP}
									title={markerTitle}
								/>
							)}
						</GoogleMap>
					)}
				</div>

				{showResults && (
					<div className='fixed inset-0 z-0' onClick={handleOverlayClick} />
				)}
			</div>
		)
	},
)

LocationPicker.displayName = 'LocationPicker'

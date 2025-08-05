'use client'
import { useLocationPicker } from '@/hooks/useLocationPicker'
import type { LocationPickerProps } from '@/shared/LocationPicker'
import Close from '@mui/icons-material/Close'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { AuthInput } from './AuthInput'

const containerStyle = {
	width: '100%',
	height: '15rem',
}

const defaultCenter = {
	lat: 50.4501,
	lng: 30.5234,
}

interface ExtendedLocationPickerProps extends LocationPickerProps {
	initialLocation?: {
		lat: number
		lng: number
		address: string
	}
}

export const LocationPicker = ({
	onSelectLocation,
	initialLocation,
}: ExtendedLocationPickerProps) => {
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

	return (
		<div className='flex flex-col gap-4'>
			<div className='relative'>
				<div className='relative'>
					<AuthInput
						type='text'
						value={searchValue}
						onChange={e => handleSearch(e.target.value)}
						onKeyDown={handleKeyDown}
						onFocus={() => {
							if (searchResults.length > 0) {
								setShowResults(true)
							}
						}}
						label='Enter the name of the city in any language (Kyiv, Paris, London)'
						InputProps={{
							endAdornment: (
								<>
									{isSearching && (
										<div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
											<div className='animate-spin rounded-full h-5 w-5 border-2 border-[var(--primary)] border-t-transparent'></div>
										</div>
									)}

									{searchValue && !isSearching && (
										<button
											onMouseDown={e => {
												e.preventDefault()
												handleClear()
											}}
											className='absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground'
										>
											<Close className='w-5 h-5' />
										</button>
									)}
								</>
							),
						}}
					/>
				</div>

				{showResults && searchResults.length > 0 && (
					<div className='absolute z-10 w-full mt-2 bg-muted border border-border rounded-md shadow-lg max-h-64 overflow-y-auto'>
						{searchResults.map(result => (
							<button
								type='button'
								key={result.placeId}
								onClick={() => handleResultSelect(result)}
								className='w-full px-4 py-3 text-left hover:bg-hover border-b border-border last:border-b-0 first:rounded-t-md last:rounded-b-md transition-colors'
							>
								<div className='font-medium text-foreground mb-1'>{result.mainText}</div>
								<div className='text-sm text-muted-foreground'>
									{result.secondaryText}
								</div>
							</button>
						))}
					</div>
				)}

				{showResults &&
					searchResults.length === 0 &&
					!isSearching &&
					searchValue.length > 2 && (
						<div className='absolute z-10 w-full mt-2 bg-muted border border-border rounded-md shadow-lg p-4 text-center text-muted-foreground'>
							<div className='mb-2'>🔍</div>
							<div>Nothing found for `${searchValue}`</div>
							<div className='text-xs mt-1'>
								Try a different query or use the map below
							</div>
						</div>
					)}
			</div>

			<div className='bg-info rounded-md p-3'>
				<div className='text-sm text-info-foreground'>
					<div className='font-medium mb-1'>💡 How to use:</div>
					<div className='space-y-1'>
						<div>
							• Enter the name of the city in any language: Kyiv, Kiev, Paris, Berlin,
							etc.
						</div>
						<div>• Press Enter to select the first result</div>
						<div>• Click on the map to place a marker at a specific location</div>
					</div>
				</div>
			</div>

			<div className='rounded-lg overflow-hidden shadow-sm'>
				{isLoaded && (
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={position || defaultCenter}
						zoom={position ? 12 : 6}
						onLoad={onMapLoad}
						onClick={handleMapClick}
						options={{
							disableDefaultUI: true,
							fullscreenControl: true,
							fullscreenControlOptions: {
								position: google.maps.ControlPosition.TOP_RIGHT,
							},
							gestureHandling: 'greedy',
						}}
					>
						{position && (
							<Marker
								position={position}
								animation={google.maps.Animation.DROP}
								title={searchValue || 'Selected Location'}
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

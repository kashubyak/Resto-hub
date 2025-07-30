type Coordinates = {
	lat: number
	lng: number
	address: string
}

interface PlacePredictionText {
	text: string
}

interface PlacePrediction {
	placeId: string
	mainText: PlacePredictionText
	secondaryText?: PlacePredictionText
}

interface AutocompleteSuggestionResult {
	suggestions: Suggestion[]
}

export type LocationPickerProps = {
	onSelectLocation: (location: Coordinates) => void
}

export interface ISearchResult {
	placeId: string
	mainText: string
	secondaryText: string
	fullAddress: string
}

export interface Suggestion {
	placePrediction: PlacePrediction
}

export interface AutocompleteSuggestionStatic {
	fetchAutocompleteSuggestions: (opts: {
		input: string
		includedRegionCodes: string[]
		includedPrimaryTypes: string[]
	}) => Promise<AutocompleteSuggestionResult>
}

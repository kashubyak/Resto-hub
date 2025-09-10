type Coordinates = {
	lat: number
	lng: number
	address: string
}

interface IPlacePredictionText {
	text: string
}

interface IPlacePrediction {
	placeId: string
	mainText: IPlacePredictionText
	secondaryText?: IPlacePredictionText
}

interface IAutocompleteSuggestionResult {
	suggestions: ISuggestion[]
}

export interface ILocationPickerProps {
	onSelectLocation: (location: Coordinates) => void
}

export interface ISearchResult {
	placeId: string
	mainText: string
	secondaryText: string
	fullAddress: string
}

export interface ISuggestion {
	placePrediction: IPlacePrediction
}

export interface IAutocompleteSuggestionStatic {
	fetchAutocompleteSuggestions: (opts: {
		input: string
		includedRegionCodes: string[]
		includedPrimaryTypes: string[]
	}) => Promise<IAutocompleteSuggestionResult>
}

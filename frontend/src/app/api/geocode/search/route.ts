import { NextRequest, NextResponse } from 'next/server'

const PHOTON_BASE = 'https://photon.komoot.io'

interface PhotonFeature {
	type: string
	geometry: { type: string; coordinates: [number, number] }
	properties: {
		name?: string
		country?: string
		countrycode?: string
		state?: string
		type?: string
		city?: string
		street?: string
	}
}

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

function photonToLocationResult(f: PhotonFeature): LocationResult {
	const [lon, lat] = f.geometry.coordinates
	const props = f.properties
	const name = props.name ?? ''
	const country = props.country ?? ''
	const display_name = country ? `${name}, ${country}` : name
	const type = props.type ?? ''

	return {
		display_name,
		lat: String(lat),
		lon: String(lon),
		address: {
			city: type === 'city' ? name : props.city,
			town: type === 'town' ? name : undefined,
			village: type === 'village' ? name : undefined,
			country,
			state: type === 'state' ? name : props.state,
		},
	}
}

export async function GET(request: NextRequest) {
	const q = request.nextUrl.searchParams.get('q')
	if (!q || q.length < 3) {
		return NextResponse.json([], { status: 200 })
	}

	try {
		const url = new URL('/api/', PHOTON_BASE)
		url.searchParams.set('q', q)
		url.searchParams.set('limit', '5')
		url.searchParams.set('lang', 'en')

		const response = await fetch(url.toString(), {
			headers: { Accept: 'application/json' },
		})

		if (!response.ok) {
			return NextResponse.json([], { status: 200 })
		}

		const data = await response.json()
		const features: PhotonFeature[] = data.features ?? []
		const results: LocationResult[] = features.map(photonToLocationResult)
		return NextResponse.json(results)
	} catch (error) {
		console.error('Geocode search error:', error)
		return NextResponse.json([], { status: 200 })
	}
}

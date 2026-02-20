import { NextRequest, NextResponse } from 'next/server'

const PHOTON_BASE = 'https://photon.komoot.io'

export async function GET(request: NextRequest) {
	const lat = request.nextUrl.searchParams.get('lat')
	const lon = request.nextUrl.searchParams.get('lon')
	if (lat == null || lon == null) {
		return NextResponse.json({ error: 'Missing lat or lon' }, { status: 400 })
	}

	try {
		const url = new URL('/reverse', PHOTON_BASE)
		url.searchParams.set('lat', lat)
		url.searchParams.set('lon', lon)
		url.searchParams.set('lang', 'en')

		const response = await fetch(url.toString(), {
			headers: { Accept: 'application/json' },
		})

		if (!response.ok) {
			const fallback = `${Number(lat).toFixed(4)}, ${Number(lon).toFixed(4)}`
			return NextResponse.json({ display_name: fallback })
		}

		const data = await response.json()
		const features = data.features ?? []
		const first = features[0]
		if (!first?.properties) {
			const fallback = `${Number(lat).toFixed(4)}, ${Number(lon).toFixed(4)}`
			return NextResponse.json({ display_name: fallback })
		}

		const p = first.properties
		const parts = [p.street, p.name, p.city, p.state, p.country].filter(Boolean)
		const display_name =
			parts.length > 0
				? parts.join(', ')
				: `${Number(lat).toFixed(4)}, ${Number(lon).toFixed(4)}`
		return NextResponse.json({ display_name })
	} catch (error) {
		console.error('Geocode reverse error:', error)
		const fallback = `${Number(lat).toFixed(4)}, ${Number(lon).toFixed(4)}`
		return NextResponse.json({ display_name: fallback })
	}
}

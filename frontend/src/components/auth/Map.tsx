'use client'

import { usePrefersColorScheme } from '@/hooks/usePrefersColorScheme'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

interface MapProps {
	center?: [number, number]
	marker?: [number, number]
	onLocationSelect?: (lat: number, lng: number, address: string) => void
}

export function Map({ center, marker, onLocationSelect }: MapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<L.Map | null>(null)
	const markerInstanceRef = useRef<L.Marker | null>(null)
	const theme = usePrefersColorScheme()

	useEffect(() => {
		if (!mapRef.current || mapInstanceRef.current) return

		const defaultCenter: [number, number] = center || [48.3794, 31.1656]

		const map = L.map(mapRef.current, {
			center: defaultCenter,
			zoom: center ? 12 : 6,
			zoomControl: true,
		})

		mapInstanceRef.current = map

		const tileLayer =
			theme === 'dark'
				? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
				: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

		L.tileLayer(tileLayer, {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: 'abcd',
			maxZoom: 19,
		}).addTo(map)

		return () => {
			map.remove()
			mapInstanceRef.current = null
		}
	}, [])

	useEffect(() => {
		if (!mapInstanceRef.current) return

		const tileLayer =
			theme === 'dark'
				? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
				: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

		mapInstanceRef.current.eachLayer((layer) => {
			if (layer instanceof L.TileLayer) {
				mapInstanceRef.current?.removeLayer(layer)
			}
		})

		L.tileLayer(tileLayer, {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: 'abcd',
			maxZoom: 19,
		}).addTo(mapInstanceRef.current)
	}, [theme])

	useEffect(() => {
		if (!mapInstanceRef.current || !center) return
		const map = mapInstanceRef.current
		const currentZoom = map.getZoom()
		const newZoom = Math.max(12, currentZoom)
		map.setView(center, newZoom, { animate: true })
	}, [center])

	useEffect(() => {
		if (!mapInstanceRef.current) return

		if (markerInstanceRef.current) {
			mapInstanceRef.current.removeLayer(markerInstanceRef.current)
			markerInstanceRef.current = null
		}

		if (marker) {
			const customIcon = L.divIcon({
				className: 'custom-marker',
				html: `<div style="width: 24px; height: 24px; background: var(--primary, #7c3aed); border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
				iconSize: [24, 24],
				iconAnchor: [12, 12],
			})

			markerInstanceRef.current = L.marker(marker, {
				icon: customIcon,
			}).addTo(mapInstanceRef.current)
		}
	}, [marker])

	useEffect(() => {
		if (!mapInstanceRef.current || !onLocationSelect) return

		const handleClick = async (e: L.LeafletMouseEvent) => {
			const { lat, lng } = e.latlng
			try {
				const response = await fetch(
					`/api/geocode/reverse?lat=${lat}&lon=${lng}`,
				)
				const data = await response.json()
				const address =
					data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
				onLocationSelect(lat, lng, address)
			} catch (error) {
				console.error('Geocoding error:', error)
				onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
			}
		}

		mapInstanceRef.current.on('click', handleClick)

		return () => {
			mapInstanceRef.current?.off('click', handleClick)
		}
	}, [onLocationSelect])

	return (
		<div className="w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border border-border/50">
			<div ref={mapRef} className="w-full h-full" />
		</div>
	)
}

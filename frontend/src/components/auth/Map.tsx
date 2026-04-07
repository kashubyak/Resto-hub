'use client'

import { usePrefersColorScheme } from '@/hooks/usePrefersColorScheme'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

function scheduleInvalidateSize(map: L.Map) {
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			map.invalidateSize()
		})
	})
}

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

	const centerLat = center?.[0]
	const centerLng = center?.[1]
	const markerLat = marker?.[0]
	const markerLng = marker?.[1]

	useEffect(() => {
		if (!mapRef.current || mapInstanceRef.current) return

		const tileUrl =
			theme === 'dark'
				? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
				: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

		const map = L.map(mapRef.current, {
			center: [48.3794, 31.1656],
			zoom: 6,
			zoomControl: true,
		})
		mapInstanceRef.current = map

		L.tileLayer(tileUrl, {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: 'abcd',
			maxZoom: 19,
		}).addTo(map)

		scheduleInvalidateSize(map)

		const el = mapRef.current
		const resizeObserver =
			typeof ResizeObserver !== 'undefined' && el
				? new ResizeObserver(() => {
						if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize()
					})
				: null
		if (el && resizeObserver) resizeObserver.observe(el)

		return () => {
			resizeObserver?.disconnect()
			map.remove()
			mapInstanceRef.current = null
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps -- theme: sibling effect below

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
		if (
			!mapInstanceRef.current ||
			centerLat === undefined ||
			centerLng === undefined
		)
			return
		if (!Number.isFinite(centerLat) || !Number.isFinite(centerLng)) return

		const map = mapInstanceRef.current
		const currentZoom = map.getZoom()
		const newZoom = Math.max(12, currentZoom)
		map.setView([centerLat, centerLng], newZoom, { animate: true })
		scheduleInvalidateSize(map)
	}, [centerLat, centerLng])

	useEffect(() => {
		if (!mapInstanceRef.current) return

		if (markerInstanceRef.current) {
			mapInstanceRef.current.removeLayer(markerInstanceRef.current)
			markerInstanceRef.current = null
		}

		if (
			markerLat === undefined ||
			markerLng === undefined ||
			!Number.isFinite(markerLat) ||
			!Number.isFinite(markerLng)
		)
			return

		const customIcon = L.divIcon({
			className: 'custom-marker',
			html: `<div style="width: 24px; height: 24px; background: var(--primary, #7c3aed); border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
			iconSize: [24, 24],
			iconAnchor: [12, 12],
		})

		const map = mapInstanceRef.current
		const position: [number, number] = [markerLat, markerLng]
		markerInstanceRef.current = L.marker(position, {
			icon: customIcon,
		}).addTo(map)
		const nextZoom = Math.max(13, map.getZoom())
		map.setView(position, nextZoom, { animate: true })
		scheduleInvalidateSize(map)
	}, [markerLat, markerLng])

	useEffect(() => {
		const map = mapInstanceRef.current
		if (!map || !onLocationSelect) return

		const handleClick = (e: L.LeafletMouseEvent) => {
			void (async () => {
				const { lat, lng } = e.latlng
				try {
					const response = await fetch(
						`/api/geocode/reverse?lat=${lat}&lon=${lng}`,
					)
					const data = await response.json()
					const address =
						data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
					onLocationSelect(lat, lng, address)
				} catch {
					onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
				}
			})()
		}

		map.on('click', handleClick)

		return () => {
			map.off('click', handleClick)
		}
	}, [onLocationSelect])

	return (
		<div className="w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border border-border/50">
			<div ref={mapRef} className="w-full h-full" />
		</div>
	)
}

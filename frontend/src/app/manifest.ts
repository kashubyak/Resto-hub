import { PWA_ICON_PATHS, SITE_DESCRIPTION } from '@/constants/pwa.constant'
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Resto Hub',
		short_name: 'RestoHub',
		description: SITE_DESCRIPTION,
		start_url: '/',
		scope: '/',
		display: 'standalone',
		orientation: 'portrait',
		theme_color: '#7c3aed',
		background_color: '#ffffff',
		lang: 'en',
		categories: ['business', 'food', 'productivity'],
		icons: [
			{
				src: PWA_ICON_PATHS.ANDROID_192,
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: PWA_ICON_PATHS.ANDROID_512,
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: PWA_ICON_PATHS.ANDROID_192_MASKABLE,
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: PWA_ICON_PATHS.ANDROID_512_MASKABLE,
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	}
}

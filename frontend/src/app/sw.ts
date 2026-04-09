/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { defaultCache } from '@serwist/turbopack/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { ExpirationPlugin, Serwist, StaleWhileRevalidate } from 'serwist'

declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined
	}
}

declare const self: ServiceWorkerGlobalScope

const s3ImageCache = {
	matcher: /^https:\/\/resto-hub\.s3\.eu-central-1\.amazonaws\.com\/.*/i,
	handler: new StaleWhileRevalidate({
		cacheName: 's3-images',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 80,
				maxAgeSeconds: 60 * 60 * 24 * 7,
			}),
		],
	}),
} as const

const serwist = new Serwist({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	runtimeCaching: [...defaultCache, s3ImageCache],
	fallbacks: {
		entries: [
			{
				url: '/offline',
				matcher({ request }) {
					return request.destination === 'document'
				},
			},
		],
	},
})

serwist.addEventListeners()

/** Hostname for dish files on company S3; keep aligned with `next.config.ts` `images.remotePatterns`. */
export const DISH_IMAGE_S3_HOSTNAME = 'resto-hub.s3.eu-central-1.amazonaws.com' as const

/**
 * Next.js image optimization can mishandle third-party URLs (e.g. Unsplash with `?q=&w=`).
 * Use `unoptimized={dishImageBypassesNextOptimizer(url)}` so the browser loads the original URL.
 */
export function dishImageBypassesNextOptimizer(imageUrl: string): boolean {
	if (!imageUrl.trim()) return true
	try {
		return new URL(imageUrl).hostname !== DISH_IMAGE_S3_HOSTNAME
	} catch {
		return true
	}
}

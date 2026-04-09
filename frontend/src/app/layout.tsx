import { PWA_ICON_PATHS, SITE_DESCRIPTION } from '@/constants/pwa.constant'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Providers } from './Providers'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'swap',
})

const APP_NAME = 'Resto Hub'
const APP_DEFAULT_TITLE = 'Resto Hub'

export const metadata: Metadata = {
	applicationName: APP_NAME,
	title: {
		template: '%s | Resto Hub',
		default: APP_DEFAULT_TITLE,
	},
	description: SITE_DESCRIPTION,
	icons: {
		icon: [
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon.ico' },
		],
		apple: [
			{
				url: PWA_ICON_PATHS.APPLE_TOUCH,
				sizes: '180x180',
				type: 'image/png',
			},
		],
	},
	appleWebApp: {
		capable: true,
		title: APP_DEFAULT_TITLE,
		statusBarStyle: 'default',
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		type: 'website',
		siteName: APP_NAME,
		title: APP_DEFAULT_TITLE,
		description: SITE_DESCRIPTION,
	},
	twitter: {
		card: 'summary',
		title: APP_DEFAULT_TITLE,
		description: SITE_DESCRIPTION,
	},
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#7c3aed' },
		{ media: '(prefers-color-scheme: dark)', color: '#a78bfa' },
	],
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Providers } from './Providers'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: {
		template: '%s | Resto Hub',
		default: 'Resto Hub',
	},
	icons: {
		icon: [
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon.ico' },
		],
		apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
		other: [{ rel: 'manifest', url: '/site.webmanifest' }],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}

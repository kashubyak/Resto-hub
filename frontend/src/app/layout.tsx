import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Resto Hub',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	)
}

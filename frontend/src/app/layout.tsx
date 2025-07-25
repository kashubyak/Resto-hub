export const metadata = {
	title: 'Resto Hub',
	description: 'Restaurant management app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	)
}

'use client'

import { memo } from 'react'

export const BackgroundDecorations = memo(function BackgroundDecorations() {
	return (
		<>
			{/* Gradient orbs */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
				<div
					className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
					style={{ animationDelay: '3s' }}
				/>
				<div
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float"
					style={{ animationDelay: '1.5s' }}
				/>
			</div>

			{/* Grid pattern overlay - opacity via CSS variable for light/dark */}
			<div
				className="fixed inset-0 pointer-events-none z-0 auth-grid-overlay"
				style={{
					backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
						linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
					backgroundSize: '50px 50px',
				}}
			/>
		</>
	)
})

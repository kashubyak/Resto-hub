import { memo } from 'react'

interface NotFoundProps {
	icon: React.ReactNode
	title: string
	message: string
}

export const NotFound = memo<NotFoundProps>(({ icon, title, message }) => {
	return (
		<div className="flex flex-1 items-center justify-center py-12">
			<div className="text-center space-y-6">
				<div className="text-7xl">{icon}</div>
				<div>
					<h2 className="text-2xl font-bold mb-2">{title}</h2>
					<p className="text-muted-foreground text-lg">{message}</p>
				</div>
			</div>
		</div>
	)
})

NotFound.displayName = 'NotFound'

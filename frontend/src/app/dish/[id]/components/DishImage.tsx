import { ViewableImage } from '@/components/elements/ImageViewer/ViewableImage'

export const DishImage = ({
	imageUrl,
	name,
}: {
	imageUrl: string
	name: string
}) => {
	return (
		<div className="lg:col-span-2 relative flex items-center justify-center lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start">
			<div className="relative w-full max-w-7xl h-full">
				<div className="relative w-full h-full min-h-[40vh]">
					<ViewableImage
						src={imageUrl}
						alt={name}
						fill
						className="object-contain"
						priority
						sizes="(max-width: 1024px) 100vw, 66vw"
					/>
				</div>
			</div>
		</div>
	)
}

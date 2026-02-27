import { ViewableImage } from '@/components/elements/ImageViewer/ViewableImage'

export const DishImage = ({
	imageUrl,
	name,
}: {
	imageUrl: string
	name: string
}) => {
	return (
		<div className="lg:col-span-7 xl:col-span-8">
			<div className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
				<div className="relative w-full h-full min-h-[280px] aspect-square lg:aspect-auto bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl overflow-hidden">
					<div className="absolute inset-0 min-h-[40vh]">
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
		</div>
	)
}

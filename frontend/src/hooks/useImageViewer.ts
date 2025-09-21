import { useCallback, useState } from 'react'

interface IImageViewerState {
	isOpen: boolean
	imageSrc: string | null
	imageAlt: string
}
export const useImageViewer = () => {
	const [state, setState] = useState<IImageViewerState>({
		isOpen: false,
		imageSrc: null,
		imageAlt: '',
	})
	const openViewer = useCallback(
		(src: string, alt: string = 'Image') =>
			setState({ isOpen: true, imageSrc: src, imageAlt: alt }),
		[],
	)

	const closeViewer = useCallback(
		() => setState({ isOpen: false, imageSrc: null, imageAlt: '' }),
		[],
	)

	return {
		...state,
		openViewer,
		closeViewer,
	}
}

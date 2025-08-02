import { useEffect, useRef, useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type UseUploadImageParams = {
	register: UseFormRegisterReturn
	savedPreview?: string | null
	onDataChange?: (preview: string | null, file: File | null) => void
}

export const useUploadImage = ({
	register,
	savedPreview,
	onDataChange,
}: UseUploadImageParams) => {
	const [preview, setPreview] = useState<string | null>(savedPreview || null)
	const [isDragging, setIsDragging] = useState(false)

	const inputRef = useRef<HTMLInputElement | null>(null)
	const { ref, ...restRegister } = register

	const createFileFromBase64 = (base64: string, fileName: string = 'image.jpg'): File => {
		const arr = base64.split(',')
		const mime = arr[0].match(/:(.*?);/)![1]
		const bstr = atob(arr[1])
		let n = bstr.length
		const u8arr = new Uint8Array(n)
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n)
		}
		return new File([u8arr], fileName, { type: mime })
	}

	useEffect(() => {
		if (savedPreview && !preview) {
			setPreview(savedPreview)
			if (inputRef.current && savedPreview.startsWith('data:')) {
				try {
					const file = createFileFromBase64(savedPreview)
					const dataTransfer = new DataTransfer()
					dataTransfer.items.add(file)
					inputRef.current.files = dataTransfer.files

					const event = new Event('change', { bubbles: true })
					inputRef.current.dispatchEvent(event)
				} catch (error) {
					console.error('Error restoring file from base64:', error)
				}
			}
		}
	}, [savedPreview, preview])

	const handleFile = (file: File) => {
		const reader = new FileReader()
		reader.onloadend = () => {
			const result = reader.result as string
			setPreview(result)
			onDataChange?.(result, file)
		}
		reader.readAsDataURL(file)

		if (inputRef.current) {
			const dataTransfer = new DataTransfer()
			dataTransfer.items.add(file)
			inputRef.current.files = dataTransfer.files
			const event = new Event('change', { bubbles: true })
			inputRef.current.dispatchEvent(event)
		}
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragging(false)
		const file = e.dataTransfer.files?.[0]
		if (file) handleFile(file)
	}

	const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
	}

	useEffect(() => {
		let dragCounter = 0

		const handleDragEnter = (e: DragEvent) => {
			e.preventDefault()
			dragCounter++
			setIsDragging(true)
		}

		const handleDragLeave = (e: DragEvent) => {
			e.preventDefault()
			dragCounter--
			if (dragCounter <= 0) {
				setIsDragging(false)
				dragCounter = 0
			}
		}

		const handleDrop = (e: DragEvent) => {
			e.preventDefault()
			setIsDragging(false)
			dragCounter = 0

			const file = e.dataTransfer?.files?.[0]
			if (file) handleFile(file)
		}

		window.addEventListener('dragenter', handleDragEnter)
		window.addEventListener('dragleave', handleDragLeave)
		window.addEventListener('drop', handleDrop)
		window.addEventListener('dragover', e => e.preventDefault())

		return () => {
			window.removeEventListener('dragenter', handleDragEnter)
			window.removeEventListener('dragleave', handleDragLeave)
			window.removeEventListener('drop', handleDrop)
			window.removeEventListener('dragover', e => e.preventDefault())
		}
	}, [])

	useEffect(() => {
		const handleChange = (e: Event) => {
			const target = e.target as HTMLInputElement
			const file = target.files?.[0]
			if (file) handleFile(file)
		}
		const input = inputRef.current
		input?.addEventListener('change', handleChange)
		return () => {
			input?.removeEventListener('change', handleChange)
		}
	}, [])
	return {
		preview,
		isDragging,
		inputRef,
		handleDrop,
		preventDefaults,
		ref,
		...restRegister,
	}
}

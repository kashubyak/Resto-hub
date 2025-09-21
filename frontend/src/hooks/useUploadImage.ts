import { size_of_image } from '@/constants/share.constant'
import { useAlert } from '@/providers/AlertContext'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { useCallback, useEffect, useRef, useState } from 'react'
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
	const { showSuccess, showError } = useAlert()

	const inputRef = useRef<HTMLInputElement | null>(null)
	const isDispatching = useRef(false)
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

					isDispatching.current = true
					const event = new Event('change', { bubbles: true })
					inputRef.current.dispatchEvent(event)
				} catch (error) {
					showError(parseBackendError(error as IAxiosError).join('\n'))
				}
			}
		}
	}, [savedPreview, preview, showError])

	const handleFile = useCallback(
		(file: File) => {
			if (!file.type.startsWith('image/')) {
				showError('Only image files are allowed')
				return
			}
			if (file.size > size_of_image * 1024 * 1024) {
				showError(`File size must be less than ${size_of_image}MB`)
				return
			}

			const reader = new FileReader()
			reader.onloadend = () => {
				const result = reader.result as string
				setPreview(result)
				onDataChange?.(result, file)
				showSuccess('Image uploaded successfully')
			}
			reader.onerror = () => showError('Error reading the file')
			reader.readAsDataURL(file)

			if (inputRef.current) {
				const dataTransfer = new DataTransfer()
				dataTransfer.items.add(file)
				inputRef.current.files = dataTransfer.files

				isDispatching.current = true
				const event = new Event('change', { bubbles: true })
				inputRef.current.dispatchEvent(event)
			}
		},
		[onDataChange, showSuccess, showError],
	)

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

	const isFileBeingDragged = (e: DragEvent): boolean => {
		const types = e.dataTransfer?.types
		if (!types) return false

		return types.includes('Files')
	}

	useEffect(() => {
		let dragCounter = 0

		const handleDragEnter = (e: DragEvent) => {
			if (!isFileBeingDragged(e)) return

			e.preventDefault()
			dragCounter++
			setIsDragging(true)
		}

		const handleDragLeave = (e: DragEvent) => {
			if (!isFileBeingDragged(e)) return

			e.preventDefault()
			dragCounter--
			if (dragCounter <= 0) {
				setIsDragging(false)
				dragCounter = 0
			}
		}

		const handleDrop = (e: DragEvent) => {
			if (!isFileBeingDragged(e)) return
			e.preventDefault()
			setIsDragging(false)
			dragCounter = 0

			const file = e.dataTransfer?.files?.[0]
			if (file) handleFile(file)
		}
		const handleDragOver = (e: DragEvent) => e.preventDefault()

		window.addEventListener('dragenter', handleDragEnter)
		window.addEventListener('dragleave', handleDragLeave)
		window.addEventListener('drop', handleDrop)
		window.addEventListener('dragover', handleDragOver)

		return () => {
			window.removeEventListener('dragenter', handleDragEnter)
			window.removeEventListener('dragleave', handleDragLeave)
			window.removeEventListener('drop', handleDrop)
			window.removeEventListener('dragover', handleDragOver)
		}
	}, [handleFile])

	useEffect(() => {
		const handleChange = (e: Event) => {
			if (isDispatching.current) {
				isDispatching.current = false
				return
			}
			const target = e.target as HTMLInputElement
			const file = target.files?.[0]
			if (file) handleFile(file)
		}

		const input = inputRef.current
		input?.addEventListener('change', handleChange)

		return () => {
			input?.removeEventListener('change', handleChange)
		}
	}, [handleFile])

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

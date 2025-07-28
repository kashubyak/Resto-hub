import { useEffect, useRef, useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

export const useUploadImage = (register: UseFormRegisterReturn) => {
	const [preview, setPreview] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)

	const inputRef = useRef<HTMLInputElement | null>(null)
	const { ref, ...restRegister } = register

	const handleFile = (file: File) => {
		const reader = new FileReader()
		reader.onloadend = () => {
			setPreview(reader.result as string)
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

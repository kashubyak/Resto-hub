'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type AuthImageUploadProps = {
	label?: string
	error?: string
	register: UseFormRegisterReturn
}

export const AuthImageUpload = ({ label, register, error }: AuthImageUploadProps) => {
	const [preview, setPreview] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		const handleChange = (e: Event) => {
			const target = e.target as HTMLInputElement
			const file = target.files?.[0]
			if (file) {
				const reader = new FileReader()
				reader.onloadend = () => {
					setPreview(reader.result as string)
				}
				reader.readAsDataURL(file)
			}
		}
		const input = inputRef.current
		input?.addEventListener('change', handleChange)

		return () => {
			input?.removeEventListener('change', handleChange)
		}
	}, [])
	const { ref, ...restRegister } = register

	return (
		<div className='flex flex-col gap-2'>
			{label && <span className='text-sm font-medium text-foreground'>{label}</span>}

			<input
				type='file'
				accept='image/*'
				ref={e => {
					ref(e)
					inputRef.current = e
				}}
				{...restRegister}
				className='file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80 cursor-pointer'
			/>
			{preview && (
				<div className='mt-2 w-32 h-32 mx-4 relative rounded-md overflow-hidden'>
					<Image src={preview} alt='Preview' fill className='object-cover' />
				</div>
			)}
			{error && <span className='text-red-500 text-sm'>{error}</span>}
		</div>
	)
}

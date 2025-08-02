'use client'

import { AuthButton } from '@/components/Auth/AuthButton'
import { AuthInput } from '@/components/Auth/AuthInput'
import { LocationPicker } from '@/components/Auth/LocationPicker'
import { UploadImage } from '@/components/UploadImage/UploadImage'
import { registerCompany } from '@/services/auth'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthLayout } from './AuthLayout'

interface IFormValues {
	name: string
	subdomain: string
	address: string
	latitude: number
	longitude: number
	adminName: string
	adminEmail: string
	adminPassword: string
	confirmPassword: string
	logoUrl: FileList
	avatarUrl: FileList
}

export const RegisterCompany = () => {
	const [step, setStep] = useState<0 | 1>(0)
	const [hasMounted, setHasMounted] = useState(false)
	const [savedPreviews, setSavedPreviews] = useState<{
		logo: string | null
		avatar: string | null
	}>({
		logo: null,
		avatar: null,
	})
	const [savedFiles, setSavedFiles] = useState<{
		logo: File | null
		avatar: File | null
	}>({
		logo: null,
		avatar: null,
	})
	useEffect(() => setHasMounted(true), [])

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		clearErrors,
	} = useForm<IFormValues>()
	const router = useRouter()
	const [location, setLocation] = useState<{
		lat: number
		lng: number
		address: string
	}>({
		lat: 0,
		lng: 0,
		address: '',
	})

	const handleImageData = (
		type: 'logo' | 'avatar',
		preview: string | null,
		file: File | null,
	) => {
		setSavedPreviews(prev => ({
			...prev,
			[type]: preview,
		}))
		setSavedFiles(prev => ({
			...prev,
			[type]: file,
		}))

		if (file) {
			if (type === 'logo') {
				clearErrors('logoUrl')
			} else {
				clearErrors('avatarUrl')
			}
		}
	}

	const onSubmit = async (data: IFormValues) => {
		if (step === 0) {
			if (!location.address) {
				alert('Please select a location')
				return
			}
			setValue('address', location.address)
			setValue('latitude', location.lat)
			setValue('longitude', location.lng)
			setStep(1)
			return
		}

		const formData = new FormData()
		formData.append('name', data.name)
		formData.append('subdomain', data.subdomain)
		formData.append('address', location.address)
		formData.append('latitude', String(location.lat))
		formData.append('longitude', String(location.lng))
		formData.append('adminName', data.adminName)
		formData.append('adminEmail', data.adminEmail)
		formData.append('adminPassword', data.adminPassword)
		formData.append('logoUrl', data.logoUrl?.[0] || savedFiles.logo!)
		formData.append('avatarUrl', data.avatarUrl?.[0] || savedFiles.avatar!)

		const response = await registerCompany(formData)
		localStorage.setItem('token', response.access_token)
	}
	const validateLogo = () => {
		const logoFiles = watch('logoUrl')
		return (
			(logoFiles && logoFiles.length > 0) ||
			savedFiles.logo !== null ||
			'Logo is required'
		)
	}
	const validateAvatar = () => {
		const avatarFiles = watch('avatarUrl')
		return (
			(avatarFiles && avatarFiles.length > 0) ||
			savedFiles.avatar !== null ||
			'Avatar is required'
		)
	}

	const validatePasswordMatch = (value: string) => {
		const password = watch('adminPassword')
		return password === value || 'Passwords do not match'
	}

	return (
		<AuthLayout
			title='Register Company'
			onSubmit={handleSubmit(onSubmit)}
			encType='multipart/form-data'
		>
			<div className='min-h-[350px]'>
				<AnimatePresence mode='wait'>
					{step === 0 && (
						<motion.div
							key='step-0'
							initial={hasMounted ? { opacity: 0, x: -40 } : false}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 40 }}
							transition={{ duration: 0.3 }}
							className='space-y-2'
						>
							<AuthInput
								type='text'
								placeholder='Company Name'
								register={register('name', { required: 'Company name is required' })}
								error={errors.name?.message}
							/>
							<AuthInput
								type='text'
								placeholder='Subdomain'
								register={register('subdomain', { required: 'Subdomain is required' })}
								error={errors.subdomain?.message}
							/>
							<LocationPicker
								onSelectLocation={setLocation}
								initialLocation={location.address ? location : undefined}
							/>
							<UploadImage
								label='Company Logo'
								register={register('logoUrl', {
									validate: validateLogo,
								})}
								error={errors.logoUrl?.message}
								savedPreview={savedPreviews.logo}
								onDataChange={(preview, file) => handleImageData('logo', preview, file)}
							/>
							<AuthButton type='submit' text='Next' />
						</motion.div>
					)}
					{step === 1 && (
						<motion.div
							key='step-1'
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -40 }}
							transition={{ duration: 0.3 }}
							className='space-y-2'
						>
							<AuthInput
								type='text'
								placeholder='Admin Name'
								register={register('adminName', { required: 'Admin name is required' })}
								error={errors.adminName?.message}
							/>
							<AuthInput
								type='email'
								placeholder='Admin Email'
								register={register('adminEmail', { required: 'Admin email is required' })}
								error={errors.adminEmail?.message}
							/>
							<AuthInput
								type='password'
								placeholder='Admin Password'
								register={register('adminPassword', {
									required: 'Admin password is required',
								})}
								error={errors.adminPassword?.message}
							/>
							<AuthInput
								type='password'
								placeholder='Confirm Password'
								register={register('confirmPassword', {
									required: 'Confirm password is required',
									validate: validatePasswordMatch,
								})}
								error={errors.confirmPassword?.message}
							/>
							<UploadImage
								label='Admin avatar'
								register={register('avatarUrl', {
									validate: validateAvatar,
								})}
								error={errors.avatarUrl?.message}
								savedPreview={savedPreviews.avatar}
								onDataChange={(preview, file) => handleImageData('avatar', preview, file)}
							/>
							<div className='flex justify-between gap-4'>
								<AuthButton type='button' text='Back' onClick={() => setStep(0)} />
								<AuthButton type='submit' text='Submit' />
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</AuthLayout>
	)
}

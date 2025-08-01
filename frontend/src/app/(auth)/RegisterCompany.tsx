'use client'

import { AuthButton } from '@/components/Auth/AuthButton'
import { AuthInput } from '@/components/Auth/AuthInput'
import { LocationPicker } from '@/components/Auth/LocationPicker'
import { UploadImage } from '@/components/UploadImage/UploadImage'
import { registerCompany } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
	logoUrl: FileList
	avatarUrl: FileList
}

export const RegisterCompany = () => {
	const [step, setStep] = useState<0 | 1>(0)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormValues>()
	const router = useRouter()
	const [location, setLocation] = useState<{
		lat: number
		lng: number
		address: string
	} | null>(null)

	const onSubmit = async (data: IFormValues) => {
		if (step === 0) {
			if (!location) {
				alert('Please select a location')
				return
			}
			setStep(1)
			return
		}

		const formData = new FormData()
		formData.append('name', data.name)
		formData.append('subdomain', data.subdomain)
		formData.append('address', data.address)
		formData.append('latitude', String(data.latitude))
		formData.append('longitude', String(data.longitude))
		formData.append('adminName', data.adminName)
		formData.append('adminEmail', data.adminEmail)
		formData.append('adminPassword', data.adminPassword)
		formData.append('logoUrl', data.logoUrl[0])
		formData.append('avatarUrl', data.avatarUrl[0])

		const response = await registerCompany(formData)
		localStorage.setItem('token', response.access_token)
	}

	return (
		<AuthLayout
			title='Register Company'
			onSubmit={handleSubmit(onSubmit)}
			encType='multipart/form-data'
		>
			{step === 0 && (
				<>
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
					<LocationPicker onSelectLocation={setLocation} />
					<UploadImage
						label='Company Logo'
						register={register('logoUrl', { required: 'Logo is required' })}
						error={errors.logoUrl?.message}
					/>
					<AuthButton type='submit' text='Next' />
				</>
			)}
			{step === 1 && (
				<>
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
						type='text'
						placeholder='Admin Password'
						register={register('adminPassword', {
							required: 'Admin password is required',
						})}
						error={errors.adminPassword?.message}
					/>
					<UploadImage
						label='Admin avatar'
						register={register('avatarUrl', { required: 'Avatar is required' })}
						error={errors.avatarUrl?.message}
					/>
					<div className='flex justify-between gap-4'>
						<AuthButton type='button' text='Back' onClick={() => setStep(0)} />
						<AuthButton type='submit' text='Submit' />
					</div>
				</>
			)}
		</AuthLayout>
	)
}

// {
//   "name": "string",
//   "subdomain": "string",
//   "address": "string",
//   "latitude": 50.4501,
//   "longitude": 30.5234,
//   "adminName": "string",
//   "adminEmail": "string",
//   "adminPassword": "string"
// }

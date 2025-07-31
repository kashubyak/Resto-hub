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
			<AuthButton type='submit' text='Submit' />
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

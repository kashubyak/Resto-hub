'use client'

import { AuthButton } from '@/components/Auth/AuthButton'
import { AuthInput } from '@/components/Auth/AuthInput'
import { LocationPicker } from '@/components/Auth/LocationPicker'
import { UploadImage } from '@/components/UploadImage/UploadImage'
import { registerCompany } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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

export default function RegisterCompanyPage() {
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
		<div className='w-screen h-screen bg-background text-foreground flex items-center justify-center p-4'>
			<div className='w-full max-w-xl bg-muted border border-border text-muted-foreground rounded-xl shadow-xl max-h-10/12 overflow-y-auto p-6'>
				<h1 className='text-primary text-2xl font-semibold mb-2 text-center'>
					Register Company
				</h1>
				<form
					onSubmit={handleSubmit(onSubmit)}
					encType='multipart/form-data'
					className='space-y-2.5 py-2'
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
					<UploadImage
						label='Company Logo'
						register={register('logoUrl', { required: 'Logo is required' })}
						error={errors.logoUrl?.message}
					/>
					<LocationPicker onSelectLocation={setLocation} />
					<AuthButton type='submit' text='Submit' />

					{location && (
						<div className='text-sm text-gray-300'>
							<p>
								📍 Координати: {location.lat}, {location.lng}
							</p>
							<p>🏠 Адреса: {location.address}</p>
						</div>
					)}
				</form>
			</div>
		</div>
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

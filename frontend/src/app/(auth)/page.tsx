'use client'

import { registerCompany } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

type FormValues = {
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
	} = useForm<FormValues>()
	const router = useRouter()

	const onSubmit = async (data: FormValues) => {
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
		<div>
			<h1 className='text-amber-500'>Register Company</h1>
			<form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'></form>
		</div>
	)
}

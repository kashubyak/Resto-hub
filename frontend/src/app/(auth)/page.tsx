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
		<div className='w-screen h-screen bg-background text-foreground flex items-center justify-center p-4'>
			<div className='w-full max-w-xl bg-muted border border-border text-muted-foreground rounded-xl shadow-xl max-h-full overflow-y-auto p-6'>
				<h1 className='text-primary text-2xl font-semibold mb-4 text-center'>
					Register Company
				</h1>
				<form
					onSubmit={handleSubmit(onSubmit)}
					encType='multipart/form-data'
					className='space-y-4'
				>
					<input
						className='w-full p-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground'
						placeholder='Company Name'
					/>
					<button
						type='submit'
						className='w-full bg-primary text-primary-foreground hover:bg-primary active:bg-active py-2 px-4 rounded-md font-semibold'
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	)
}

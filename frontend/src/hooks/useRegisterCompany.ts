import { registerCompany } from '@/services/company.service'
import { useEffect, useState } from 'react'
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
	confirmPassword: string
	logoUrl: FileList
	avatarUrl: FileList
}

export const useRegisterCompany = () => {
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
			if (type === 'logo') clearErrors('logoUrl')
			else clearErrors('avatarUrl')
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
		try {
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
			if (response.status == 201) {
			}
		} catch {}
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

	return {
		handleSubmit,
		onSubmit,
		step,
		setStep,
		hasMounted,
		register,
		errors,
		setLocation,
		validateLogo,
		validateAvatar,
		validatePasswordMatch,
		savedPreviews,
		handleImageData,
		location,
	}
}

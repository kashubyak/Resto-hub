import { ROUTES } from '@/constants/pages.constant'
import { useAlert } from '@/providers/AlertContext'
import { useAuth } from '@/providers/AuthContext'
import { registerCompany } from '@/services/auth/company.service'
import type { IAxiosError } from '@/types/error.interface'
import { getCompanyUrl } from '@/utils/api'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

export interface IFormValues {
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
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { login } = useAuth()
	const { showBackendError } = useAlert()

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

	const [location, setLocation] = useState<{
		lat: number
		lng: number
		address: string
	}>({
		lat: 0,
		lng: 0,
		address: '',
	})

	const [locationError, setLocationError] = useState<string | null>(null)

	const STEP_1_FIELDS: (keyof IFormValues)[] = ['name', 'subdomain', 'logoUrl']
	const STEP_2_FIELDS: (keyof IFormValues)[] = [
		'adminName',
		'adminEmail',
		'adminPassword',
		'confirmPassword',
		'avatarUrl',
	]

	const {
		register,
		control,
		trigger,
		getValues,
		formState: { errors },
		watch,
		setValue,
		clearErrors,
	} = useForm<IFormValues>({
		mode: 'onChange',
	})

	const createFileList = (file: File): FileList => {
		const dt = new DataTransfer()
		dt.items.add(file)
		return dt.files
	}

	const handleImageData = useCallback(
		(type: 'logo' | 'avatar', preview: string | null, file: File | null) => {
			setSavedPreviews((prev) => ({
				...prev,
				[type]: preview,
			}))
			setSavedFiles((prev) => ({
				...prev,
				[type]: file,
			}))

			const emptyFileList = new DataTransfer().files
			if (type === 'logo') {
				setValue('logoUrl', file ? createFileList(file) : emptyFileList)
				if (file) clearErrors('logoUrl')
			} else {
				setValue('avatarUrl', file ? createFileList(file) : emptyFileList)
				if (file) clearErrors('avatarUrl')
			}
		},
		[clearErrors, setValue],
	)

	const handleStep0Submit = useCallback(async () => {
		const valid = await trigger(STEP_1_FIELDS)
		if (!valid) return
		if (!location.address) {
			setLocationError('Please select a location')
			return
		}
		setLocationError(null)
		setValue('address', location.address)
		setValue('latitude', location.lat)
		setValue('longitude', location.lng)
		setStep(1)
		clearErrors()
	}, [trigger, location, setValue, setStep, setLocationError, clearErrors])

	const submitRegistration = useCallback(
		async (data: IFormValues) => {
			setIsSubmitting(true)
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

				if (response.status === 201) {
					await login(
						{
							subdomain: data.subdomain,
							email: data.adminEmail,
							password: data.adminPassword,
						},
						{ skipGetCurrentUser: true },
					)

					window.location.href = `${getCompanyUrl(data.subdomain)}${ROUTES.PUBLIC.AUTH.REGISTER_SUCCESS}?subdomain=${data.subdomain}`
				}
			} catch (err) {
				showBackendError(err as IAxiosError)
			} finally {
				setIsSubmitting(false)
			}
		},
		[location, savedFiles, login, showBackendError],
	)

	const handleStep1Submit = useCallback(async () => {
		const valid = await trigger(STEP_2_FIELDS)
		if (!valid) return
		const data = getValues()
		await submitRegistration(data)
	}, [trigger, getValues, submitRegistration])

	const validateLogo = useCallback(() => {
		const logoFiles = watch('logoUrl')
		return (
			(logoFiles && logoFiles.length > 0) ||
			savedFiles.logo !== null ||
			'Logo is required'
		)
	}, [watch, savedFiles.logo])

	const validateAvatar = useCallback(() => {
		const avatarFiles = watch('avatarUrl')
		return (
			(avatarFiles && avatarFiles.length > 0) ||
			savedFiles.avatar !== null ||
			'Avatar is required'
		)
	}, [watch, savedFiles.avatar])

	const validatePasswordMatch = useCallback(
		(value: string) => {
			const password = watch('adminPassword')
			return password === value || 'Passwords do not match'
		},
		[watch],
	)

	return {
		handleStep0Submit,
		handleStep1Submit,
		isSubmitting,
		step,
		setStep,
		register,
		control,
		watch,
		errors,
		setLocation,
		validateLogo,
		validateAvatar,
		validatePasswordMatch,
		savedPreviews,
		handleImageData,
		location,
		locationError,
		setLocationError,
	}
}

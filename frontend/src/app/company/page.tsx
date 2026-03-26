'use client'

import { AuthTextField } from '@/components/auth/AuthFields'
import { LocationSearch } from '@/components/auth/LocationSearch'
import { SafeRender } from '@/components/container/SafeRender'
import { UploadImage } from '@/components/elements/UploadImage'
import { Button } from '@/components/ui/Button'
import { RoleGuard } from '@/components/ui/RoleGuard'
import { ROUTES, UserRole } from '@/constants/pages.constant'
import { COMPANY_QUERY_KEY } from '@/constants/query-keys.constant'
import { companyQueryKey, useCompanySettings } from '@/hooks/useCompanySettings'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useAlert } from '@/providers/AlertContext'
import { useAuth } from '@/providers/AuthContext'
import { deleteCompanyService } from '@/services/company/delete-company.service'
import { getCompanyService } from '@/services/company/get-company.service'
import {
	buildUpdateCompanyFormData,
	updateCompanyService,
} from '@/services/company/update-company.service'
import type { ICompanyInfo } from '@/types/company.interface'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '@/utils/errorHandler'
import { CompanyNameValidation } from '@/validation/register.validation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, Loader2, MapPin, Save, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DeleteCompanyDialog } from './components/DeleteCompanyDialog'

const Map = dynamic(
	() => import('@/components/auth/Map').then((m) => ({ default: m.Map })),
	{ ssr: false },
)

const FORM_ID = 'company-edit-form'

const addressRules = {
	required: 'Address is required',
	validate: {
		minLength: (value: string) =>
			value.trim().length >= 3 || 'Address must be at least 3 characters',
		maxLength: (value: string) =>
			value.length <= 500 || 'Address must be at most 500 characters',
	},
} as const

interface ICompanyFormValues {
	name: string
	address: string
}

export default function CompanyPage() {
	const { hasRole } = useCurrentUser()
	const queryClient = useQueryClient()
	const { showError, showSuccess } = useAlert()
	const { logout } = useAuth()
	const queryEnabled = hasRole(UserRole.ADMIN)
	const { companyUrl, copied, handleCopy } = useCompanySettings(queryEnabled)

	const { data: company, isLoading: isLoadingCompany } = useQuery({
		queryKey: companyQueryKey,
		queryFn: async () => {
			const response = await getCompanyService()
			return response.data as ICompanyInfo
		},
		enabled: queryEnabled,
		staleTime: 5 * 60_000,
	})

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
		setValue,
	} = useForm<ICompanyFormValues>({
		mode: 'onChange',
		defaultValues: { name: '', address: '' },
	})

	const watchedName = watch('name')
	const watchedAddress = watch('address')

	const [location, setLocation] = useState<{
		lat: number
		lng: number
		address: string
	}>({ lat: 0, lng: 0, address: '' })
	const [locationError, setLocationError] = useState<string | null>(null)
	const [logoFile, setLogoFile] = useState<File | null>(null)
	const [logoPreview, setLogoPreview] = useState<string | null>(null)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	useLayoutEffect(() => {
		if (!company) return
		reset({
			name: company.name,
			address: company.address ?? '',
		})
		setLocation({
			lat: company.latitude,
			lng: company.longitude,
			address: company.address ?? '',
		})
		setLogoFile(null)
		setLogoPreview(null)
	}, [company, reset])

	/** Same rule as RegisterCompany map: pin only when address is set (cleared form → no fallback pin). */
	const mapCenterAndMarker = useMemo((): [number, number] | undefined => {
		if (!location.address?.trim()) return undefined
		if (
			Number.isFinite(location.lat) &&
			Number.isFinite(location.lng) &&
			(location.lat !== 0 || location.lng !== 0)
		)
			return [location.lat, location.lng]
		if (
			company &&
			Number.isFinite(company.latitude) &&
			Number.isFinite(company.longitude) &&
			(company.latitude !== 0 || company.longitude !== 0)
		)
			return [company.latitude, company.longitude]
		return undefined
	}, [
		location.address,
		location.lat,
		location.lng,
		company?.latitude,
		company?.longitude,
	])

	const hasChanges = useMemo(() => {
		if (!company) return false
		if (logoFile) return true
		if (watchedName.trim() !== company.name) return true
		const companyAddr = (company.address ?? '').trim()
		if (watchedAddress.trim() !== companyAddr) return true
		if (location.lat !== company.latitude || location.lng !== company.longitude)
			return true
		return false
	}, [
		company,
		watchedName,
		watchedAddress,
		location.lat,
		location.lng,
		logoFile,
	])

	const onLogoDataChange = useCallback(
		(preview: string | null, file: File | null) => {
			setLogoPreview(preview)
			setLogoFile(file)
		},
		[],
	)

	const onLocationClear = useCallback(() => {
		setLocation({ lat: 0, lng: 0, address: '' })
		setLocationError(null)
		setValue('address', '')
	}, [setValue])

	const onLocationSelect = useCallback(
		(lat: number, lng: number, address: string) => {
			setLocation({ lat, lng, address })
			setValue('address', address, { shouldValidate: true })
			setLocationError(null)
		},
		[setValue],
	)

	const updateMutation = useMutation({
		mutationFn: (formData: FormData) => updateCompanyService(formData),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: [COMPANY_QUERY_KEY.CURRENT],
			})
			showSuccess('Company updated successfully')
			setLogoFile(null)
			setLogoPreview(null)
		},
		onError: (err) => {
			showError(parseBackendError(err as unknown as IAxiosError).join('\n'))
		},
	})

	const deleteMutation = useMutation({
		mutationFn: deleteCompanyService,
		onSuccess: async () => {
			await logout()
		},
		onError: (err) => {
			showError(parseBackendError(err as unknown as IAxiosError).join('\n'))
		},
	})

	const onSubmit = handleSubmit(async (values) => {
		if (
			!location.address?.trim() ||
			(location.lat === 0 && location.lng === 0)
		) {
			setLocationError('Please select a location on the map')
			return
		}
		setLocationError(null)
		const formData = buildUpdateCompanyFormData({
			name: values.name.trim(),
			address: (values.address.trim() || location.address).trim(),
			latitude: location.lat,
			longitude: location.lng,
			logoFile: logoFile ?? undefined,
		})
		updateMutation.mutate(formData)
	})

	const logoDisplaySource = logoPreview ?? company?.logoUrl ?? null
	const actionsDisabled = updateMutation.isPending || deleteMutation.isPending

	return (
		<SafeRender title="Loading Company..." showNetworkProgress>
			<RoleGuard allowedRoles={[UserRole.ADMIN]}>
				<div className="max-w-[1600px] mx-auto w-full px-2 sm:px-4 py-4 sm:py-6 min-h-0 flex flex-col gap-6 animate-in fade-in-0 duration-500">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-foreground">
								Company settings
							</h1>
							<p className="text-sm text-muted-foreground mt-1">
								Manage your restaurant information and location
							</p>
						</div>
						{company && !isLoadingCompany ? (
							<div className="flex flex-wrap items-center gap-3">
								<button
									onClick={() => setShowDeleteConfirm(true)}
									disabled={actionsDisabled}
									className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<Trash2 className="w-5 h-5" />
									<span className="hidden sm:inline">Delete</span>
								</button>
								<button
									type="submit"
									form={FORM_ID}
									disabled={!hasChanges || updateMutation.isPending}
									className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{updateMutation.isPending ? (
										<>
											<Loader2 className="w-5 h-5 animate-spin" />
											<span>Saving…</span>
										</>
									) : (
										<>
											<Save className="w-5 h-5" />
											<span>Save changes</span>
										</>
									)}
								</button>
							</div>
						) : null}
					</div>

					{companyUrl ? (
						<div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm">
							<label className="block text-sm font-medium text-foreground mb-2">
								Company portal link
							</label>
							<div className="flex flex-col sm:flex-row gap-2">
								<input
									type="text"
									value={companyUrl}
									readOnly
									className="flex-1 px-4 py-2 rounded-lg border border-border bg-muted/30 text-foreground text-sm"
								/>
								<Button
									type="button"
									onClick={handleCopy}
									className="w-full sm:w-auto shrink-0"
								>
									{copied ? 'Copied!' : 'Copy'}
								</Button>
							</div>
							<p className="text-xs text-muted-foreground mt-2">
								Share with your team. Subdomain and legacy settings:{' '}
								<Link
									href={ROUTES.PRIVATE.ADMIN.SETTINGS_COMPANY}
									className="text-primary hover:underline font-medium"
								>
									Company settings
								</Link>
							</p>
						</div>
					) : null}

					{isLoadingCompany && !company ? (
						<div className="text-muted-foreground text-sm">Loading…</div>
					) : (
						<form
							id={FORM_ID}
							onSubmit={(e) => {
								e.preventDefault()
								void onSubmit()
							}}
							className="space-y-6"
						>
							<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
								<div className="space-y-6">
									<div className="bg-card border border-border rounded-2xl p-6">
										<div className="flex items-center gap-3 mb-6">
											<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
												<Building2 className="w-6 h-6 text-primary" />
											</div>
											<div>
												<h2 className="text-xl font-bold text-foreground">
													Company information
												</h2>
												<p className="text-sm text-muted-foreground">
													Basic details about your restaurant
												</p>
											</div>
										</div>

										<div className="space-y-4">
											<AuthTextField
												id="company-name"
												label="Company name"
												placeholder="Your company"
												autoComplete="organization"
												error={errors.name?.message}
												leftIcon={
													<Building2 className="h-5 w-5 text-muted-foreground" />
												}
												register={register('name', CompanyNameValidation)}
											/>

											<div>
												<UploadImage
													label="Company logo"
													savedPreview={logoDisplaySource}
													onDataChange={onLogoDataChange}
												/>
												<p className="text-xs text-muted-foreground mt-2">
													Leave empty to keep the current logo
												</p>
											</div>

											{company ? (
												<div className="pt-4 border-t border-border space-y-2">
													<div className="flex justify-between text-sm gap-4">
														<span className="text-muted-foreground shrink-0">
															Company ID
														</span>
														<span className="font-medium text-foreground text-right">
															#{company.id}
														</span>
													</div>
													<div className="flex justify-between text-sm gap-4">
														<span className="text-muted-foreground shrink-0">
															Created
														</span>
														<span className="font-medium text-foreground text-right">
															{new Date(company.createdAt).toLocaleDateString()}
														</span>
													</div>
													<div className="flex justify-between text-sm gap-4">
														<span className="text-muted-foreground shrink-0">
															Last updated
														</span>
														<span className="font-medium text-foreground text-right">
															{new Date(company.updatedAt).toLocaleDateString()}
														</span>
													</div>
												</div>
											) : null}
										</div>
									</div>

									<div className="bg-card border border-border rounded-2xl p-6">
										<div className="flex items-center gap-3 mb-6">
											<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
												<MapPin className="w-6 h-6 text-primary" />
											</div>
											<div>
												<h2 className="text-xl font-bold text-foreground">
													Location details
												</h2>
												<p className="text-sm text-muted-foreground">
													Address search and map on the right
												</p>
											</div>
										</div>

										<div className="space-y-4">
											<AuthTextField
												id="company-address"
												label="Address"
												placeholder="Address from map or type manually"
												autoComplete="street-address"
												error={errors.address?.message}
												register={register('address', addressRules)}
											/>

											<LocationSearch
												onLocationSelect={onLocationSelect}
												selectedLocation={
													location.address ? location.address : undefined
												}
												onClear={onLocationClear}
												error={locationError ?? undefined}
											/>

											{locationError ? (
												<p className="text-sm text-destructive">
													{locationError}
												</p>
											) : null}
										</div>
									</div>
								</div>

								<div className="bg-card border border-border rounded-2xl p-6 flex flex-col min-h-0">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
											<MapPin className="w-6 h-6 text-primary" />
										</div>
										<div>
											<h2 className="text-xl font-bold text-foreground">
												Interactive map
											</h2>
											<p className="text-sm text-muted-foreground">
												Click the map to set a precise location
											</p>
										</div>
									</div>
									<div className="relative w-full min-h-[400px] h-[600px] rounded-xl overflow-hidden border border-border">
										<Map
											center={mapCenterAndMarker}
											marker={mapCenterAndMarker}
											onLocationSelect={onLocationSelect}
										/>
									</div>
								</div>
							</div>
						</form>
					)}

					<DeleteCompanyDialog
						isOpen={showDeleteConfirm}
						companyName={company?.name ?? 'Company'}
						onClose={() => setShowDeleteConfirm(false)}
						onConfirm={() => deleteMutation.mutate()}
						isLoading={deleteMutation.isPending}
					/>
				</div>
			</RoleGuard>
		</SafeRender>
	)
}

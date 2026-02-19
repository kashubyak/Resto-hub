'use client'

import { AuthPasswordField, AuthTextField } from '@/components/auth/AuthFields'
import { BackgroundDecorations } from '@/components/auth/BackgroundDecorations'
import { LocationSearch } from '@/components/auth/LocationSearch'
import { MapPanel } from '@/components/auth/MapPanel'
import { UploadImage } from '@/components/elements/UploadImage'
import { ROUTES } from '@/constants/pages.constant'
import { useRegisterCompany } from '@/hooks/useRegisterCompany'
import {
	adminNameValidation,
	CompanyNameValidation,
	emailValidation,
	passwordValidation,
	subdomainValidation,
} from '@/validation/register.validation'
import { Building2, Lock, Mail, User } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { memo, useCallback, useState } from 'react'

const Map = dynamic(
	() => import('@/components/auth/Map').then((m) => ({ default: m.Map })),
	{ ssr: false },
)

const RegisterCompanyComponent = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const {
		handleSubmit,
		onSubmit,
		isSubmitting,
		step,
		setStep,
		register,
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
	} = useRegisterCompany()

	const goBack = useCallback(() => setStep(0), [setStep])

	const onLocationSelect = useCallback(
		(lat: number, lng: number, address: string) => {
			setLocation({ lat, lng, address })
			setLocationError(null)
		},
		[setLocation, setLocationError],
	)

	const onLogoChange = useCallback(
		(preview: string | null, file: File | null) =>
			handleImageData('logo', preview, file),
		[handleImageData],
	)
	const onAvatarChange = useCallback(
		(preview: string | null, file: File | null) =>
			handleImageData('avatar', preview, file),
		[handleImageData],
	)

	return (
		<div className="h-screen w-full flex flex-col bg-background relative overflow-hidden">
			<BackgroundDecorations />
			<div className="flex-1 w-full max-w-[1600px] mx-auto relative z-10 flex min-h-0 px-2 sm:px-4 py-4 sm:py-6">
				<div className="grid md:grid-cols-2 gap-4 lg:gap-6 items-stretch min-h-0 flex-1 w-full">
					{/* Register Form - scrollable column */}
					<div className="w-full max-w-md mx-auto md:mx-0 overflow-x-hidden overflow-y-auto flex flex-col min-h-0">
						<div className="text-center mb-4 sm:mb-6 flex-shrink-0">
							<div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mb-2 sm:mb-4">
								<Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
							</div>
							<h1 className="text-xl sm:text-3xl font-semibold text-foreground mb-1 sm:mb-2">
								Create an account
							</h1>
							<p className="text-sm sm:text-base text-muted-foreground">
								{step === 0 ? 'Company information' : 'Your details'}
							</p>
						</div>

						{/* Progress Indicator */}
						<div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 flex-shrink-0">
							<div
								className={`h-2 w-12 sm:w-16 rounded-full transition-all ${
									step === 0 ? 'bg-primary' : 'bg-primary'
								}`}
							/>
							<div
								className={`h-2 w-12 sm:w-16 rounded-full transition-all ${
									step === 1 ? 'bg-primary' : 'bg-border'
								}`}
							/>
						</div>

						<div className="bg-card rounded-xl sm:rounded-3xl shadow-lg border border-border/50 p-4 sm:p-8 backdrop-blur-sm flex-shrink-0">
							<form
								onSubmit={handleSubmit(onSubmit)}
								encType="multipart/form-data"
								className="space-y-4 sm:space-y-6"
							>
								{step === 0 ? (
									<>
										<AuthTextField
											id="name"
											label="Company name"
											placeholder="Your company"
											autoComplete="organization"
											error={errors.name?.message}
											leftIcon={<Building2 className="h-5 w-5 text-muted-foreground" />}
											register={register('name', CompanyNameValidation)}
										/>

										<AuthTextField
											id="subdomain"
											label="Subdomain"
											placeholder="your-company"
											error={errors.subdomain?.message}
											hint={
												(watch('subdomain') ?? '')
													? `${watch('subdomain') ?? ''}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'lvh.me'}`
													: 'Your unique login address'
											}
											register={register('subdomain', subdomainValidation)}
										/>

										<LocationSearch
											onLocationSelect={onLocationSelect}
											selectedLocation={
												location.address ? location.address : undefined
											}
											onClear={() => {
												setLocation({ lat: 0, lng: 0, address: '' })
												setLocationError(null)
											}}
											error={locationError ?? undefined}
										/>

										{/* Company Logo */}
										<div className="space-y-2">
											<UploadImage
												label="Company Logo"
												register={register('logoUrl', {
													validate: validateLogo,
												})}
												error={errors.logoUrl?.message}
												savedPreview={savedPreviews.logo}
												onDataChange={onLogoChange}
											/>
										</div>
									</>
								) : (
									<>
										<AuthTextField
											id="adminName"
											label="Full name"
											placeholder="John Doe"
											autoComplete="name"
											error={errors.adminName?.message}
											leftIcon={<User className="h-5 w-5 text-muted-foreground" />}
											register={register('adminName', adminNameValidation)}
										/>

										<AuthTextField
											id="adminEmail"
											label="Email"
											type="email"
											placeholder="your@email.com"
											error={errors.adminEmail?.message}
											leftIcon={<Mail className="h-5 w-5 text-muted-foreground" />}
											register={register('adminEmail', emailValidation)}
										/>

										<AuthPasswordField
											id="adminPassword"
											label="Password"
											error={errors.adminPassword?.message}
											leftIcon={<Lock className="h-5 w-5 text-muted-foreground" />}
											register={register('adminPassword', passwordValidation)}
											showPassword={showPassword}
											onTogglePassword={() => setShowPassword(!showPassword)}
										/>

										<AuthPasswordField
											id="confirmPassword"
											label="Confirm password"
											error={errors.confirmPassword?.message}
											leftIcon={<Lock className="h-5 w-5 text-muted-foreground" />}
											register={register('confirmPassword', {
												required: 'Please confirm your password',
												validate: {
													matchesPassword: validatePasswordMatch,
													notEmpty: (v) =>
														v.length > 0 ||
														'Password confirmation cannot be empty',
												},
											})}
											showPassword={showConfirmPassword}
											onTogglePassword={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
										/>

										{/* Admin Avatar */}
										<div className="space-y-2">
											<UploadImage
												label="Admin avatar"
												register={register('avatarUrl', {
													validate: validateAvatar,
												})}
												error={errors.avatarUrl?.message}
												savedPreview={savedPreviews.avatar}
												onDataChange={onAvatarChange}
											/>
										</div>
									</>
								)}

								<div className="flex gap-3">
									{step === 1 && (
										<button
											type="button"
											onClick={goBack}
											className="flex-1 py-3 px-4 bg-background border border-border rounded-xl font-medium text-foreground hover:bg-muted-hover focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
										>
											Back
										</button>
									)}
									<button
										type="submit"
										disabled={isSubmitting}
										className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none disabled:transform-none"
									>
										{step === 0 ? 'Continue' : isSubmitting ? 'Creating account...' : 'Create account'}
									</button>
								</div>
							</form>
						</div>

						<p className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground flex-shrink-0">
							Already have an account?{' '}
							<Link
								href={ROUTES.PUBLIC.AUTH.LOGIN}
								className="text-primary hover:text-primary-hover font-medium transition-colors"
							>
								Sign in
							</Link>
						</p>

						{/* Map on mobile */}
						<div className="md:hidden w-full min-h-[280px] flex-1 mt-6">
							<Map
								center={
									location.address
										? [location.lat, location.lng]
										: undefined
								}
								marker={
									location.address
										? [location.lat, location.lng]
										: undefined
								}
							/>
						</div>
					</div>

					<MapPanel
						step={step}
						location={
							location.address
								? {
										lat: location.lat,
										lng: location.lng,
										address: location.address,
									}
								: null
						}
						onLocationSelect={onLocationSelect}
						onLocationClear={() => {
							setLocation({ lat: 0, lng: 0, address: '' })
							setLocationError(null)
						}}
						onChangeLocation={goBack}
						error={locationError ?? undefined}
					/>
				</div>
			</div>
		</div>
	)
}

export const RegisterCompany = memo(RegisterCompanyComponent)

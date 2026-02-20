'use client'

import {
	AuthControllerTextField,
	AuthPasswordField,
	AuthTextField,
} from '@/components/auth/AuthFields'
import { BackgroundDecorations } from '@/components/auth/BackgroundDecorations'
import { LocationSearch } from '@/components/auth/LocationSearch'
import { MapPanel } from '@/components/auth/MapPanel'
import { UploadImage } from '@/components/elements/UploadImage'
import { ROUTES } from '@/constants/pages.constant'
import {
	useRegisterCompany,
	type IFormValues,
} from '@/hooks/useRegisterCompany'
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
import type { RegisterOptions } from 'react-hook-form'

const Map = dynamic(
	() => import('@/components/auth/Map').then((m) => ({ default: m.Map })),
	{ ssr: false },
)

const RegisterCompanyComponent = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const {
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
								onSubmit={(e) => {
									e.preventDefault()
									if (step === 0) handleStep0Submit()
									else handleStep1Submit()
								}}
								method="post"
								action="#"
								encType="multipart/form-data"
								autoComplete="on"
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
											leftIcon={
												<Building2 className="h-5 w-5 text-muted-foreground" />
											}
											register={register('name', CompanyNameValidation)}
										/>

										<AuthTextField
											id="subdomain"
											label="Subdomain"
											placeholder="your-company"
											autoComplete="off"
											error={errors.subdomain?.message}
											hint={
												(watch('subdomain') ?? '')
													? `${watch('subdomain') ?? ''}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'lvh.me'}`
													: 'Your unique login address'
											}
											register={register('subdomain', subdomainValidation)}
										/>

										<div className="relative z-10">
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
										</div>

										{/* Map on mobile - only step 0, right after location search */}
										<div className="md:hidden w-full mt-4 space-y-2 relative z-0">
											<p className="text-sm text-muted-foreground">
												Or tap on the map to select location
											</p>
											<div className="w-full h-[280px] rounded-xl overflow-hidden relative">
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
													onLocationSelect={onLocationSelect}
												/>
											</div>
										</div>

										{/* Company Logo */}
										<div className="space-y-2">
											<UploadImage
												key="company-logo"
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
										<AuthControllerTextField
											control={control}
											name="adminName"
											rules={
												adminNameValidation as RegisterOptions<IFormValues>
											}
											id="adminName"
											label="Full name"
											autocompleteName="name"
											type="text"
											autoComplete="name"
											placeholder="John Doe"
											leftIcon={
												<User className="h-5 w-5 text-muted-foreground" />
											}
											error={errors.adminName?.message}
										/>

										<AuthControllerTextField
											control={control}
											name="adminEmail"
											rules={emailValidation as RegisterOptions<IFormValues>}
											id="adminEmail"
											label="Email"
											autocompleteName="email"
											type="email"
											autoComplete="email"
											placeholder="your@email.com"
											leftIcon={
												<Mail className="h-5 w-5 text-muted-foreground" />
											}
											error={errors.adminEmail?.message}
										/>

										<AuthPasswordField
											id="adminPassword"
											label="Password"
											autoComplete="new-password"
											error={errors.adminPassword?.message}
											leftIcon={
												<Lock className="h-5 w-5 text-muted-foreground" />
											}
											register={register('adminPassword', passwordValidation)}
											showPassword={showPassword}
											onTogglePassword={() => setShowPassword(!showPassword)}
										/>

										<AuthPasswordField
											id="confirmPassword"
											label="Confirm password"
											autoComplete="new-password"
											error={errors.confirmPassword?.message}
											leftIcon={
												<Lock className="h-5 w-5 text-muted-foreground" />
											}
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
												key="admin-avatar"
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
									{step === 0 ? (
										<button
											type="button"
											onClick={handleStep0Submit}
											className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
										>
											Continue
										</button>
									) : (
										<button
											type="button"
											onClick={handleStep1Submit}
											disabled={isSubmitting}
											className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none disabled:transform-none"
										>
											{isSubmitting ? 'Creating account...' : 'Create account'}
										</button>
									)}
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

'use client'

import dynamic from 'next/dynamic'
import { BackgroundDecorations } from '@/components/auth/BackgroundDecorations'
import { LocationSearch } from '@/components/auth/LocationSearch'
import { MapPanel } from '@/components/auth/MapPanel'

const Map = dynamic(
	() => import('@/components/auth/Map').then((m) => ({ default: m.Map })),
	{ ssr: false },
)
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
import { AlertCircle, Building2, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { memo, useCallback, useState } from 'react'

const inputBase =
	'w-full pl-12 pr-4 py-3 bg-input rounded-xl border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all'
const inputError =
	'border-red-500 focus:border-red-500 focus:ring-red-500/20'
const inputNormal = 'border-border focus:border-primary focus:ring-primary/20'

const RegisterCompanyComponent = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const {
		handleSubmit,
		onSubmit,
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
										{/* Company Name */}
										<div className="space-y-2">
											<label
												htmlFor="name"
												className="block text-sm font-medium text-card-foreground"
											>
												Company name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<Building2 className="h-5 w-5 text-muted-foreground" />
												</div>
												<input
													id="name"
													type="text"
													{...register('name', CompanyNameValidation)}
													className={`${inputBase} ${
														errors.name ? inputError : inputNormal
													}`}
													placeholder="Your company"
												/>
											</div>
											{errors.name?.message && (
												<div className="flex items-center gap-1.5 text-red-500 mt-1">
													<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
													<p className="text-xs">{errors.name.message}</p>
												</div>
											)}
										</div>

										{/* Subdomain */}
										<div className="space-y-2">
											<label
												htmlFor="subdomain"
												className="block text-sm font-medium text-card-foreground"
											>
												Subdomain
											</label>
											<div className="relative">
												<input
													id="subdomain"
													type="text"
													{...register('subdomain', subdomainValidation)}
													className={`w-full pl-4 pr-4 py-3 bg-input rounded-xl border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
														errors.subdomain ? inputError : inputNormal
													}`}
													placeholder="your-company"
												/>
											</div>
											{errors.subdomain?.message && (
												<div className="flex items-center gap-1.5 text-red-500 mt-1">
													<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
													<p className="text-xs">{errors.subdomain.message}</p>
												</div>
											)}
											{!errors.subdomain?.message && (
												<p className="text-xs text-muted-foreground mt-1">
													{(watch('subdomain') ?? '')
														? `${watch('subdomain') ?? ''}.yourdomain.com`
														: 'Your unique login address'}
												</p>
											)}
										</div>

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
										{/* Admin Name */}
										<div className="space-y-2">
											<label
												htmlFor="adminName"
												className="block text-sm font-medium text-card-foreground"
											>
												Full name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<User className="h-5 w-5 text-muted-foreground" />
												</div>
												<input
													id="adminName"
													type="text"
													{...register('adminName', adminNameValidation)}
													className={`${inputBase} ${
														errors.adminName ? inputError : inputNormal
													}`}
													placeholder="John Doe"
												/>
											</div>
											{errors.adminName?.message && (
												<div className="flex items-center gap-1.5 text-red-500 mt-1">
													<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
													<p className="text-xs">{errors.adminName.message}</p>
												</div>
											)}
										</div>

										{/* Admin Email */}
										<div className="space-y-2">
											<label
												htmlFor="adminEmail"
												className="block text-sm font-medium text-card-foreground"
											>
												Email
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<Mail className="h-5 w-5 text-muted-foreground" />
												</div>
												<input
													id="adminEmail"
													type="email"
													{...register('adminEmail', emailValidation)}
													className={`${inputBase} ${
														errors.adminEmail ? inputError : inputNormal
													}`}
													placeholder="your@email.com"
												/>
											</div>
											{errors.adminEmail?.message && (
												<div className="flex items-center gap-1.5 text-red-500 mt-1">
													<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
													<p className="text-xs">{errors.adminEmail.message}</p>
												</div>
											)}
										</div>

										{/* Password */}
										<div className="space-y-2">
											<label
												htmlFor="adminPassword"
												className="block text-sm font-medium text-card-foreground"
											>
												Password
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<Lock className="h-5 w-5 text-muted-foreground" />
												</div>
												<input
													id="adminPassword"
													type={showPassword ? 'text' : 'password'}
													{...register('adminPassword', passwordValidation)}
													className={`w-full pl-12 pr-12 py-3 bg-input rounded-xl border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
														errors.adminPassword ? inputError : inputNormal
													}`}
													placeholder="••••••••"
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-card-foreground transition-colors"
												>
													{showPassword ? (
														<EyeOff className="h-5 w-5" />
													) : (
														<Eye className="h-5 w-5" />
													)}
												</button>
											</div>
											{errors.adminPassword?.message && (
												<div className="flex items-center gap-1.5 text-red-500 mt-1">
													<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
													<p className="text-xs">{errors.adminPassword.message}</p>
												</div>
											)}
										</div>

										{/* Confirm Password */}
										<div className="space-y-2">
											<label
												htmlFor="confirmPassword"
												className="block text-sm font-medium text-card-foreground"
											>
												Confirm password
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<Lock className="h-5 w-5 text-muted-foreground" />
												</div>
												<input
													id="confirmPassword"
													type={showConfirmPassword ? 'text' : 'password'}
													{...register('confirmPassword', {
														required: 'Please confirm your password',
														validate: {
															matchesPassword: validatePasswordMatch,
															notEmpty: (v) =>
																v.length > 0 ||
																'Password confirmation cannot be empty',
														},
													})}
													className={`w-full pl-12 pr-12 py-3 bg-input rounded-xl border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
														errors.confirmPassword ? inputError : inputNormal
													}`}
													placeholder="••••••••"
												/>
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword(!showConfirmPassword)
													}
													className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-card-foreground transition-colors"
												>
													{showConfirmPassword ? (
														<EyeOff className="h-5 w-5" />
													) : (
														<Eye className="h-5 w-5" />
													)}
												</button>
											</div>
											{errors.confirmPassword?.message && (
												<div className="flex items-center gap-1.5 text-red-500 mt-1">
													<AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
													<p className="text-xs">
														{errors.confirmPassword.message}
													</p>
												</div>
											)}
										</div>

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
										className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
									>
										{step === 0 ? 'Continue' : 'Create account'}
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

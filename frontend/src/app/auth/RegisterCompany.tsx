'use client'

import { AuthContainer } from '@/components/container/AuthContainer'
import { LocationPicker } from '@/components/elements/LocationPicker'
import { UploadImage } from '@/components/elements/UploadImage'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRegisterCompany } from '@/hooks/useRegisterCompany'
import {
	adminNameValidation,
	CompanyNameValidation,
	emailValidation,
	passwordValidation,
	subdomainValidation,
} from '@/validation/register.validation'
import { AnimatePresence, motion } from 'framer-motion'
import { memo, useCallback } from 'react'

const stepTransition = { duration: 0.3 }

const RegisterCompanyComponent = () => {
	const {
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
	} = useRegisterCompany()

	const goBack = useCallback(() => setStep(0), [setStep])
	const onLogoChange = useCallback(
		(preview: string | null, file: File | null) => handleImageData('logo', preview, file),
		[handleImageData],
	)
	const onAvatarChange = useCallback(
		(preview: string | null, file: File | null) =>
			handleImageData('avatar', preview, file),
		[handleImageData],
	)

	return (
		<AuthContainer
			title='Register Company'
			onSubmit={handleSubmit(onSubmit)}
			encType='multipart/form-data'
		>
			<AnimatePresence mode='wait'>
				{step === 0 && (
					<motion.div
						key='step-0'
						initial={hasMounted ? { opacity: 0, x: -40 } : false}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 40 }}
						transition={stepTransition}
						className='space-y-3'
					>
						<Input
							label='Company Name'
							register={register('name', CompanyNameValidation)}
							error={errors.name?.message}
						/>
						<Input
							label='Subdomain'
							register={register('subdomain', subdomainValidation)}
							error={errors.subdomain?.message}
						/>
						<LocationPicker
							onSelectLocation={setLocation}
							initialLocation={location.address ? location : undefined}
						/>
						<UploadImage
							label='Company Logo'
							register={register('logoUrl', { validate: validateLogo })}
							error={errors.logoUrl?.message}
							savedPreview={savedPreviews.logo}
							onDataChange={onLogoChange}
						/>
						<Button type='submit' text='Next' />
					</motion.div>
				)}

				{step === 1 && (
					<motion.div
						key='step-1'
						initial={{ opacity: 0, x: 40 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -40 }}
						transition={stepTransition}
						className='space-y-3'
					>
						<Input
							label='Admin Name'
							register={register('adminName', adminNameValidation)}
							error={errors.adminName?.message}
						/>
						<Input
							type='email'
							label='Admin Email'
							register={register('adminEmail', emailValidation)}
							error={errors.adminEmail?.message}
						/>
						<Input
							type='password'
							label='Admin Password'
							register={register('adminPassword', passwordValidation)}
							error={errors.adminPassword?.message}
						/>
						<Input
							type='password'
							label='Confirm Password'
							register={register('confirmPassword', {
								required: 'Please confirm your password',
								validate: {
									matchesPassword: validatePasswordMatch,
									notEmpty: v => v.length > 0 || 'Password confirmation cannot be empty',
								},
							})}
							error={errors.confirmPassword?.message}
						/>
						<UploadImage
							label='Admin avatar'
							register={register('avatarUrl', { validate: validateAvatar })}
							error={errors.avatarUrl?.message}
							savedPreview={savedPreviews.avatar}
							onDataChange={onAvatarChange}
						/>
						<div className='flex justify-between gap-4'>
							<Button type='button' text='Back' onClick={goBack} />
							<Button type='submit' text='Register' />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</AuthContainer>
	)
}

export const RegisterCompany = memo(RegisterCompanyComponent)

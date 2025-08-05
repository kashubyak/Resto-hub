'use client'

import { AuthButton } from '@/components/Auth/AuthButton'
import { AuthInput } from '@/components/Auth/AuthInput'
import { LocationPicker } from '@/components/Auth/LocationPicker'
import { UploadImage } from '@/components/UploadImage/UploadImage'
import { useRegisterCompany } from '@/hooks/useRegisterCompany'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthLayout } from './AuthLayout'

export const RegisterCompany = () => {
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

	return (
		<AuthLayout
			title='Register Company'
			onSubmit={handleSubmit(onSubmit)}
			encType='multipart/form-data'
		>
			<div className='min-h-[21.875rem]'>
				<AnimatePresence mode='wait'>
					{step === 0 && (
						<motion.div
							key='step-0'
							initial={hasMounted ? { opacity: 0, x: -40 } : false}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 40 }}
							transition={{ duration: 0.3 }}
							className='space-y-3'
						>
							<AuthInput
								type='text'
								label='Company Name'
								register={register('name', { required: 'Company name is required' })}
								error={errors.name?.message}
							/>
							<AuthInput
								type='text'
								label='Subdomain'
								register={register('subdomain', { required: 'Subdomain is required' })}
								error={errors.subdomain?.message}
							/>
							<LocationPicker
								onSelectLocation={setLocation}
								initialLocation={location.address ? location : undefined}
							/>
							<UploadImage
								label='Company Logo'
								register={register('logoUrl', {
									validate: validateLogo,
								})}
								error={errors.logoUrl?.message}
								savedPreview={savedPreviews.logo}
								onDataChange={(preview, file) => handleImageData('logo', preview, file)}
							/>
							<AuthButton type='submit' text='Next' />
						</motion.div>
					)}
					{step === 1 && (
						<motion.div
							key='step-1'
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -40 }}
							transition={{ duration: 0.3 }}
							className='space-y-3'
						>
							<AuthInput
								type='text'
								label='Admin Name'
								register={register('adminName', { required: 'Admin name is required' })}
								error={errors.adminName?.message}
							/>
							<AuthInput
								type='email'
								label='Admin Email'
								register={register('adminEmail', { required: 'Admin email is required' })}
								error={errors.adminEmail?.message}
							/>
							<AuthInput
								type='password'
								label='Admin Password'
								register={register('adminPassword', {
									required: 'Admin password is required',
								})}
								error={errors.adminPassword?.message}
							/>
							<AuthInput
								type='password'
								label='Confirm Password'
								register={register('confirmPassword', {
									required: 'Confirm password is required',
									validate: validatePasswordMatch,
								})}
								error={errors.confirmPassword?.message}
							/>
							<UploadImage
								label='Admin avatar'
								register={register('avatarUrl', {
									validate: validateAvatar,
								})}
								error={errors.avatarUrl?.message}
								savedPreview={savedPreviews.avatar}
								onDataChange={(preview, file) => handleImageData('avatar', preview, file)}
							/>
							<div className='flex justify-between gap-4'>
								<AuthButton type='button' text='Back' onClick={() => setStep(0)} />
								<AuthButton type='submit' text='Register' />
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</AuthLayout>
	)
}

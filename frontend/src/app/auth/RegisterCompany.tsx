'use client'

import { LocationPicker } from '@/components/elements/LocationPicker'
import { UploadImage } from '@/components/elements/UploadImage'
import { AuthButton } from '@/components/ui/AuthButton'
import { AuthInput } from '@/components/ui/AuthInput'
import { useRegisterCompany } from '@/hooks/useRegisterCompany'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthContainer } from '../../components/container/AuthContainer'

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
		<AuthContainer
			title='Register Company'
			onSubmit={handleSubmit(onSubmit)}
			encType='multipart/form-data'
			isLogin={false}
		>
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
							register={register('name', {
								required: 'Company name is required',
								validate: {
									minLength: value =>
										value.length >= 2 || 'Company name must be at least 2 characters',
									maxLength: value =>
										value.length <= 100 || 'Company name must be at most 100 characters',
									noOnlySpaces: value =>
										value.trim().length > 0 || 'Company name cannot contain only spaces',
									validCharacters: value =>
										/^[a-zA-Z0-9\s\-&.,'()]+$/.test(value) ||
										'Company name can only contain letters, numbers, spaces, and basic punctuation',
									noConsecutiveSpaces: value =>
										!/\s{2,}/.test(value) ||
										'Company name cannot have consecutive spaces',
									startsWithLetter: value =>
										/^[a-zA-Z]/.test(value) || 'Company name must start with a letter',
									noSpecialAtStart: value =>
										!/^[\s\-&.,'()]/.test(value) ||
										'Company name cannot start with special characters',
								},
							})}
							error={errors.name?.message}
						/>
						<AuthInput
							type='text'
							label='Subdomain'
							register={register('subdomain', {
								required: 'Subdomain is required',
								validate: {
									lowerCase: value =>
										/^[a-z0-9]+$/.test(value) ||
										'Only lowercase letters and numbers allowed',
									startsWithLetter: value =>
										/^[a-z]/.test(value) || 'Subdomain must start with a letter',
									endsWithAlphanumeric: value =>
										/[a-z0-9]$/.test(value) ||
										'Subdomain must end with a letter or number',
									minLength: value =>
										value.length >= 3 || 'Subdomain must be at least 3 characters',
									maxLength: value =>
										value.length <= 30 || 'Subdomain must be at most 30 characters',
									noConsecutiveNumbers: value =>
										!/\d{4,}/.test(value) ||
										'Subdomain cannot have more than 3 consecutive numbers',
									notReserved: value => {
										const reserved = [
											'www',
											'api',
											'admin',
											'mail',
											'ftp',
											'blog',
											'test',
											'dev',
											'staging',
											'prod',
											'production',
										]
										return (
											!reserved.includes(value.toLowerCase()) ||
											'This subdomain is reserved'
										)
									},
									balanced: value => {
										const letters = (value.match(/[a-z]/g) || []).length
										const numbers = (value.match(/[0-9]/g) || []).length
										return letters >= 2 || 'Subdomain must contain at least 2 letters'
									},
								},
							})}
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
							register={register('adminName', {
								required: 'Admin name is required',
								validate: {
									minLength: value =>
										value.length >= 2 || 'Admin name must be at least 2 characters',
									maxLength: value =>
										value.length <= 50 || 'Admin name must be at most 50 characters',
									noOnlySpaces: value =>
										value.trim().length > 0 || 'Admin name cannot contain only spaces',
									validCharacters: value =>
										/^[a-zA-ZА-Яа-яІіЇїЄє\s\-']+$/.test(value) ||
										'Admin name can only contain letters, spaces, hyphens, and apostrophes',
									noConsecutiveSpaces: value =>
										!/\s{2,}/.test(value) || 'Admin name cannot have consecutive spaces',
									startsWithLetter: value =>
										/^[a-zA-ZА-Яа-яІіЇїЄє]/.test(value) ||
										'Admin name must start with a letter',
									endsWithLetter: value =>
										/[a-zA-ZА-Яа-яІіЇїЄє]$/.test(value) ||
										'Admin name must end with a letter',
									noSpecialAtStartEnd: value =>
										!/^[\s\-']|[\s\-']$/.test(value) ||
										'Admin name cannot start or end with special characters',
									hasValidName: value => {
										const words = value.trim().split(/\s+/)
										return (
											(words.length >= 1 && words.length <= 4) ||
											'Admin name should have 1-4 words'
										)
									},
								},
							})}
							error={errors.adminName?.message}
						/>
						<AuthInput
							type='email'
							label='Admin Email'
							register={register('adminEmail', {
								required: 'Admin email is required',
								validate: {
									validEmail: value => {
										const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
										return emailRegex.test(value) || 'Please enter a valid email address'
									},
									minLength: value => value.length >= 5 || 'Email address is too short',
									maxLength: value => value.length <= 254 || 'Email address is too long',
									noConsecutiveDots: value =>
										!/\.{2,}/.test(value) || 'Email cannot have consecutive dots',
									validLocalPart: value => {
										const localPart = value.split('@')[0]
										return (
											(localPart && localPart.length <= 64) ||
											'Email local part is too long'
										)
									},
									validDomain: value => {
										const parts = value.split('@')
										if (parts.length !== 2) return 'Invalid email format'
										const domain = parts[1]
										return (
											(domain &&
												domain.includes('.') &&
												!domain.startsWith('.') &&
												!domain.endsWith('.')) ||
											'Invalid email domain'
										)
									},
									noSpaces: value => !/\s/.test(value) || 'Email cannot contain spaces',
									startsCorrectly: value =>
										!/^[.\-_]/.test(value) ||
										'Email cannot start with dot, dash, or underscore',
									commonDomains: value => {
										const domain = value.split('@')[1]?.toLowerCase()
										const suspicious = ['tempmail', '10minutemail', 'guerrillamail']
										return (
											!suspicious.some(s => domain?.includes(s)) ||
											'Please use a permanent email address'
										)
									},
								},
							})}
							error={errors.adminEmail?.message}
						/>
						<AuthInput
							type='password'
							label='Admin Password'
							register={register('adminPassword', {
								required: 'Admin password is required',
								validate: {
									minLength: value =>
										value.length >= 8 || 'Password must be at least 8 characters long',
									maxLength: value =>
										value.length <= 128 || 'Password must be at most 128 characters long',
									hasUppercase: value =>
										/[A-Z]/.test(value) ||
										'Password must contain at least one uppercase letter',
									hasLowercase: value =>
										/[a-z]/.test(value) ||
										'Password must contain at least one lowercase letter',
									hasNumber: value =>
										/\d/.test(value) || 'Password must contain at least one number',
									hasSpecialChar: value =>
										/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) ||
										'Password must contain at least one special character',
									noSpaces: value =>
										!/\s/.test(value) || 'Password cannot contain spaces',
									noSequential: value =>
										!/123|abc|qwerty|password|admin/i.test(value) ||
										'Password cannot contain common sequences',
									notTooRepetitive: value => {
										const chars = value.split('')
										const unique = new Set(chars)
										return (
											unique.size >= Math.min(4, value.length / 2) ||
											'Password has too many repeated characters'
										)
									},
									validCharacters: value =>
										/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(value) ||
										'Password contains invalid characters',
								},
							})}
							error={errors.adminPassword?.message}
						/>
						<AuthInput
							type='password'
							label='Confirm Password'
							register={register('confirmPassword', {
								required: 'Please confirm your password',
								validate: {
									matchesPassword: validatePasswordMatch,
									notEmpty: value =>
										value.length > 0 || 'Password confirmation cannot be empty',
								},
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
		</AuthContainer>
	)
}

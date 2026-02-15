'use client'

import { AuthPasswordField, AuthTextField } from '@/components/auth/AuthFields'
import { BackgroundDecorations } from '@/components/auth/BackgroundDecorations'
import { ROUTES } from '@/constants/pages.constant'
import { useLogin } from '@/hooks/useLogin'
import { emailValidation, passwordValidation } from '@/validation/login.validation'
import { subdomainValidation } from '@/validation/register.validation'
import { Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { memo, useState } from 'react'

const LoginComponent = () => {
	const [showPassword, setShowPassword] = useState(false)
	const { register, handleSubmit, errors, onSubmit } = useLogin()

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-background px-2 sm:px-4 py-4 sm:py-8 relative overflow-hidden">
			<BackgroundDecorations />
			<div className="w-full max-w-md relative z-10">
				{/* Logo/Brand Area */}
				<div className="text-center mb-4 sm:mb-8">
					<div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mb-2 sm:mb-4">
						<Lock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
					</div>
					<h1 className="text-xl sm:text-3xl font-semibold text-foreground mb-1 sm:mb-2">
						Welcome back
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						Sign in to continue
					</p>
				</div>

				{/* Login Form Card */}
				<div className="bg-card rounded-xl sm:rounded-3xl shadow-lg border border-border/50 p-4 sm:p-8 backdrop-blur-sm">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
						<AuthTextField
							id="subdomain"
							label="Subdomain"
							placeholder="your-company"
							error={errors.subdomain?.message}
							register={register('subdomain', subdomainValidation)}
						/>

						<AuthTextField
							id="email"
							label="Email"
							type="email"
							placeholder="your@email.com"
							error={errors.email?.message}
							leftIcon={<Mail className="h-5 w-5 text-muted-foreground" />}
							register={register('email', emailValidation)}
						/>

						<AuthPasswordField
							id="password"
							label="Password"
							error={errors.password?.message}
							leftIcon={<Lock className="h-5 w-5 text-muted-foreground" />}
							register={register('password', passwordValidation)}
							showPassword={showPassword}
							onTogglePassword={() => setShowPassword(!showPassword)}
							rightLabel={
								<button
									type="button"
									className="text-sm text-primary hover:text-primary-hover transition-colors"
								>
									Forgot password?
								</button>
							}
						/>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
						>
							Sign in
						</button>
					</form>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-card text-muted-foreground">or</span>
						</div>
					</div>

					{/* Social Login Buttons */}
					<div className="space-y-3">
						<button
							type="button"
							className="w-full py-3 px-4 bg-background border border-border rounded-xl font-medium text-foreground hover:bg-muted-hover focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all flex items-center justify-center gap-3"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Continue with Google
						</button>
					</div>
				</div>

				{/* Sign Up Link */}
				<p className="text-center mt-6 text-muted-foreground">
					Don&apos;t have an account?{' '}
					<Link
						href={ROUTES.PUBLIC.AUTH.REGISTER}
						className="text-primary hover:text-primary-hover font-medium transition-colors"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	)
}

export const Login = memo(LoginComponent)

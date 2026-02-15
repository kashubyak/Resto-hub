'use client'

import { Button } from '@/components/ui/Button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { getCompanyUrl } from '@/utils/api'
import { memo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const RegisterCompanySuccessComponent = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { copy, copied } = useCopyToClipboard()

	const subdomain = searchParams.get('subdomain') || ''
	const companyUrl = subdomain ? getCompanyUrl(subdomain) : ''

	const handleCopy = useCallback(() => {
		if (companyUrl) copy(companyUrl)
	}, [companyUrl, copy])

	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50'>
			<div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full'>
				<div className='text-center mb-6'>
					<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<svg
							className='w-8 h-8 text-green-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
					</div>
					<h1 className='text-2xl font-bold text-gray-900 mb-2'>
						Company Registered Successfully!
					</h1>
					<p className='text-gray-600'>
						Share this link with your team members to access your company portal.
					</p>
				</div>

				<div className='mb-6'>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						Company Link
					</label>
					<div className='flex gap-2'>
						<input
							type='text'
							value={companyUrl}
							readOnly
							className='flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
						<Button onClick={handleCopy} type='button'>
							{copied ? 'Copied!' : 'Copy Link'}
						</Button>
					</div>
					<p className='mt-2 text-xs text-gray-500'>
						This link will take users directly to your company login page
					</p>
				</div>

				<div className='flex gap-3'>
					<Button onClick={() => router.push('/')} className='flex-1'>
						Go to Dashboard
					</Button>
				</div>
			</div>
		</div>
	)
}

export const RegisterCompanySuccess = memo(RegisterCompanySuccessComponent)

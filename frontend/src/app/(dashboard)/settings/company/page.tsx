'use client'

import { SafeRender } from '@/components/container/SafeRender'
import { Button } from '@/components/ui/Button'
import { RoleGuard } from '@/components/ui/RoleGuard'
import { UserRole } from '@/constants/pages.constant'
import { useCompanySettings } from '@/hooks/useCompanySettings'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export default function CompanySettingsPage() {
	const { user } = useCurrentUser()
	const { company, subdomain, companyUrl, copied, handleCopy } =
		useCompanySettings(user?.companyId)

	return (
		<SafeRender title="Loading Company Settings..." showNetworkProgress>
			<RoleGuard allowedRoles={[UserRole.ADMIN]}>
				<div className="p-6 max-w-2xl mx-auto">
					<h1 className="text-2xl font-bold text-gray-900 mb-6">
						Company Settings
					</h1>

					<div className="bg-white rounded-lg shadow-md p-6">
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Company Link
							</label>
							<div className="flex gap-2">
								<input
									type="text"
									value={companyUrl}
									readOnly
									className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<Button onClick={handleCopy} type="button" className="w-auto">
									{copied ? 'Copied!' : 'Copy'}
								</Button>
							</div>
							<p className="mt-2 text-sm text-gray-500">
								Share this link with your team members to access your company
								portal
							</p>
						</div>

						{(company || subdomain) && (
							<div className="mt-6 pt-6 border-t border-gray-200">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">
									Company Information
								</h2>
								<div className="space-y-3">
									{company?.name && (
										<div>
											<label className="text-sm font-medium text-gray-700">
												Company Name
											</label>
											<p className="text-gray-900">{company.name}</p>
										</div>
									)}
									{subdomain && (
										<div>
											<label className="text-sm font-medium text-gray-700">
												Subdomain
											</label>
											<p className="text-gray-900">{subdomain}</p>
										</div>
									)}
									{company?.address && (
										<div>
											<label className="text-sm font-medium text-gray-700">
												Address
											</label>
											<p className="text-gray-900">{company.address}</p>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</RoleGuard>
		</SafeRender>
	)
}

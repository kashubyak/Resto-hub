'use client'

import { use } from 'react'
import { UserDetailView } from './UserDetailView'

export default function UserDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	return <UserDetailView idParam={id} />
}

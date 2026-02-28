'use client'

import { initApiSubdomain } from '@/utils/api'
import { useLayoutEffect } from 'react'

export function ApiSubdomainInitializer() {
	useLayoutEffect(() => {
		initApiSubdomain()
	}, [])
	return null
}

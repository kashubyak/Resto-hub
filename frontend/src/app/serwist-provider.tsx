'use client'

import { ROUTES } from '@/constants/pages.constant'
import { SerwistProvider } from '@serwist/turbopack/react'
import type { ReactNode } from 'react'

const SW_URL = `${ROUTES.PUBLIC.SERWIST}/sw.js`

export function AppSerwistProvider({ children }: { children: ReactNode }) {
	return <SerwistProvider swUrl={SW_URL}>{children}</SerwistProvider>
}

'use client'

import { useState } from 'react'
import { LoginCompany } from './LoginCompany'
import { RegisterCompany } from './RegisterCompany'

export default function Auth() {
	const [isLogin, setIsLogin] = useState(false)

	const toggleAuthMode = () => setIsLogin(prev => !prev)

	return isLogin ? (
		<LoginCompany toggleMode={toggleAuthMode} />
	) : (
		<RegisterCompany toggleMode={toggleAuthMode} />
	)
}

'use client'

import { PWA_SESSION_KEYS } from '@/constants/pwa.constant'
import { useCallback, useEffect, useRef, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function readDismissedFromSession(): boolean {
	if (typeof window === 'undefined') return false
	return sessionStorage.getItem(PWA_SESSION_KEYS.INSTALL_PROMPT_DISMISSED) === '1'
}

function getStandaloneInstalled(): boolean {
	if (typeof window === 'undefined') return false
	const mq = window.matchMedia('(display-mode: standalone)')
	if (mq.matches) return true
	
	return Boolean(
		// iOS Safari
		(navigator as Navigator & { standalone?: boolean }).standalone,
	)
}

export function usePWAInstall() {
	const [deferredReady, setDeferredReady] = useState(false)
	const [dismissed, setDismissed] = useState(false)
	const [isInstalled, setIsInstalled] = useState(false)
	const deferredRef = useRef<BeforeInstallPromptEvent | null>(null)

	useEffect(() => {
		setDismissed(readDismissedFromSession())
		setIsInstalled(getStandaloneInstalled())

		const onBeforeInstall = (e: Event) => {
			e.preventDefault()
			deferredRef.current = e as BeforeInstallPromptEvent
			setDeferredReady(true)
		}

		const onInstalled = () => {
			deferredRef.current = null
			setDeferredReady(false)
			setIsInstalled(true)
		}

		const mq = window.matchMedia('(display-mode: standalone)')
		const onDisplayMode = () => setIsInstalled(getStandaloneInstalled())

		window.addEventListener('beforeinstallprompt', onBeforeInstall)
		window.addEventListener('appinstalled', onInstalled)
		mq.addEventListener('change', onDisplayMode)

		return () => {
			window.removeEventListener('beforeinstallprompt', onBeforeInstall)
			window.removeEventListener('appinstalled', onInstalled)
			mq.removeEventListener('change', onDisplayMode)
		}
	}, [])

	const dismiss = useCallback(() => {
		sessionStorage.setItem(PWA_SESSION_KEYS.INSTALL_PROMPT_DISMISSED, '1')
		setDismissed(true)
	}, [])

	const promptInstall = useCallback(async () => {
		const ev = deferredRef.current
		if (!ev) return
		await ev.prompt()
		await ev.userChoice
		deferredRef.current = null
		setDeferredReady(false)
	}, [])

	const isInstallable = deferredReady && !isInstalled
	const shouldShowPrompt = isInstallable && !dismissed

	return {
		isInstallable,
		isInstalled,
		shouldShowPrompt,
		promptInstall,
		dismiss,
	}
}

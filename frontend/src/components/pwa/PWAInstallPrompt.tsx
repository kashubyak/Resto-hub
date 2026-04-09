'use client'

import { Button } from '@/components/ui/Button'
import { PWA_APP_DESCRIPTION } from '@/constants/pwa.constant'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { cn } from '@/utils/cn'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Download } from 'lucide-react'
import { memo, useEffect, useState } from 'react'

function PWAInstallPromptComponent() {
	const { shouldShowPrompt, promptInstall, dismiss } = usePWAInstall()
	const reduceMotion = useReducedMotion()
	const [isPrompting, setIsPrompting] = useState(false)

	useEffect(() => {
		if (!shouldShowPrompt) setIsPrompting(false)
	}, [shouldShowPrompt])

	const handleInstall = async () => {
		setIsPrompting(true)
		try {
			await promptInstall()
		} finally {
			setIsPrompting(false)
		}
	}

	const transition = reduceMotion
		? { duration: 0 }
		: { type: 'spring' as const, stiffness: 420, damping: 32 }

	return (
		<AnimatePresence>
			{shouldShowPrompt ? (
				<motion.div
					className="fixed inset-x-0 bottom-0 z-[10000] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none"
					initial={reduceMotion ? false : { y: 120, opacity: 0 }}
					animate={reduceMotion ? false : { y: 0, opacity: 1 }}
					exit={reduceMotion ? undefined : { y: 100, opacity: 0 }}
					transition={transition}
				>
					<div
						className={cn(
							'pointer-events-auto w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-2xl',
							'shadow-[0_-8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.45)]',
						)}
						role="dialog"
						aria-labelledby="pwa-install-title"
						aria-describedby="pwa-install-desc"
					>
						<div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border" />
						<div className="flex gap-4 p-5 pt-4">
							<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
								<Download className="h-6 w-6 text-primary" aria-hidden />
							</div>
							<div className="min-w-0 flex-1 space-y-1">
								<h2
									id="pwa-install-title"
									className="text-base font-semibold text-foreground"
								>
									Install Resto Hub
								</h2>
								<p
									id="pwa-install-desc"
									className="text-sm text-muted-foreground leading-relaxed"
								>
									{PWA_APP_DESCRIPTION}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end">
							<button
								type="button"
								onClick={dismiss}
								disabled={isPrompting}
								className={cn(
									'order-2 sm:order-1 w-full sm:w-auto rounded-xl border border-border bg-transparent',
									'px-4 py-2.5 text-sm font-medium text-foreground',
									'hover:bg-accent transition-colors disabled:opacity-50',
								)}
							>
								Not now
							</button>
							<Button
								type="button"
								text={isPrompting ? 'Opening…' : 'Install'}
								onClick={() => void handleInstall()}
								disabled={isPrompting}
								className="order-1 sm:order-2 mt-0 w-full sm:w-auto min-w-[8rem] rounded-xl py-2.5"
							/>
						</div>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}

export const PWAInstallPrompt = memo(PWAInstallPromptComponent)
PWAInstallPrompt.displayName = 'PWAInstallPrompt'

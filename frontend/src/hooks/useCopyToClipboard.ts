import { useCallback, useState } from 'react'

function fallbackCopy(text: string): boolean {
	const textarea = document.createElement('textarea')
	textarea.value = text
	textarea.style.position = 'fixed'
	textarea.style.left = '-9999px'
	textarea.style.top = '-9999px'
	textarea.setAttribute('readonly', '')
	document.body.appendChild(textarea)
	textarea.select()
	textarea.setSelectionRange(0, text.length)
	const success = document.execCommand('copy')
	document.body.removeChild(textarea)
	return success
}

export const useCopyToClipboard = () => {
	const [copied, setCopied] = useState(false)

	const copy = useCallback(async (text: string) => {
		let ok = false
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(text)
				ok = true
			} else {
				ok = fallbackCopy(text)
			}
		} catch {
			ok = fallbackCopy(text)
		}
		if (ok) {
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
		return ok
	}, [])

	return { copy, copied }
}

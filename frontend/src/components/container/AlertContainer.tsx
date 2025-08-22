'use client'

import { useAlert } from '@/providers/AlertContext'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { useRef } from 'react'
import { AlertUI } from '../ui/Alert'

const AlertContainer = styled('div')(() => ({
	position: 'fixed',
	top: '20px',
	right: '20px',
	zIndex: 9999,
	display: 'flex',
	flexDirection: 'column',
	gap: '8px',
	maxWidth: '400px',
	'& .MuiAlert-root': {
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
		borderRadius: '8px',
		whiteSpace: 'pre-line',
	},
}))

export const AlertDisplay = () => {
	const { alerts, removeAlert } = useAlert()
	const hoverTimers = useRef<Record<string, NodeJS.Timeout>>({})

	if (alerts.length === 0) return null

	return (
		<AlertContainer>
			{alerts.map(alert => (
				<div
					key={alert.id}
					style={{ position: 'relative' }}
					onMouseEnter={() => {
						clearTimeout(hoverTimers.current[alert.id])
					}}
					onMouseLeave={() => {
						hoverTimers.current[alert.id] = setTimeout(() => removeAlert(alert.id), 2000)
					}}
				>
					<AlertUI severity={alert.severity} text={alert.text} />
					<IconButton
						size='small'
						onClick={() => removeAlert(alert.id)}
						sx={{
							position: 'absolute',
							right: 8,
							top: '50%',
							transform: 'translateY(-50%)',
							color: 'inherit',
							opacity: 0.7,
							'&:hover': { opacity: 1 },
						}}
					>
						<CloseIcon fontSize='small' />
					</IconButton>
				</div>
			))}
		</AlertContainer>
	)
}

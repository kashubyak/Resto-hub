'use client'

import { useAlert } from '@/providers/AlertContext'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { memo, useCallback } from 'react'
import { AlertUI } from '../ui/Alert'

const AlertContainer = styled('div')(() => ({
	position: 'fixed',
	top: '20px',
	right: '20px',
	zIndex: 9999,
	display: 'flex',
	flexDirection: 'column',
	gap: '8px',
	maxWidth: '420px',
	'& .MuiAlert-root': {
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
		borderRadius: '10px',
	},
}))

function AlertDisplayComponent() {
	const { alerts, removeAlert, pauseAlertTimer, resumeAlertTimer } = useAlert()

	const handleTimerComplete = useCallback(
		(alertId: string) => {
			removeAlert(alertId)
		},
		[removeAlert],
	)

	if (alerts.length === 0) return null

	return (
		<AlertContainer>
			{alerts.map(alert => (
				<div
					key={alert.id}
					style={{ position: 'relative' }}
					onMouseEnter={() => pauseAlertTimer(alert.id)}
					onMouseLeave={() => resumeAlertTimer(alert.id)}
				>
					<AlertUI
						severity={alert.severity}
						text={alert.text}
						retryAfter={alert.retryAfter}
						onTimerComplete={() => handleTimerComplete(alert.id)}
					/>
					<IconButton
						size='small'
						onClick={() => removeAlert(alert.id)}
						sx={{
							position: 'absolute',
							right: 6,
							top: 6,
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
export const AlertDisplay = memo(AlertDisplayComponent)

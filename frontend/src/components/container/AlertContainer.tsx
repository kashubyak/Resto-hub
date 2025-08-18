'use client'

import { useAlert } from '@/providers/AlertContext'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { AlertUI } from '../ui/Alert'

const AlertContainer = styled('div')(({ theme }) => ({
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
	},
}))

const CustomAlert = styled(AlertUI)(({ theme }) => ({
	'& .MuiAlert-message': {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
}))

export const AlertDisplay = () => {
	const { alerts, removeAlert } = useAlert()

	if (alerts.length === 0) return null

	return (
		<AlertContainer>
			{alerts.map(alert => (
				<div key={alert.id} style={{ position: 'relative' }}>
					<CustomAlert severity={alert.severity} text={alert.text} />
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
							'&:hover': {
								opacity: 1,
							},
						}}
					>
						<CloseIcon fontSize='small' />
					</IconButton>
				</div>
			))}
		</AlertContainer>
	)
}

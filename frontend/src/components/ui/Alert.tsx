import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'

interface IAlertProps {
	severity: 'success' | 'error' | 'info' | 'warning'
	text: string
}

const CustomAlert = styled(Alert)(({ theme }) => ({
	borderRadius: '8px',
	fontSize: '14px',
	color: 'var(--foreground)',
	backgroundColor: 'var(--muted)',
	border: `1px solid var(--border)`,
	'& .MuiAlert-icon': {
		color: 'inherit',
	},
	'&.MuiAlert-standardSuccess': {
		backgroundColor: 'var(--success)',
		color: 'var(--stable-light)',
		'&:hover': {
			backgroundColor: 'var(--success-hover)',
		},
	},
	'&.MuiAlert-standardError': {
		backgroundColor: 'var(--destructive)',
		color: 'var(--stable-light)',
		'&:hover': {
			backgroundColor: 'var(--destructive-hover)',
		},
	},
	'&.MuiAlert-standardWarning': {
		backgroundColor: 'var(--warning)',
		color: 'var(--background)',
		'&:hover': {
			backgroundColor: 'var(--warning-hover)',
		},
	},
	'&.MuiAlert-standardInfo': {
		backgroundColor: 'var(--info)',
		color: 'var(--stable-light)',
		'&:hover': {
			backgroundColor: 'var(--info-hover)',
		},
	},
}))

export const AlertUI = ({ severity, text }: IAlertProps) => {
	return (
		<CustomAlert severity={severity} sx={{ whiteSpace: 'pre-line' }}>
			{text}
		</CustomAlert>
	)
}

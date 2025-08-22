import Alert from '@mui/material/Alert'

interface IAlertProps {
	severity: 'success' | 'error' | 'info' | 'warning'
	text: string
}

export const AlertUI = ({ severity, text }: IAlertProps) => {
	return (
		<Alert severity={severity} sx={{ whiteSpace: 'pre-line' }}>
			{text}
		</Alert>
	)
}

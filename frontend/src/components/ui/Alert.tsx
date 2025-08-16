import Alert from '@mui/material/Alert'

interface IAlertProps {
	severity: 'error' | 'warning' | 'info' | 'success'
	text: string
}

export const AlertUI = ({ severity, text }: IAlertProps) => {
	return <Alert severity={severity}>{text}</Alert>
}

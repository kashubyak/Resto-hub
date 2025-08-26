import { MAX_LENGTH_ALERT } from '@/constants/alert.constant'
import type { AlertSeverity } from '@/types/alert.interface'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

interface IAlertProps {
	severity: AlertSeverity
	text: string
}

const CustomAlert = styled(Alert)(() => ({
	borderRadius: '10px',
	fontSize: '14px',
	padding: '5px 40px 5px 10px',
	lineHeight: 1.4,
	'& .MuiAlert-icon': {
		marginRight: '8px',
		fontSize: '20px',
		alignSelf: 'center',
		color: 'inherit',
	},
	'& .MuiAlert-message': {
		flex: 1,
	},
	'&.MuiAlert-standardSuccess': {
		backgroundColor: 'var(--success)',
		color: 'var(--stable-light)',
	},
	'&.MuiAlert-standardError': {
		backgroundColor: 'var(--destructive)',
		color: 'var(--stable-light)',
	},
	'&.MuiAlert-standardWarning': {
		backgroundColor: 'var(--warning)',
		color: 'var(--stable-light)',
	},
	'&.MuiAlert-standardInfo': {
		backgroundColor: 'var(--info)',
		color: 'var(--stable-light)',
	},
}))

export const AlertUI = ({ severity, text }: IAlertProps) => {
	const [expanded, setExpanded] = useState(false)

	const isLong = text.length > MAX_LENGTH_ALERT
	const displayText = expanded || !isLong ? text : text.slice(0, MAX_LENGTH_ALERT) + '...'

	return (
		<CustomAlert severity={severity}>
			<span>{displayText}</span>
			{isLong && (
				<span
					className='ml-2 underline cursor-pointer text-xs opacity-80 text-nowrap'
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? 'Show less' : 'Show more'}
				</span>
			)}
		</CustomAlert>
	)
}

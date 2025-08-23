import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

interface IAlertProps {
	severity: 'success' | 'error' | 'info' | 'warning'
	text: string
}

const CustomAlert = styled(Alert)(({ theme }) => ({
	borderRadius: '10px',
	fontSize: '14px',
	padding: '10px 40px 10px 12px',
	lineHeight: 1.4,
	'& .MuiAlert-icon': {
		marginRight: '8px',
		fontSize: '20px',
		alignSelf: 'flex-start',
	},
	'& .MuiAlert-message': {
		flex: 1,
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
	const [expanded, setExpanded] = useState(false)
	const maxLength = 100

	const isLong = text.length > maxLength
	const displayText = expanded || !isLong ? text : text.slice(0, maxLength) + '...'

	return (
		<CustomAlert severity={severity}>
			<span>{displayText}</span>
			{isLong && (
				<span
					style={{
						marginLeft: '8px',
						textDecoration: 'underline',
						cursor: 'pointer',
						fontSize: '12px',
						opacity: 0.8,
					}}
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? 'Show less' : 'Show more'}
				</span>
			)}
		</CustomAlert>
	)
}

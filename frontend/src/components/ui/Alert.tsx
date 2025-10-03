import { MAX_LENGTH_ALERT } from '@/constants/alert.constant'
import type { AlertSeverity } from '@/types/alert.interface'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'
import { memo, useCallback, useMemo, useState } from 'react'

interface IAlertProps {
	severity: AlertSeverity
	text: string
}

const CustomAlert = styled(Alert)(({ theme }) => ({
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
		wordBreak: 'break-word',
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
	// Мобільні пристрої (до 600px)
	[theme.breakpoints.down('sm')]: {
		fontSize: '13px',
		padding: '6px 35px 6px 8px',
		borderRadius: '8px',
		'& .MuiAlert-icon': {
			marginRight: '6px',
			fontSize: '18px',
		},
	},
	// Дуже малі екрани (до 400px)
	'@media (max-width: 400px)': {
		fontSize: '12px',
		padding: '5px 30px 5px 6px',
		'& .MuiAlert-icon': {
			fontSize: '16px',
			marginRight: '4px',
		},
	},
}))

export const AlertUI = memo<IAlertProps>(({ severity, text }) => {
	const [expanded, setExpanded] = useState(false)
	const isLong = useMemo(() => text.length > MAX_LENGTH_ALERT, [text.length])

	const displayText = useMemo(() => {
		if (!isLong || expanded) return text
		return text.slice(0, MAX_LENGTH_ALERT) + '...'
	}, [text, isLong, expanded])

	const handleToggle = useCallback(() => setExpanded(prev => !prev), [])

	return (
		<CustomAlert severity={severity}>
			<span>{displayText}</span>
			{isLong && (
				<span
					className='ml-1 sm:ml-2 underline cursor-pointer text-[11px] sm:text-xs opacity-80 text-nowrap'
					onClick={handleToggle}
				>
					{expanded ? 'Show less' : 'Show more'}
				</span>
			)}
		</CustomAlert>
	)
})

AlertUI.displayName = 'AlertUI'

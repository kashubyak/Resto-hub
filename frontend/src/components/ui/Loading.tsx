import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material'

interface LoadingProps {
	progress?: number
	title?: string
	overlay?: boolean
}

export const Loading = ({
	progress,
	title = 'Завантаження...',
	overlay = true,
}: LoadingProps) => {
	const content = (
		<Box display='flex' flexDirection='column' alignItems='center' gap={2}>
			{progress && progress > 0 ? (
				<>
					<Typography variant='body2'>{title}</Typography>
					<LinearProgress
						variant='determinate'
						value={progress}
						sx={{ width: '200px', borderRadius: '4px' }}
					/>
				</>
			) : (
				<>
					<CircularProgress />
					<Typography variant='body2'>{title}</Typography>
				</>
			)}
		</Box>
	)

	if (!overlay) return content

	return (
		<Box
			sx={{
				position: 'fixed',
				inset: 0,
				backgroundColor: 'rgba(0,0,0,0.4)',
				backdropFilter: 'blur(2px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 9999,
			}}
		>
			{content}
		</Box>
	)
}

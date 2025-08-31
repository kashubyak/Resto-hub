import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

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
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
			gap={2}
		>
			<Box position='relative' display='inline-flex'>
				<CircularProgress
					variant={progress !== undefined ? 'determinate' : 'indeterminate'}
					value={progress}
					size={60}
					thickness={4}
					sx={{
						color: '#1976d2',
					}}
				/>
				{progress !== undefined && (
					<Box
						sx={{
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							position: 'absolute',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography
							variant='caption'
							component='div'
							color='text.secondary'
							fontSize='12px'
							fontWeight='bold'
						>
							{`${Math.round(progress)}%`}
						</Typography>
					</Box>
				)}
			</Box>
			{title && (
				<Typography variant='body2' color='text.secondary' textAlign='center'>
					{title}
				</Typography>
			)}
		</Box>
	)

	if (!overlay) {
		return content
	}

	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				backdropFilter: 'blur(2px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 9999,
			}}
		>
			<Box
				sx={{
					backgroundColor: 'white',
					borderRadius: '12px',
					padding: '32px',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
					minWidth: '200px',
				}}
			>
				{content}
			</Box>
		</Box>
	)
}

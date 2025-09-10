import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material'

interface ILoadingProps {
	progress?: number
	title?: string
	overlay?: boolean
}

export const Loading = ({
	progress,
	title = 'Loading...',
	overlay = true,
}: ILoadingProps) => {
	const content = (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			gap={2}
			sx={{
				padding: 4,
				backgroundColor: 'var(--secondary)',
				borderRadius: 2,
				border: '1px solid var(--border)',
				minWidth: 250,
			}}
		>
			{progress && progress > 0 ? (
				<>
					<Typography
						variant='body2'
						sx={{
							color: 'var(--foreground)',
							fontWeight: 500,
							textAlign: 'center',
						}}
					>
						{title}
					</Typography>
					<LinearProgress
						variant='determinate'
						value={progress}
						sx={{
							width: '100%',
							height: 8,
							borderRadius: '4px',
							backgroundColor: 'var(--muted)',
							'& .MuiLinearProgress-bar': {
								backgroundColor: 'var(--primary)',
								borderRadius: '4px',
							},
						}}
					/>
					<Typography
						variant='caption'
						sx={{
							color: 'var(--muted-foreground)',
							fontSize: '0.75rem',
						}}
					>
						{Math.round(progress)}%
					</Typography>
				</>
			) : (
				<>
					<CircularProgress
						sx={{
							color: 'var(--primary)',
							'& .MuiCircularProgress-circle': {
								strokeLinecap: 'round',
							},
						}}
					/>
					<Typography
						variant='body2'
						sx={{
							color: 'var(--foreground)',
							fontWeight: 500,
							textAlign: 'center',
						}}
					>
						{title}
					</Typography>
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
				backgroundColor: 'var(--background)',
				backdropFilter: 'blur(8px)',
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

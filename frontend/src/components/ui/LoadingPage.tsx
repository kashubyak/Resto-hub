import {
	Box,
	CircularProgress,
	LinearProgress,
	Typography,
} from '@mui/material'
import { memo, useMemo } from 'react'

interface ILoadingPageProps {
	progress?: number
	title?: string
	overlay?: boolean
}

export const LoadingPage = memo<ILoadingPageProps>(
	({ progress, title = 'Loading...', overlay = true }) => {
		const hasProgress = useMemo(
			() => progress !== undefined && progress > 0,
			[progress],
		)

		const progressRounded = useMemo(
			() => (progress ? Math.round(progress) : 0),
			[progress],
		)

		const contentBoxSx = useMemo(
			() => ({
				padding: 4,
				backgroundColor: 'var(--secondary)',
				borderRadius: 2,
				border: '1px solid var(--border)',
				minWidth: 250,
			}),
			[],
		)

		const linearProgressSx = useMemo(
			() => ({
				width: '100%',
				height: 8,
				borderRadius: '4px',
				backgroundColor: 'var(--muted)',
				'& .MuiLinearProgress-bar': {
					backgroundColor: 'var(--primary)',
					borderRadius: '4px',
				},
			}),
			[],
		)

		const circularProgressSx = useMemo(
			() => ({
				color: 'var(--primary)',
				'& .MuiCircularProgress-circle': {
					strokeLinecap: 'round',
				},
			}),
			[],
		)

		const titleSx = useMemo(
			() => ({
				color: 'var(--foreground)',
				fontWeight: 500,
				textAlign: 'center',
			}),
			[],
		)

		const captionSx = useMemo(
			() => ({
				color: 'var(--muted-foreground)',
				fontSize: '0.75rem',
			}),
			[],
		)

		const overlayBoxSx = useMemo(
			() => ({
				position: 'fixed',
				inset: 0,
				backgroundColor: 'var(--background)',
				backdropFilter: 'blur(8px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 9999,
			}),
			[],
		)

		const content = (
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				gap={2}
				sx={contentBoxSx}
			>
				{hasProgress ? (
					<>
						<Typography variant="body2" sx={titleSx}>
							{title}
						</Typography>
						<LinearProgress
							variant="determinate"
							value={progress}
							sx={linearProgressSx}
						/>
						<Typography variant="caption" sx={captionSx}>
							{progressRounded}%
						</Typography>
					</>
				) : (
					<>
						<CircularProgress sx={circularProgressSx} />
						<Typography variant="body2" sx={titleSx}>
							{title}
						</Typography>
					</>
				)}
			</Box>
		)

		if (!overlay) return content

		return <Box sx={overlayBoxSx}>{content}</Box>
	},
)

LoadingPage.displayName = 'LoadingPage'

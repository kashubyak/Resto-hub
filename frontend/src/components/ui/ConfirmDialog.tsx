'use client'

import { Button } from '@/components/ui/Button'
import CloseIcon from '@mui/icons-material/Close'
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	useMediaQuery,
	useTheme,
} from '@mui/material'

interface IConfirmDialogProps {
	open: boolean
	onClose: () => void
	onConfirm: () => void
	title?: string
	message?: string
	confirmText?: string
	cancelText?: string
	danger?: boolean
}
export const ConfirmDialog = ({
	open,
	onClose,
	onConfirm,
	title = 'Are you sure?',
	message = 'This action cannot be undone.',
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	danger,
}: IConfirmDialogProps) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'xl'))

	const safeClose = () => {
		if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
		onClose()
	}

	return (
		<Dialog
			open={open}
			onClose={safeClose}
			fullWidth
			fullScreen={isMobile}
			maxWidth={false}
			PaperProps={{
				sx: {
					width: isMobile ? '100vw' : isTablet ? '480px' : '400px',
					maxWidth: '100%',
					borderRadius: isMobile ? 0 : '16px',
					backgroundColor: 'var(--secondary)',
					color: 'var(--foreground)',
				},
			}}
			sx={{
				'& .MuiBackdrop-root': {
					backdropFilter: 'blur(8px)',
					backgroundColor: 'rgba(var(--background-rgb), 0.3)',
				},
			}}
		>
			<DialogTitle
				sx={{
					fontSize: isMobile ? '1.25rem' : '1.5rem',
					fontWeight: 'bold',
					borderBottom: '1px solid var(--border)',
					padding: '1rem 1rem',
					color: 'var(--stable-light)',
					background: danger
						? 'linear-gradient(135deg, var(--destructive) 0%, var(--muted) 90%)'
						: 'linear-gradient(135deg, var(--primary) 0%, var(--muted) 90%)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<span>{title}</span>
				<IconButton
					onClick={safeClose}
					sx={{
						color: 'var(--foreground)',
						'&:hover': {
							backgroundColor: 'color-mix(in oklab, var(--foreground) 10%, transparent)',
						},
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent
				sx={{
					padding: '1rem',
					color: 'var(--muted-foreground)',
					fontSize: '0.95rem',
				}}
			>
				{message}
			</DialogContent>

			<DialogActions
				sx={{
					padding: '1rem',
					gap: '0.5rem',
					justifyContent: isMobile ? 'stretch' : 'flex-end',
					borderTop: '1px solid var(--border)',
					flexDirection: isMobile ? 'column-reverse' : 'row',
				}}
			>
				<Button
					type='button'
					text={cancelText}
					onClick={safeClose}
					className={isMobile ? 'w-full' : ''}
				/>
				<Button
					type='button'
					onClick={() => {
						onConfirm()
						safeClose()
					}}
					text={confirmText}
					className={`${isMobile ? 'w-full' : 'px-4 py-2'} ${
						danger
							? 'bg-destructive hover:bg-destructive text-foreground'
							: 'bg-success hover:bg-success text-foreground'
					}`}
				/>
			</DialogActions>
		</Dialog>
	)
}

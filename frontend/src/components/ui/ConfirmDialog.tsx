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
import { memo, useCallback, useMemo } from 'react'

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

export const ConfirmDialog = memo<IConfirmDialogProps>(
	({
		open,
		onClose,
		onConfirm,
		title = 'Are you sure?',
		message = 'This action cannot be undone.',
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		danger = false,
	}) => {
		const theme = useTheme()
		const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
		const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'xl'))

		const safeClose = useCallback(() => {
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur()
			}
			onClose()
		}, [onClose])

		const handleConfirm = useCallback(() => {
			onConfirm()
			safeClose()
		}, [onConfirm, safeClose])

		const paperProps = useMemo(
			() => ({
				sx: {
					width: isMobile ? '100vw' : isTablet ? '480px' : '400px',
					maxWidth: '100%',
					borderRadius: isMobile ? 0 : '16px',
					backgroundColor: 'var(--secondary)',
					color: 'var(--foreground)',
				},
			}),
			[isMobile, isTablet],
		)

		const dialogSx = useMemo(
			() => ({
				'& .MuiBackdrop-root': {
					backdropFilter: 'blur(8px)',
					backgroundColor: 'rgba(var(--background-rgb), 0.3)',
				},
			}),
			[],
		)

		const titleSx = useMemo(
			() => ({
				fontSize: isMobile ? '1.25rem' : '1.5rem',
				fontWeight: 'bold',
				borderBottom: '1px solid var(--border)',
				padding: '1rem',
				color: 'var(--stable-light)',
				background: danger
					? 'linear-gradient(135deg, var(--destructive) 0%, var(--muted) 90%)'
					: 'linear-gradient(135deg, var(--primary) 0%, var(--muted) 90%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}),
			[isMobile, danger],
		)

		const actionsSx = useMemo(
			() => ({
				padding: '1rem',
				gap: isMobile ? '0.25rem' : '0.75rem',
				justifyContent: isMobile ? 'stretch' : 'flex-end',
				borderTop: '1px solid var(--border)',
				flexDirection: isMobile ? 'column-reverse' : 'row',
				'& > :not(style) ~ :not(style)': {
					marginLeft: 0,
				},
			}),
			[isMobile],
		)

		const confirmButtonClass = useMemo(() => {
			const widthClass = isMobile ? 'w-full' : 'px-4 py-2'
			const colorClass = danger
				? 'bg-destructive hover:bg-destructive text-foreground'
				: 'bg-success hover:bg-success text-foreground'
			return `${widthClass} ${colorClass}`
		}, [isMobile, danger])

		const contentSx = useMemo(
			() => ({
				padding: '1rem !important',
				color: 'var(--secondary-foreground)',
				fontSize: '0.95rem',
			}),
			[],
		)

		const iconButtonSx = useMemo(
			() => ({
				color: 'var(--foreground)',
				'&:hover': {
					backgroundColor: 'color-mix(in oklab, var(--foreground) 10%, transparent)',
				},
			}),
			[],
		)

		return (
			<Dialog
				open={open}
				onClose={safeClose}
				fullWidth
				maxWidth={false}
				PaperProps={paperProps}
				sx={dialogSx}
			>
				<DialogTitle sx={titleSx}>
					<span>{title}</span>
					<IconButton onClick={safeClose} sx={iconButtonSx}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<DialogContent sx={contentSx}>{message}</DialogContent>

				<DialogActions sx={actionsSx}>
					<Button
						type='button'
						text={cancelText}
						onClick={safeClose}
						className={isMobile ? 'w-full' : ''}
					/>
					<Button
						type='button'
						onClick={handleConfirm}
						text={confirmText}
						className={confirmButtonClass}
					/>
				</DialogActions>
			</Dialog>
		)
	},
)

ConfirmDialog.displayName = 'ConfirmDialog'

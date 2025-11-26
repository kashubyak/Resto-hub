'use client'

import { Button } from '@/components/ui/Button'
import { useCategoryModal } from '@/hooks/useCategoryModal'
import CloseIcon from '@mui/icons-material/Close'
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import { useCallback, useMemo } from 'react'

type CategoryModalProps = {
	open: boolean
	onClose: () => void
}

const textFieldSx = {
	'& .MuiOutlinedInput-root': {
		backgroundColor: 'var(--input)',
		color: 'var(--foreground)',
		borderRadius: '8px',
		'& fieldset': { borderColor: 'var(--border)' },
		'&:hover fieldset': { borderColor: 'var(--primary)' },
		'&.Mui-focused fieldset': { borderColor: 'var(--primary)', borderWidth: '1px' },
	},
	'& .MuiInputLabel-root': { color: 'var(--muted-foreground)' },
	'& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' },
	'& .MuiInputBase-input': { color: 'var(--foreground)' },
}

export const CategoryModal = ({ open, onClose }: CategoryModalProps) => {
	const { onSubmit, register, errors, handleSubmit, isSubmitting } =
		useCategoryModal(onClose)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const safeClose = useCallback(() => {
		if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
		onClose()
	}, [onClose])

	const paperSx = useMemo(
		() => ({
			width: isMobile ? '100vw' : '500px',
			maxWidth: '100%',
			margin: isMobile ? 0 : 32,
			borderRadius: isMobile ? 0 : '16px',
			backgroundColor: 'var(--secondary)',
			color: 'var(--foreground)',
			display: 'flex',
			flexDirection: 'column',
		}),
		[isMobile],
	)

	return (
		<Dialog
			open={open}
			onClose={safeClose}
			fullWidth
			fullScreen={isMobile}
			maxWidth={false}
			PaperProps={{ sx: paperSx }}
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
					color: 'var(--stable-light)',
					borderBottom: '1px solid var(--border)',
					padding: isMobile ? '1rem' : '1.5rem 2rem',
					background: 'linear-gradient(135deg, var(--primary) 0%, var(--muted) 90%)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<span>📁 New Category</span>
				<IconButton onClick={safeClose} sx={{ color: 'var(--stable-light)' }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col flex-1'>
				<DialogContent
					sx={{
						padding: isMobile ? '1.5rem 1rem' : '2rem',
						display: 'flex',
						flexDirection: 'column',
						gap: 3,
					}}
				>
					<div className='space-y-1'>
						<TextField
							fullWidth
							label='Category Name'
							placeholder='e.g. Pizza, Drinks, Desserts'
							error={!!errors.name}
							helperText={errors.name?.message}
							variant='outlined'
							sx={textFieldSx}
							{...register('name', {
								required: 'Name is required',
								minLength: {
									value: 2,
									message: 'Name must be at least 2 characters',
								},
							})}
						/>
					</div>
				</DialogContent>

				<DialogActions
					sx={{
						padding: isMobile ? '1rem' : '1.5rem 2rem',
						gap: isMobile ? '0.5rem' : '1rem',
						borderTop: '1px solid var(--border)',
						flexDirection: isMobile ? 'column-reverse' : 'row',
					}}
				>
					<Button
						type='button'
						text='Cancel'
						onClick={safeClose}
						className={`bg-transparent border border-border text-foreground hover:bg-muted ${
							isMobile ? 'w-full' : ''
						}`}
					/>
					<Button
						type='submit'
						text={isSubmitting ? 'Creating...' : 'Create'}
						className={`${
							isMobile ? 'w-full' : 'w-auto px-4 py-2'
						} bg-success text-foreground hover:bg-success`}
					/>
				</DialogActions>
			</form>
		</Dialog>
	)
}

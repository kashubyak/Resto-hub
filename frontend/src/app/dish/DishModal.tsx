'use client'

import { AuthButton } from '@/components/ui/AuthButton'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type DishModalProps = {
	open: boolean
	onClose: () => void
}

export const DishModal = ({ open, onClose }: DishModalProps) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			sx={{
				'& .MuiBackdrop-root': {
					backdropFilter: 'blur(.625rem)',
				},
				'& .MuiPaper-root': {
					maxWidth: 'none',
					borderRadius: '.625rem',
					backgroundColor: 'var(--secondary)',
					color: 'var(--foreground)',
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			<DialogTitle
				sx={{
					fontSize: '1.25rem',
					fontWeight: 'bold',
				}}
			>
				Create dish
			</DialogTitle>
			<DialogContent
				sx={{
					flex: 1,
					padding: '0 1.5rem',
					overflowY: 'auto',
				}}
			>
				<p className='text-sm'>Form fields will be here...</p>
			</DialogContent>

			<DialogActions
				sx={{
					display: 'flex',
					gap: '.75rem',
					padding: '1rem 1.5rem',
					justifyContent: 'flex-end',
				}}
			>
				<AuthButton type='button' text='Cancel' onClick={onClose} />
				<AuthButton
					type='button'
					text='Create'
					onClick={() => {
						onClose()
					}}
					className='w-auto px-4 py-2 bg-success text-foreground hover:bg-success'
				/>
			</DialogActions>
		</Dialog>
	)
}

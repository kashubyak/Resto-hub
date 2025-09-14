'use client'

import { AuthButton } from '@/components/ui/AuthButton'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type DishModalProps = {
	open: boolean
	onClose: () => void
}

export const DishModal = ({ open, onClose }: DishModalProps) => {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle>Create Dish</DialogTitle>
			<DialogContent>
				<p className='text-sm text-foreground'>Form fields will be here...</p>
			</DialogContent>
			<DialogActions>
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

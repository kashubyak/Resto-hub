'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDishModal } from '@/hooks/useDishModal'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type DishModalProps = {
	open: boolean
	onClose: () => void
}

export const DishModal = ({ open, onClose }: DishModalProps) => {
	const { onSubmit, register, errors, handleSubmit } = useDishModal()
	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			sx={{
				'& .MuiBackdrop-root': {
					backdropFilter: 'blur(.1875rem)',
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
				<form className='py-1.5' onSubmit={handleSubmit(onSubmit)}>
					<Input
						register={register('name', {
							required: 'Dish name is required',
							validate: {},
						})}
						label='Dish name'
						error={errors.name?.message}
						type='text'
					/>
					<DialogActions
						sx={{
							display: 'flex',
							gap: '.75rem',
							padding: '1rem 1.5rem',
							justifyContent: 'flex-end',
						}}
					>
						<Button type='button' text='Cancel' onClick={onClose} />
						<Button
							type='button'
							text='Create'
							onClick={() => {
								onClose()
							}}
							className='w-auto px-4 py-2 bg-success text-foreground hover:bg-success'
						/>
					</DialogActions>
				</form>
			</DialogContent>
		</Dialog>
	)
}

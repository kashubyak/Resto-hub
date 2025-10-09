'use client'

import type {
	UpdateFieldConfig,
	UpdateFieldValue,
	UpdateFormValues,
} from '@/types/update-field.interface'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Drawer, IconButton } from '@mui/material'
import { memo, useCallback, useEffect, useState } from 'react'
import { Button } from '../../ui/Button'

interface UpdateDrawerProps {
	open: boolean
	onClose: () => void
	title: string
	fields: UpdateFieldConfig[]
	initialValues?: UpdateFormValues
	onSubmit: (values: UpdateFormValues) => Promise<void>
	isLoading?: boolean
}

const drawerSx = {
	'& .MuiDrawer-paper': {
		width: {
			xs: '100%',
			sm: '400px',
			md: '33.333%',
		},
		maxWidth: '500px',
		backgroundColor: 'var(--background)',
		color: 'var(--foreground)',
		padding: 0,
		boxShadow: '-4px 0 20px var(--shadow)',
	},
	'& .MuiBackdrop-root': {
		backgroundColor: 'rgba(var(--background-rgb), 0.3)',
		backdropFilter: 'blur(8px)',
	},
}

const iconButtonSx = {
	color: 'var(--muted-foreground)',
	'&:hover': {
		color: 'var(--foreground)',
		backgroundColor: 'var(--muted-hover)',
	},
}

const UpdateDrawerComponent: React.FC<UpdateDrawerProps> = ({
	open,
	onClose,
	title,
	fields,
	initialValues = {},
	onSubmit,
	isLoading = false,
}) => {
	const [formValues, setFormValues] = useState<UpdateFormValues>(initialValues)

	useEffect(() => {
		if (open) {
			setFormValues(initialValues)
		}
	}, [open, initialValues])

	const handleChange = useCallback((key: string, value: UpdateFieldValue) => {
		setFormValues(prev => ({
			...prev,
			[key]: value,
		}))
	}, [])

	const handleSubmit = useCallback(async () => {
		await onSubmit(formValues)
		onClose()
	}, [formValues, onSubmit, onClose])

	const handleReset = useCallback(() => {
		setFormValues(initialValues)
	}, [initialValues])

	return (
		<Drawer anchor='right' open={open} onClose={onClose} sx={drawerSx}>
			<div className='flex flex-col h-full'>
				<div className='flex items-center justify-between p-4 border-b border-border'>
					<h2 className='text-xl font-bold flex items-center gap-2'>
						<EditIcon />
						{title}
					</h2>
					<IconButton
						onClick={onClose}
						size='small'
						aria-label='close drawer'
						sx={iconButtonSx}
					>
						<CloseIcon />
					</IconButton>
				</div>

				<div className='flex-1 overflow-y-auto p-4'>
					<div className='space-y-6'>
						{/* TODO: Тут будуть поля */}
						<div className='text-center text-muted-foreground py-8'>
							Fields will be rendered here
						</div>
					</div>
				</div>

				<div className='p-4 border-t border-border space-y-2'>
					<div className='flex justify-between gap-2'>
						<Button onClick={onClose} text='Cancel' disabled={isLoading} />
						<Button onClick={handleSubmit} text='Save Changes' disabled={isLoading} />
					</div>
					<Button onClick={handleReset} disabled={isLoading}>
						<RestartAltIcon fontSize='small' />
						Reset to Initial
					</Button>
				</div>
			</div>
		</Drawer>
	)
}

export const UpdateDrawer = memo(UpdateDrawerComponent)

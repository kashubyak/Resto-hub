'use client'

import { Button } from '@/components/ui/Button'
import { useDishModal } from '@/hooks/useDishModal'
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
import { BasicInformationSection } from './components/modal/BasicInformationSection'
import { ImageUploadSection } from './components/modal/ImageUploadSection'
import { IngredientsSection } from './components/modal/IngredientsSection'
import { NutritionalInfoSection } from './components/modal/NutritionalInfoSection'
import { PricingCategorySection } from './components/modal/PricingCategorySection'

type DishModalProps = {
	open: boolean
	onClose: () => void
}

export const DishModal = ({ open, onClose }: DishModalProps) => {
	const {
		onSubmit,
		register,
		errors,
		handleSubmit,
		control,
		setError,
		clearErrors,
		watch,
	} = useDishModal(onClose)

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
					width: isMobile ? '100vw' : isTablet ? '960px' : '720px',
					maxWidth: '100%',
					height: isMobile ? '100vh' : '90vh',
					borderRadius: isMobile ? 0 : '16px',
					backgroundColor: 'var(--secondary)',
					color: 'var(--foreground)',
					display: 'flex',
					flexDirection: 'column',
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
					padding: isMobile ? '1rem 1rem' : '1.5rem 2rem',
					background: 'linear-gradient(135deg, var(--secondary) 0%, var(--muted) 100%)',
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<span>🍽️ Create New Dish</span>
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

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-1 flex-col overflow-hidden'
			>
				<DialogContent
					sx={{
						padding: isMobile ? '1rem' : '2rem',
						flex: 1,
						overflow: 'hidden',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<div className={`flex-1 overflow-y-auto ${isMobile ? 'space-y-4' : ''}`}>
						<BasicInformationSection register={register} errors={errors} watch={watch} />
						<PricingCategorySection register={register} errors={errors} />
						<IngredientsSection
							control={control}
							errors={errors}
							setError={setError}
							clearErrors={clearErrors}
						/>
						<ImageUploadSection register={register} errors={errors} />
						<NutritionalInfoSection register={register} errors={errors} />
					</div>
				</DialogContent>

				<DialogActions
					sx={{
						padding: isMobile ? '1rem' : '1.5rem 2rem',
						gap: isMobile ? '0.5rem' : '1rem',
						justifyContent: isMobile ? 'stretch' : 'flex-end',
						borderTop: '1px solid var(--border)',
						flexDirection: isMobile ? 'column-reverse' : 'row',
						flexShrink: 0,
					}}
				>
					<Button
						type='button'
						text='Cancel'
						onClick={safeClose}
						className={isMobile ? 'w-full' : ''}
					/>
					<Button
						type='submit'
						text='Create'
						className={`${
							isMobile ? 'w-full' : 'w-auto px-4 py-2'
						} bg-success text-foreground hover:bg-success`}
					/>
				</DialogActions>
			</form>
		</Dialog>
	)
}

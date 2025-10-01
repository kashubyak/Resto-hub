'use client'

import CloseIcon from '@mui/icons-material/Close'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { Chip } from '@mui/material'
import { memo } from 'react'

type IngredientChipProps = {
	ingredient: string
	idx: number
	isFullScreen: boolean
	draggedIndex: number | null
	dragOverIndex: number | null
	onDragStart: (e: React.DragEvent, index: number) => void
	onDragEnd: (e: React.DragEvent) => void
	onDragOver: (e: React.DragEvent) => void
	onDragEnter: (e: React.DragEvent, index: number) => void
	onDragLeave: (e: React.DragEvent) => void
	onDrop: (e: React.DragEvent, dropIndex: number) => void
	onDelete: () => void
}

function IngredientChipComponent({
	ingredient,
	idx,
	isFullScreen,
	draggedIndex,
	dragOverIndex,
	onDragStart,
	onDragEnd,
	onDragOver,
	onDragEnter,
	onDragLeave,
	onDrop,
	onDelete,
}: IngredientChipProps) {
	return (
		<div
			key={`${ingredient}-${idx}`}
			draggable
			onDragStart={e => onDragStart(e, idx)}
			onDragEnd={onDragEnd}
			onDragOver={onDragOver}
			onDragEnter={e => onDragEnter(e, idx)}
			onDragLeave={onDragLeave}
			onDrop={e => onDrop(e, idx)}
			className={`
				flex items-center gap-1 cursor-move transition-all duration-200
				${draggedIndex === idx ? 'scale-105 rotate-2' : ''}
				${dragOverIndex === idx && draggedIndex !== idx ? 'scale-110 shadow-lg' : ''}
				hover:scale-105 hover:shadow-md
			`}
			style={{
				transform:
					draggedIndex === idx
						? 'scale(1.05) rotate(2deg)'
						: dragOverIndex === idx && draggedIndex !== idx
						? 'scale(1.1)'
						: 'scale(1)',
				transition: 'all 0.2s ease-in-out',
			}}
		>
			<DragIndicatorIcon
				sx={{
					color: 'var(--muted-foreground)',
					fontSize: isFullScreen ? '1rem' : '1.2rem',
					cursor: 'grab',
					opacity: 0.6,
					'&:hover': {
						opacity: 1,
					},
				}}
			/>
			<Chip
				label={ingredient}
				onDelete={onDelete}
				deleteIcon={<CloseIcon />}
				size={isFullScreen ? 'small' : 'medium'}
				sx={{
					backgroundColor:
						dragOverIndex === idx && draggedIndex !== idx
							? 'var(--primary)'
							: 'var(--active-item)',
					color:
						dragOverIndex === idx && draggedIndex !== idx
							? 'var(--background)'
							: 'var(--foreground)',
					borderRadius: '8px',
					fontSize: isFullScreen ? '0.8rem' : '0.9rem',
					transition: 'all 0.2s ease-in-out',
					'& .MuiChip-deleteIcon': {
						color:
							dragOverIndex === idx && draggedIndex !== idx
								? 'var(--background)'
								: 'var(--foreground)',
						fontSize: isFullScreen ? '1rem' : '1.2rem',
						'&:hover': {
							color: 'var(--destructive)',
						},
					},
				}}
			/>
		</div>
	)
}

export const IngredientChip = memo(IngredientChipComponent)

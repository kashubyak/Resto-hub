export const selectTextFieldSx = {
	'& .MuiOutlinedInput-root': {
		backgroundColor: 'var(--input)',
		color: 'var(--foreground)',
		borderRadius: '8px',
		'& fieldset': {
			borderColor: 'var(--border)',
		},
		'&:hover fieldset': {
			borderColor: 'var(--primary)',
		},
		'&.Mui-focused fieldset': {
			borderColor: 'var(--primary)',
			borderWidth: '1px',
		},
	},
	'& .MuiInputBase-input': {
		color: 'var(--foreground)',
		padding: '8px 12px',
		fontSize: '14px',
	},
	'& .MuiSelect-icon': {
		color: 'var(--muted-foreground)',
	},
} as const

export const selectMenuProps = {
	PaperProps: {
		sx: {
			backgroundColor: 'var(--muted)',
			color: 'var(--foreground)',
			border: '0.3px solid var(--border)',
			borderRadius: '8px',
			marginTop: '2px',
			'& .MuiList-root': {
				paddingTop: 0,
				paddingBottom: 0,
			},
			'& .MuiMenuItem-root': {
				borderTop: '0.3px solid var(--border)',
				padding: '8px 12px',
				'&:hover': {
					backgroundColor: 'var(--muted-hover)',
				},
				'&.Mui-selected': {
					backgroundColor: 'var(--primary)',
					color: 'var(--stable-light)',
					'&:hover': {
						backgroundColor: 'var(--primary-hover)',
					},
				},
				'&:first-of-type': {
					borderTopLeftRadius: '8px',
					borderTopRightRadius: '8px',
					borderTop: '0px',
				},
				'&:last-of-type': {
					borderBottomLeftRadius: '8px',
					borderBottomRightRadius: '8px',
				},
			},
		},
	},
} as const

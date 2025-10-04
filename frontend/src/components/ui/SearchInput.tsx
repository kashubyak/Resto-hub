'use client'

import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

interface SearchInputProps {
	onSearch: (value: string) => void
	placeholder?: string
	debounceMs?: number
	className?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
	onSearch,
	placeholder = 'Search...',
	debounceMs = 500,
	className = '',
}) => {
	const [searchValue, setSearchValue] = useState('')

	const debouncedSearch = useCallback(
		(value: string) => {
			const timer = setTimeout(() => onSearch(value), debounceMs)
			return () => clearTimeout(timer)
		},
		[onSearch, debounceMs],
	)

	useEffect(() => {
		const cleanup = debouncedSearch(searchValue)
		return cleanup
	}, [searchValue, debouncedSearch])

	const handleClear = () => {
		setSearchValue('')
		onSearch('')
	}

	return (
		<TextField
			fullWidth
			value={searchValue}
			onChange={e => setSearchValue(e.target.value)}
			placeholder={placeholder}
			variant='outlined'
			size='small'
			className={className}
			sx={{
				'& .MuiOutlinedInput-root': {
					backgroundColor: 'var(--background)',
					color: 'var(--foreground)',
					borderRadius: '8px',
					transition: 'all 0.2s ease',
					'& fieldset': {
						borderColor: 'var(--border)',
						borderWidth: '1px',
					},
					'&:hover fieldset': {
						borderColor: 'var(--primary)',
					},
					'&.Mui-focused fieldset': {
						borderColor: 'var(--primary)',
						borderWidth: '2px',
					},
					'&.Mui-focused': {
						backgroundColor: 'var(--background)',
						boxShadow: '0 0 0 3px rgba(32, 123, 230, 0.1)',
					},
				},
				'& .MuiInputBase-input': {
					color: 'var(--foreground)',
					padding: '8px 12px',
					fontSize: '14px',
					'&::placeholder': {
						color: 'var(--muted-foreground)',
						opacity: 0.7,
					},
				},
				'& .MuiInputAdornment-root': {
					color: 'var(--muted-foreground)',
				},
				'& .MuiIconButton-root': {
					color: 'var(--muted-foreground)',
					transition: 'all 0.2s ease',
					'&:hover': {
						color: 'var(--foreground)',
						backgroundColor: 'var(--muted-hover)',
					},
				},
				'& .MuiSvgIcon-root': {
					fontSize: '20px',
				},
			}}
			InputProps={{
				startAdornment: (
					<InputAdornment position='start'>
						<SearchIcon />
					</InputAdornment>
				),
				endAdornment: searchValue && (
					<InputAdornment position='end'>
						<IconButton
							onClick={handleClear}
							edge='end'
							size='small'
							aria-label='clear search'
							sx={{
								padding: '4px',
							}}
						>
							<ClearIcon fontSize='small' />
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	)
}

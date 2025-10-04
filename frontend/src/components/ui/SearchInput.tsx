'use client'

import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

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

	useEffect(() => {
		const timer = setTimeout(() => onSearch(searchValue), debounceMs)
		return () => clearTimeout(timer)
	}, [searchValue, onSearch, debounceMs])

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
						>
							<ClearIcon />
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	)
}

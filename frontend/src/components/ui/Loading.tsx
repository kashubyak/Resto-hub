import CircularProgress from '@mui/material/CircularProgress'

export const Loading = () => {
	return <CircularProgress variant='determinate' value={25} />
}

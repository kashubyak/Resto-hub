export const convertToDays = (timeString: string): number => {
	const match = timeString.match(/^(\d+)([dhm])$/)
	if (!match) return 1

	const value = parseInt(match[1], 10)
	const unit = match[2]

	switch (unit) {
		case 'd':
			return value
		case 'h':
			return value / 24
		case 'm':
			return value / (24 * 60)
		case 's':
			return value / (24 * 60 * 60)
		default:
			return 1
	}
}

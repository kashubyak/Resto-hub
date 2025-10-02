const conversionCache = new Map<string, number>()
export const convertToDays = (timeString: string): number => {
	if (conversionCache.has(timeString)) return conversionCache.get(timeString)!

	const match = timeString.match(/^(\d+)([dhms])$/)
	if (!match) {
		conversionCache.set(timeString, 1)
		return 1
	}

	const value = parseInt(match[1], 10)
	const unit = match[2]

	let result: number
	switch (unit) {
		case 'd':
			result = value
			break
		case 'h':
			result = value / 24
			break
		case 'm':
			result = value / (24 * 60)
			break
		case 's':
			result = value / (24 * 60 * 60)
			break
		default:
			result = 1
	}

	conversionCache.set(timeString, result)
	return result
}
export const clearConversionCache = () => conversionCache.clear()

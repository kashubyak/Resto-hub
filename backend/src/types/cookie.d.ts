declare module 'cookie' {
	export function parse(
		str: string,
		options?: { decode?: (str: string) => string },
	): Record<string, string | undefined>
}

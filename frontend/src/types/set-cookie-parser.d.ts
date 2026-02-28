declare module 'set-cookie-parser' {
	import type { IncomingMessage } from 'node:http'

	export interface Cookie {
		name: string
		value: string
		path?: string
		domain?: string
		expires?: Date
		maxAge?: number
		secure?: boolean
		httpOnly?: boolean
		sameSite?: string
	}

	export interface ParseOptions {
		decodeValues?: boolean
		map?: boolean
		split?: boolean
	}

	export function parseSetCookie(
		input: string | string[] | IncomingMessage | Response,
		options?: ParseOptions,
	): Cookie[]
}

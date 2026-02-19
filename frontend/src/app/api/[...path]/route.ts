import http from 'node:http'
import https from 'node:https'
import { type NextRequest, NextResponse } from 'next/server'
import { parseSetCookie } from 'set-cookie-parser'

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000'

const ACCESS_TOKEN_COOKIE = 'access_token'
const AUTH_STATUS_COOKIE = 'is_authenticated'

function proxy(
	request: NextRequest,
	paramsPromise: Promise<{ path: string[] }>,
	body: ReadableStream<Uint8Array> | null | undefined,
): Promise<NextResponse> {
	return new Promise((resolve, reject) => {
		paramsPromise.then(({ path }) => {
			const pathStr = path.join('/')
			const url = new URL(request.url)
			const backendPath = `${backendUrl}/api/${pathStr}${url.search}`
			const backend = new URL(backendPath)
			const isHttps = backend.protocol === 'https:'
			const host = request.headers.get('host') ?? ''
			const cookie = request.headers.get('cookie') ?? ''
			const auth = request.headers.get('authorization') ?? ''
			const contentType = request.headers.get('content-type') ?? ''

			const options: http.RequestOptions = {
				method: request.method,
				hostname: backend.hostname,
				port: backend.port || (isHttps ? 443 : 80),
				path: backend.pathname + backend.search,
				headers: {
					'x-forwarded-host': host,
					cookie,
					authorization: auth,
				},
			}
			if (contentType)
				(options.headers as Record<string, string>)['content-type'] = contentType

			const doRequest = (reqBody: Buffer | undefined) => {
				if (
					reqBody &&
					(request.method === 'POST' ||
						request.method === 'PUT' ||
						request.method === 'PATCH')
				) {
					(options.headers as Record<string, string>)['content-length'] =
						String(reqBody.length)
				}
				const client = isHttps ? https : http
				const req = client.request(options, async (res) => {
					try {
						const chunks: Buffer[] = []
						for await (const chunk of res) chunks.push(chunk)
						const responseBody = Buffer.concat(chunks)

						const nextRes = new NextResponse(responseBody, {
							status: res.statusCode ?? 200,
							statusText: res.statusMessage,
						})

						const isProd = process.env.NODE_ENV === 'production'
						const sameSite = isProd ? ('strict' as const) : ('lax' as const)
						const rootDomain =
							process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'
						const cookieOptions = (maxAge: number, httpOnly: boolean) => {
							const opts: {
								path: string
								httpOnly: boolean
								secure: boolean
								sameSite: 'strict' | 'lax'
								maxAge: number
								domain?: string
							} = {
								path: '/',
								httpOnly,
								secure: isProd,
								sameSite,
								maxAge,
							}
							if (rootDomain !== 'localhost')
								opts.domain = `.${rootDomain}`
							return opts
						}

						const raw = res.rawHeaders
						const setCookieHeaders: string[] = raw
							? (() => {
									const out: string[] = []
									for (let i = 0; i < raw.length; i += 2) {
										const val = raw[i + 1]
										if (raw[i]?.toLowerCase() === 'set-cookie' && typeof val === 'string')
											out.push(val)
									}
									return out
								})()
							: []

						if (setCookieHeaders.length > 0) {
							const parsedCookies = parseSetCookie(setCookieHeaders, {
								decodeValues: true,
							})
							for (const c of parsedCookies) {
								const maxAge =
									c.maxAge ??
									(c.name === ACCESS_TOKEN_COOKIE ? 15 * 60 : 7 * 24 * 60 * 60)
								nextRes.cookies.set(c.name, c.value, {
									...cookieOptions(maxAge, c.name !== AUTH_STATUS_COOKIE),
								})
							}
						}

						// Fallback: set access_token from body for login/refresh (same-origin)
						if (
							res.statusCode === 200 &&
							(pathStr === 'auth/login' || pathStr === 'auth/refresh')
						) {
							try {
								const data = JSON.parse(responseBody.toString()) as {
									token?: string
									success?: boolean
								}
								if (data?.token && data?.success) {
									nextRes.cookies.set(ACCESS_TOKEN_COOKIE, data.token, {
										...cookieOptions(15 * 60, true),
									})
								}
							} catch {
								// ignore JSON parse errors
							}
						}

						const excludeHeaders = ['set-cookie', 'transfer-encoding']
						res.headers &&
							Object.entries(res.headers).forEach(([key, value]) => {
								const lower = key.toLowerCase()
								if (!excludeHeaders.includes(lower) && value)
									nextRes.headers.set(key, Array.isArray(value) ? value.join(', ') : value)
							})
						resolve(nextRes)
					} catch (err) {
						console.error('[proxy] error processing response', {
							path: pathStr,
							status: res.statusCode,
							error: err,
						})
						reject(err)
					}
				})
				req.on('error', (err) => {
					console.error('[proxy] request error', { path: pathStr, error: err })
					reject(err)
				})
				if (reqBody) req.write(reqBody)
				req.end()
			}

			if (
				body &&
				(request.method === 'POST' ||
					request.method === 'PUT' ||
					request.method === 'PATCH')
			) {
				const reader = body.getReader()
				const bufs: Uint8Array[] = []
				;(async () => {
					try {
						while (true) {
							const { done, value } = await reader.read()
							if (done) break
							if (value) bufs.push(value)
						}
						const reqBody = Buffer.concat(bufs)
						doRequest(reqBody)
					} catch (e) {
						console.error('[proxy] body read error', { path: pathStr, error: e })
						reject(e)
					}
				})()
			} else {
				doRequest(undefined)
			}
		}).catch(reject)
	})
}

async function proxyWithLogging(
	request: NextRequest,
	params: Promise<{ path: string[] }>,
	body: ReadableStream<Uint8Array> | null | undefined,
) {
	try {
		return await proxy(request, params, body)
	} catch (err) {
		const pathStr = (await params).path.join('/')
		console.error('[proxy] proxy failed', { path: pathStr, error: err })
		throw err
	}
}

export async function GET(
	request: NextRequest,
	context: { params: Promise<{ path: string[] }> },
) {
	return proxyWithLogging(request, context.params, undefined)
}

export async function POST(
	request: NextRequest,
	context: { params: Promise<{ path: string[] }> },
) {
	return proxyWithLogging(request, context.params, request.body)
}

export async function PUT(
	request: NextRequest,
	context: { params: Promise<{ path: string[] }> },
) {
	return proxyWithLogging(request, context.params, request.body)
}

export async function PATCH(
	request: NextRequest,
	context: { params: Promise<{ path: string[] }> },
) {
	return proxyWithLogging(request, context.params, request.body)
}

export async function DELETE(
	request: NextRequest,
	context: { params: Promise<{ path: string[] }> },
) {
	return proxyWithLogging(request, context.params, undefined)
}

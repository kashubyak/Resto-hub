import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createRemoteJWKSet, jwtVerify } from 'jose'

@Injectable()
export class SupabaseTokenVerifierService {
	private readonly jwks: ReturnType<typeof createRemoteJWKSet>

	constructor(configService: ConfigService) {
		const supabaseUrl = configService.getOrThrow<string>('SUPABASE_URL')
		this.jwks = createRemoteJWKSet(
			new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`),
		)
	}

	async verifyAccessToken(token: string): Promise<{ sub: string }> {
		const { payload } = await jwtVerify(token, this.jwks)
		const sub = payload.sub as string
		if (!sub) throw new Error('Missing sub')
		return { sub }
	}
}

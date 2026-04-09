import { ROUTES } from '@/constants/pages.constant'
import { createSerwistRoute } from '@serwist/turbopack'
import { spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

const gitHead = spawnSync('git', ['rev-parse', 'HEAD'], {
	encoding: 'utf8',
}).stdout?.trim()

const revision = gitHead && gitHead.length > 0 ? gitHead : randomUUID()

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
	createSerwistRoute({
		additionalPrecacheEntries: [{ url: ROUTES.PUBLIC.OFFLINE, revision }],
		swSrc: 'src/app/sw.ts',
		useNativeEsbuild: true,
		esbuildOptions: {
			target: 'es2022',
		},
	})

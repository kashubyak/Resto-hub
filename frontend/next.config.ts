import { DISH_IMAGE_S3_HOSTNAME } from './src/constants/dish-media.constant'
import { withSerwist } from '@serwist/turbopack'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	allowedDevOrigins: ['localhost', '127.0.0.1', 'lvh.me', '*.lvh.me'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: DISH_IMAGE_S3_HOSTNAME,
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'static.wixstatic.com',
				port: '',
				pathname: '/**',
			},
		],
	},
}

export default withSerwist(nextConfig)

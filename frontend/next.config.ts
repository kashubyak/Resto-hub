import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	allowedDevOrigins: ['localhost', '127.0.0.1', '*.localhost', 'lvh.me', '*.lvh.me'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'resto-hub.s3.eu-central-1.amazonaws.com',
				port: '',
				pathname: '/**',
			},
		],
	},
}

export default nextConfig

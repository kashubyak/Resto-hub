import { type Config } from 'tailwindcss'

const config: Config = {
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				muted: 'var(--muted)',
				'muted-foreground': 'var(--muted-foreground)',
				primary: 'var(--primary)',
				'primary-foreground': 'var(--primary-foreground)',
				secondary: 'var(--secondary)',
				'secondary-foreground': 'var(--secondary-foreground)',
				destructive: 'var(--destructive)',
				'destructive-foreground': 'var(--destructive-foreground)',
				warning: 'var(--warning)',
				'warning-foreground': 'var(--warning-foreground)',
				info: 'var(--info)',
				'info-foreground': 'var(--info-foreground)',
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				hover: 'var(--hover)',
				active: 'var(--active)',
			},
		},
	},
	plugins: [],
}

export default config

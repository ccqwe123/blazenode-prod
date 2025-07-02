import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
    ],
    prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
            backgroundImage: {
                'gradient-to-nv': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
            },
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'rgb(0 0 0)',
					// DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				blaze: {
					loginDark: '#2a282a',
					primary: '#ff2e00ba',
					secondary: '#ff603dde',
				},
				roller: {
					primary: '#a80019',
					secondary: '#9881FF',
					accent: '#FFD166',
					dark: '#1E1C3A',
					light: '#F5F3FF',
					success: '#06D6A0',
					warning: '#F0B90B',
					danger: '#EF476F',
					background: 'rgb(0 0 0)',
					default: '#8984b1',
					'card-bg': 'rgb(0 0 0)',
					// 'card-bg': '#282554',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
                accordionDown: {
                  from: { height: '0' },
                  to: { height: 'var(--radix-accordion-content-height)' },
                },
                accordionUp: {
                  from: { height: 'var(--radix-accordion-content-height)' },
                  to: { height: '0' },
                },
                pulseGlow: {
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '0.6' },
                },
                float: {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 },
                },
                scaleFadeIn: {
                  '0%': { transform: 'scale(0.9)', opacity: 0 },
                  '100%': { transform: 'scale(1)', opacity: 1 },
                },
            },
            animation: {
                accordionDown: 'accordionDown 0.2s ease-out',
                accordionUp: 'accordionUp 0.2s ease-out',
                pulseGlow: 'pulseGlow 2s infinite',
                float: 'float 3s ease-in-out infinite',
                fadeIn: 'fadeIn 0.3s ease-out',
                scaleFadeIn: 'scaleFadeIn 0.3s ease-out',
            },
		}
	},

    plugins: [require("tailwindcss-animate")],
    // plugins: [forms],
};

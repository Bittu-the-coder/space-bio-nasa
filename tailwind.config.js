import styles from './style.json'

const theme = styles.theme

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        background: theme.colors.background,
        surface: theme.colors.surface,
        'text-primary': theme.colors.textPrimary,
        'text-secondary': theme.colors.textSecondary,
        border: theme.colors.border,
        highlight: theme.colors.highlight,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
      },
      fontFamily: {
        'heading': [theme.fonts.heading],
        'body': [theme.fonts.body],
        'mono': [theme.fonts.mono],
      },
      spacing: {
        'xs': theme.spacing.xs,
        'sm': theme.spacing.sm,
        'md': theme.spacing.md,
        'lg': theme.spacing.lg,
        'xl': theme.spacing.xl,
      },
      borderRadius: {
        'sm': theme.radius.sm,
        'md': theme.radius.md,
        'lg': theme.radius.lg,
        'xl': theme.radius.xl,
      },
      boxShadow: {
        'card': theme.shadows.card,
        'button': theme.shadows.button,
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
    },
  },
  plugins: [],
}

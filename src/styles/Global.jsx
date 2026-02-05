import { Global } from '@emotion/react'
import { colors } from './styles'

const GlobalTheme = () => (
  <Global
    styles={{
      [['html', 'body']]: {
        height: '100%',
      },
      body: {
        margin: 0,
        padding: 0,
        fontFamily: "'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: colors.accent[100],
        color: colors.neutral[900],
        lineHeight: 1.6,
      },
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
      '#root': {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      },
      '*': {
        boxSizing: 'border-box',
      },
      [['h1', 'h2', 'h3', 'h4', 'h5', 'h6']]: {
        margin: 0,
        fontWeight: 700,
        lineHeight: 1.25,
      },
      h1: {
        fontSize: '2rem',
      },
      h2: {
        fontSize: '1.5rem',
      },
      h3: {
        fontSize: '1.25rem',
      },
      h4: {
        fontSize: '1.125rem',
      },
      h5: {
        fontSize: '1rem',
      },
      h6: {
        fontSize: '0.875rem',
      },
      'button, input, select, textarea': {
        fontFamily: 'inherit',
      },
    }}
  />
)

export default GlobalTheme

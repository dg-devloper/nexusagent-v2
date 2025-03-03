import { createTheme } from '@mui/material/styles'

// assets
import colors from '@/assets/scss/_themes-vars.module.scss'

// project imports
import componentStyleOverrides from './compStyleOverride'
import themePalette from './palette'
import themeTypography from './typography'

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
    const color = colors

    const themeOption = {
        colors: color,
        heading: 'rgb(33, 43, 54)',
        paper: '#fff',
        backgroundDefault: '#f9fafb',
        background: '#fff',
        darkTextPrimary: 'rgb(33, 43, 54)',
        darkTextSecondary: 'rgb(99, 115, 129)',
        textDark: 'rgb(33, 43, 54)',
        menuSelected: 'rgb(25, 118, 210)',
        menuSelectedBack: 'rgba(25, 118, 210, 0.08)',
        divider: 'rgba(145, 158, 171, 0.12)',
        customization
    }

    const themeOptions = {
        direction: 'ltr',
        palette: themePalette(themeOption),
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        typography: themeTypography(themeOption),
        components: {
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        paddingTop: 8,
                        paddingBottom: 8,
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.12)'
                            }
                        }
                    }
                }
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        minWidth: 36,
                        color: 'rgb(99, 115, 129)'
                    }
                }
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        height: 20,
                        padding: '0 6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: 6
                    }
                }
            }
        }
    }

    const themes = createTheme({
        ...themeOptions,
        colors: themeOption.colors // Add colors to the theme object directly
    })

    themes.components = {
        ...themes.components,
        ...componentStyleOverrides(themeOption)
    }

    return themes
}

export default theme

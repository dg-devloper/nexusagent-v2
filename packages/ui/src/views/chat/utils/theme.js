// Theme configuration for the chat UI
import { createTheme } from '@mui/material/styles';

// Light theme colors - more professional and muted
export const lightTheme = {
    primary: {
        main: '#4F46E5',      // Indigo - more professional
        light: '#6366F1',
        dark: '#3730A3',
        contrastText: '#FFFFFF'
    },
    secondary: {
        main: '#0284C7',      // Blue - more muted
        light: '#0EA5E9',
        dark: '#0369A1',
        contrastText: '#FFFFFF'
    },
    background: {
        default: '#F9FAFB',   // Main background
        paper: '#FFFFFF',     // Component background
        sidebar: '#F3F4F6'    // Sidebar background
    },
    text: {
        primary: '#111827',   // Main text
        secondary: '#4B5563', // Secondary text
        disabled: '#9CA3AF',  // Disabled text
        hint: '#6B7280'       // Hint text
    },
    divider: '#E5E7EB',
    success: {
        main: '#059669',      // More muted green
        light: '#10B981',
        dark: '#047857'
    },
    error: {
        main: '#DC2626',      // More muted red
        light: '#EF4444',
        dark: '#B91C1C'
    },
    warning: {
        main: '#D97706',      // More muted amber
        light: '#F59E0B',
        dark: '#B45309'
    },
    info: {
        main: '#2563EB',      // More muted blue
        light: '#3B82F6',
        dark: '#1D4ED8'
    }
};

// Dark theme colors - more professional and muted
export const darkTheme = {
    primary: {
        main: '#6366F1',      // Indigo for dark mode
        light: '#818CF8',
        dark: '#4F46E5',
        contrastText: '#FFFFFF'
    },
    secondary: {
        main: '#0EA5E9',      // Blue for dark mode
        light: '#38BDF8',
        dark: '#0284C7',
        contrastText: '#FFFFFF'
    },
    background: {
        default: '#111827',   // Dark background
        paper: '#1F2937',     // Dark component background
        sidebar: '#374151'    // Dark sidebar background
    },
    text: {
        primary: '#F9FAFB',   // Dark mode main text
        secondary: '#E5E7EB', // Dark mode secondary text
        disabled: '#9CA3AF',  // Dark mode disabled text
        hint: '#D1D5DB'       // Dark mode hint text
    },
    divider: '#374151',
    success: {
        main: '#059669',
        light: '#10B981',
        dark: '#047857'
    },
    error: {
        main: '#DC2626',
        light: '#EF4444',
        dark: '#B91C1C'
    },
    warning: {
        main: '#D97706',
        light: '#F59E0B',
        dark: '#B45309'
    },
    info: {
        main: '#2563EB',
        light: '#3B82F6',
        dark: '#1D4ED8'
    }
};

// Simplified visual effects with fewer gradients
export const effects = {
    // Simplified gradients with more subtle color transitions
    gradients: {
        primary: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
        secondary: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
        success: '#059669',  // Solid colors instead of gradients for better professionalism
        error: '#DC2626',
        warning: '#D97706',
        info: '#2563EB',
        dark: '#1F2937',
        light: '#F9FAFB'
    },
    shadows: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    glass: {
        light: {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)'
        },
        dark: {
            backgroundColor: 'rgba(17, 24, 39, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.06)'
        }
    }
};

// Create theme with configuration - consistent border radius
export const createAppTheme = (mode = 'light') => {
    const themeColors = mode === 'dark' ? darkTheme : lightTheme;
    
    return createTheme({
        palette: themeColors,
        shape: {
            borderRadius: 8  // Consistent border radius
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontWeight: 700,
                fontSize: '2.5rem'
            },
            h2: {
                fontWeight: 700,
                fontSize: '2rem'
            },
            h3: {
                fontWeight: 600,
                fontSize: '1.5rem'
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.25rem'
            },
            h5: {
                fontWeight: 600,
                fontSize: '1rem'
            },
            h6: {
                fontWeight: 600,
                fontSize: '0.875rem'
            },
            subtitle1: {
                fontSize: '1rem',
                fontWeight: 500
            },
            subtitle2: {
                fontSize: '0.875rem',
                fontWeight: 500
            },
            body1: {
                fontSize: '1rem'
            },
            body2: {
                fontSize: '0.875rem'
            },
            button: {
                textTransform: 'none',
                fontWeight: 500
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 500,
                        padding: '8px 16px'
                    },
                    contained: {
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        boxShadow: mode === 'dark' 
                            ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
                            : '0 2px 8px rgba(0, 0, 0, 0.06)'
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 8
                    }
                }
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 8
                    }
                }
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 8
                    }
                }
            }
        }
    });
};

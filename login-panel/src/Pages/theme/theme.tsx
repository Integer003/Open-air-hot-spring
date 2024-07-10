// theme.ts
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        h4: {
            marginBottom: '20px',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    marginBottom: '20px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    margin: '10px 0',
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
    },
    typography: {
        h4: {
            marginBottom: '20px',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    marginBottom: '20px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    margin: '10px 0',
                },
            },
        },
    },
});

export const themes = {
    light: lightTheme,
    dark: darkTheme,
};

// theme.ts
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    typography: {
        fontFamily: '"ZCOOL KuaiLe", sans-serif',
        h4: {
            marginBottom: '20px',
        },
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
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
    typography: {
        fontFamily: '"ZCOOL KuaiLe", sans-serif',
        h4: {
            marginBottom: '20px',
        },
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
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

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
        // MuiCssBaseline: {
        //     styleOverrides: {
        //         body: {
        //             backgroundImage: 'url(/Users/integer/Desktop/THU_1c/1Type_safe_practices_for_frontend_and_backend_development/Open-air-hot-spring/login-panel/src/images/CoolSky.jpg)',
        //             backgroundSize: 'cover',
        //             backgroundRepeat: 'no-repeat',
        //             backgroundPosition: 'center center',
        //         },
        //     },
        // },
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
        // MuiCssBaseline: {
        //     styleOverrides: {
        //         body: {
        //             backgroundImage: '/Users/integer/Desktop/THU_1c/1Type_safe_practices_for_frontend_and_backend_development/Open-air-hot-spring/login-panel/src/images/WitchingHour.jpg',
        //             backgroundSize: 'cover',
        //             backgroundRepeat: 'no-repeat',
        //             backgroundPosition: 'center center',
        //         },
        //     },
        // },
    },
});

export const themes = {
    light: lightTheme,
    dark: darkTheme,
};

// AppBarComponent.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Theme, ThemeProvider } from '@mui/material';
import { Brightness4, Brightness7, Language } from '@mui/icons-material';
import { themes } from './theme';
import logo from '../../images/summer.png';

interface AppBarComponentProps {
    themeMode: 'light' | 'dark';
    setThemeMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({ themeMode, setThemeMode, setLanguage }) => {
    const toggleTheme = () => {
        setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    const toggleLanguage = () => {
        setLanguage(prevLanguage => prevLanguage === 'zh' ? 'en' : 'zh');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    某二手交易网站
                    {/* 假设 logo 是一个导入的图片资源 */}
                    <img src={logo} alt="logo" style={{ width: '40px', height: '40px' }} />
                </Typography>
                <IconButton color="inherit" onClick={toggleTheme}>
                    {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
                </IconButton>
                <IconButton color="inherit" onClick={toggleLanguage}>
                    <Language />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarComponent;

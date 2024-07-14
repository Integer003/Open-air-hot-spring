import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7, Language, ArrowBack } from '@mui/icons-material';
import { themes } from './theme';
import logo from '../../images/summer.png';
import { useHistory } from 'react-router-dom';
import { useThemeStore } from '../store'; // 确保路径正确

interface AppBarComponentProps {
    historyPath?: string; // 可选的 historyPath 属性
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({ historyPath }) => {
    const history = useHistory();
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();

    const toggleTheme = () => {
        storeThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

    const toggleLanguage = () => {
        storeLanguageType(languageType === 'zh' ? 'en' : 'zh');
    };

    const handleBack = () => {
        if (historyPath) {
            history.goBack();
           // history.push(historyPath);
        }
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                {historyPath && (
                    <IconButton color="inherit" onClick={handleBack} style={{ marginRight: 'auto' }}>
                        <ArrowBack />
                    </IconButton>
                )}
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                        OpenAirHS二手交易网站
                    </Typography>
                    <img src={logo} alt="logo" style={{ width: '40px', height: '40px', marginLeft: '10px' }} />
                </Box>
                <IconButton color="inherit" onClick={toggleTheme}>
                    {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
                </IconButton>
                {/*<IconButton color="inherit" onClick={toggleLanguage}>
                    <Language />
                </IconButton>*/}
            </Toolbar>
        </AppBar>
    );
};

export default AppBarComponent;
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { OperatorLoginMessage } from 'Plugins/OperatorAPI/OperatorLoginMessage'
import { OperatorRegisterMessage } from 'Plugins/OperatorAPI/OperatorRegisterMessage'
import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage'
import { UserRegisterMessage } from 'Plugins/UserAPI/UserRegisterMessage'
import { AddUserMessage } from 'Plugins/OperatorAPI/AddUserMessage'
import logo from '../images/summer.png';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import {
    AppBar,
    Alert,
    Toolbar,
    Typography,
    Button,
    Container,
    CssBaseline,
    Box,
    ThemeProvider,
    createTheme,
    FormHelperText,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import { Brightness4, Brightness7, Language } from '@mui/icons-material';

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
});

const themes = {
    light: lightTheme,
    dark: darkTheme,
};

type ThemeMode = 'light' | 'dark';

export function RegisterPage() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('doctor'); // 默认用户类型
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文


    const sendPostRequest = async (message: API) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
        } catch (error) {
            if (isAxiosError(error)) {
                // Check if the error has a response and a data property
                if (error.response && error.response.data) {
                    console.error('Error sending request:', error.response.data);
                } else {
                    console.error('Error sending request:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    const isFormValid = () => {
        return password === confirmPassword;
    };

    const handleRegister = async () => {
        if (!isFormValid()) {
            alert('密码和确认密码不匹配，请重新输入！');
            return;
        }
        if (userType === 'User') {
            sendPostRequest(new OperatorRegisterMessage(username, password));
        } else {
            sendPostRequest(new UserRegisterMessage(username, password));
        }
    };

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'zh' ? 'en' : 'zh'));
    };

    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        某二手商品交易网
                        <img src={logo} alt="logo" style={{width: '40px', height: '40px'}}/>
                    </Typography>
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {themeMode === 'light' ? <Brightness4/> : <Brightness7/>}
                    </IconButton>
                    <IconButton color="inherit" onClick={toggleLanguage}>
                        <Language/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div>
                <Typography variant="h1" sx={{fontSize: '2rem', textAlign: 'center'}}>
                    {language === 'zh' ? '注册' : 'Register'}
                </Typography>


                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label={language === 'zh' ? '用户名' : 'Username'}
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label={language === 'zh' ? '密码' : 'Password'}
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label={language === 'zh' ? '确认密码' : 'Confirm Password'}
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {language === 'zh' ? '用户类型' : 'User type'}
                            </InputLabel>
                            <Select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value as string)}
                            >
                                <MenuItem value="doctor">{language === 'zh' ? '用户' : 'User'}</MenuItem>
                                <MenuItem value="patient">{language === 'zh' ? '监管方' : 'Regulator'}</MenuItem>
                                <MenuItem value="patient">{language === 'zh' ? '运营方' : 'Operator'}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        disabled={!isFormValid()}
                    >
                        {language === 'zh' ? '注册' : 'Register'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => history.goBack()}
                        sx={{m: 1}}
                    >
                        {language === 'zh' ? '返回登录' : 'Back to Login'}
                    </Button>
                </Grid>
            </div>
        </ThemeProvider>

    );
}
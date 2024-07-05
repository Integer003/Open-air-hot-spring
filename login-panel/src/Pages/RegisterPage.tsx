import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { OperatorLoginMessage } from 'Plugins/OperatorAPI/OperatorLoginMessage'
import { OperatorRegisterMessage } from 'Plugins/OperatorAPI/OperatorRegisterMessage'
import { SellerLoginMessage } from 'Plugins/SellerAPI/SellerLoginMessage'
import { SellerRegisterMessage } from 'Plugins/SellerAPI/SellerRegisterMessage'
import { AddSellerMessage } from 'Plugins/OperatorAPI/AddSellerMessage'
import { RegulatorRegisterMessage} from 'Plugins/RegulatorAPI/RegulatorRegisterMessage'
import { RegulatorLoginMessage} from 'Plugins/RegulatorAPI/RegulatorLoginMessage'
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
    const [userType, setUserType] = useState('Seller'); // 默认用户类型
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文


    const sendPostRequest = async (message: API) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            // if (response.data == "lalalalala") { alert(response.data); }
            alert("注册成功！");
            history.push('/');
        } catch (error) {
            if (isAxiosError(error)) {
                alert("注册失败！");
                history.push('/');
                // Check if the error has a response and a data property
                if (error.response && error.response.data) {
                    console.error('Error response data:', error.response.data);
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
        if (userType === 'Seller') {
            sendPostRequest(new SellerRegisterMessage(username, password));
        } else if (userType === 'Operator'){
            sendPostRequest(new OperatorRegisterMessage(username, password));
        } else if (userType === 'Regulator'){
            sendPostRequest(new RegulatorRegisterMessage(username, password));
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
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        某二手商品交易网
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
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                        {language === 'zh' ? '注册' : 'Register'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            label={language === 'zh' ? '用户名' : 'Username'}
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label={language === 'zh' ? '密码' : 'Password'}
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label={language === 'zh' ? '确认密码' : 'Confirm Password'}
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>{language === 'zh' ? '用户类型' : 'User type'}</InputLabel>
                            <Select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value as string)}
                            >
                                <MenuItem value="Seller">{language === 'zh' ? '用户' : 'Seller'}</MenuItem>
                                <MenuItem value="Regulator">{language === 'zh' ? '监管方' : 'Regulator'}</MenuItem>
                                <MenuItem value="Operator">{language === 'zh' ? '运营方' : 'Operator'}</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRegister}
                            disabled={!isFormValid()}
                            sx={{ mt: 1, mb: 2 }}
                        >
                            {language === 'zh' ? '注册' : 'Register'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => history.goBack()}
                            sx={{ mb: 2 }}
                        >
                            {language === 'zh' ? '返回登录' : 'Back to Login'}
                        </Button>
                    </FormControl>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
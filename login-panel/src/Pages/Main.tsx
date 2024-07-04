// 主页面组件，可能是应用加载时首先展示的页面
import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { OperatorLoginMessage } from 'Plugins/OperatorAPI/OperatorLoginMessage'
import { OperatorRegisterMessage } from 'Plugins/OperatorAPI/OperatorRegisterMessage'
import { SellerLoginMessage } from 'Plugins/SellerAPI/SellerLoginMessage'
import { SellerRegisterMessage } from 'Plugins/SellerAPI/SellerRegisterMessage'
import { RegulatorLoginMessage} from 'Plugins/RegulatorAPI/RegulatorLoginMessage'
import { RegulatorRegisterMessage} from 'Plugins/RegulatorAPI/RegulatorRegisterMessage'
import { AddSellerMessage } from 'Plugins/OperatorAPI/AddSellerMessage'
import { useHistory } from 'react-router';
import logo from '../images/summer.png';

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

export function Main(){
    const history=useHistory()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Seller'); // 默认用户类型为Seller
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文

    const sendPostRequest = async (message: API) => {
        try {
            const response = await axios.post(message.getURL(), JSON.stringify(message), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response status:', response.status);
            console.log('Response body:', response.data);
            if(response.data=="Valid Seller") {
                history.push('/SellerMain');
            }
            else if (response.data=="Invalid Seller"){
                alert("登陆失败！请确认用户名&密码！");
            }
            else if(response.data=="Valid Regulator") {
                history.push('/RegulatorMain');
            }
            else if (response.data=="Invalid Regulator"){
                alert("登陆失败！请确认用户名&密码！");
            }
            else if(response.data=="Valid Operator") {
                history.push('/OperatorMain');
            }
            else if (response.data=="Invalid Operator"){
                alert("登陆失败！请确认用户名&密码！");
            }
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

    const handleLogin = () => {
        if (userType === 'Seller') {
            sendPostRequest(new SellerLoginMessage(username, password));
        } else if(userType === 'regulator') {
            sendPostRequest(new RegulatorLoginMessage(username, password));
        } else if (userType === 'operator') {
            sendPostRequest(new OperatorLoginMessage(username, password));
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
                        <img src={logo} alt="logo" style={{ width: '40px', height: '40px' }}/>
                    </Typography>
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
                    </IconButton>
                    <IconButton color="inherit" onClick={toggleLanguage}>
                        <Language />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <FormControl sx={{ width: '400px' }}>
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                        {language === 'zh' ? '登录' : 'Login'}
                    </Typography>
                    <Grid container spacing={2} justifyContent="center" direction="column">
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
                        <Grid item xs={6} md={4}>
                                <InputLabel>
                                    {language === 'zh' ? '用户类型' : 'User type'}
                                </InputLabel>
                                <Select
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value as string)}
                                >
                                    <MenuItem value="Seller">{language === 'zh' ? '用户' : 'Seller'}</MenuItem>
                                    <MenuItem value="Regulator">{language === 'zh' ? '监管方' : 'Regulator'}</MenuItem>
                                    <MenuItem value="Operator">{language === 'zh' ? '运营方' : 'Operator'}</MenuItem>
                                </Select>
                        </Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLogin}
                                sx={{ m: 1 }}
                            >
                                {language === 'zh' ? '登录' : 'Login'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => history.push('/register')} // 假设注册页面的路由是'/register'
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {language === 'zh' ? '还没有账号？去注册' : 'Don\'t have an account? Register'}
                            </Button>
                    </Grid>
                </Box>
             </FormControl>
            </Container>
        </ThemeProvider>
    );
}



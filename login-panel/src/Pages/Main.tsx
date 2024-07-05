// 主页面组件，可能是应用加载时首先展示的页面
import React, { useState, useEffect } from 'react';
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
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
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
import { sendPostRequest } from './tool/apiRequest';

type ThemeMode = 'light' | 'dark';

export function Main(){
    const history=useHistory()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Seller'); // 默认用户类型为Seller
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文

    const [responseData, setResponseData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);


    const handleLogin = async () => {
        try {
            let message: API | undefined;
            if (userType === 'Seller') {
                message = new SellerLoginMessage(username, password);
            } else if (userType === 'Regulator') {
                message = new RegulatorLoginMessage(username, password);
            } else if (userType === 'Operator') {
                message = new OperatorLoginMessage(username, password);
            }
            if (!message) {
                throw new Error('Invalid user type');
            }
            const data =await sendPostRequest(message);
            setResponseData(data);

        } catch (error) {
            setError(error.message);
        }
    };
    useEffect(() => {
        if (responseData) {
            if(responseData=="Valid Seller") {
                alert("登陆成功");
                history.push('/SellerMain');
            }
            else if(responseData=="Valid Regulator") {
                alert("登陆成功");
                history.push('/RegulatorMain');
            }
            else if(responseData=="Valid Operator") {
                alert("登陆成功");
                history.push('/OperatorMain');
            }
            else{
                alert("登陆失败！请确认用户名&密码！");
            }
        }
    }, [responseData]); // 监听responseData的变化

    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                setLanguage={setLanguage}
            />
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                        {language === 'zh' ? '登录' : 'Login'}
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
                            onClick={handleLogin}
                            sx={{ mt: 1, mb: 2 }}
                        >
                            {language === 'zh' ? '登录' : 'Login'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => history.push('/register')} // 假设注册页面的路由是'/register'
                            sx={{ mb: 2 }}
                        >
                            {language === 'zh' ? '还没有账号？去注册' : 'Don\'t have an account? Register'}
                        </Button>
                    </FormControl>
                </Box>
            </Container>
        </ThemeProvider>
    );
}



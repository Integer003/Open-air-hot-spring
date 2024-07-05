// 主页面组件，可能是应用加载时首先展示的页面
// Hook是与外界交互变化，历史就是最简单的hook。让GPT帮你写，然后让他帮你解释。使用hook定义的东西需要用use开头
import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { OperatorLoginMessage } from 'Plugins/OperatorAPI/OperatorLoginMessage'
// import { OperatorRegisterMessage } from 'Plugins/OperatorAPI/OperatorRegisterMessage'
import { SellerLoginMessage } from 'Plugins/SellerAPI/SellerLoginMessage'
// import { SellerRegisterMessage } from 'Plugins/SellerAPI/SellerRegisterMessage'
import { RegulatorLoginMessage} from 'Plugins/RegulatorAPI/RegulatorLoginMessage'
// import { RegulatorRegisterMessage} from 'Plugins/RegulatorAPI/RegulatorRegisterMessage'
// import { AddSellerMessage } from 'Plugins/OperatorAPI/AddSellerMessage'
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

// 手绘图加截图，GPT可以帮你写得很不错，风格：CSS。交互：纯函数，hooks
export function Main(){
    const history=useHistory()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Seller'); // 默认用户类型为Seller
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文
    // 前端只用管发送什么信息，包装一个函数，后面怎么发怎么接都是前后端交互的功能。后端接受对应的消息，执行相应的数据库操作，返回相应的值。
    // 后端一直在固定端口听着在。理解了理论再实际设计。
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
        } else if(userType === 'Regulator') {
            sendPostRequest(new RegulatorLoginMessage(username, password));
        } else if (userType === 'Operator') {
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
                        OpenAirHP二手商品交易网
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
                            {language === 'zh' ? '还没有账号？去注册' : 'Don\'t have an account? Register!'}
                        </Button>
                    </FormControl>
                </Box>
            </Container>
        </ThemeProvider>
    );
}



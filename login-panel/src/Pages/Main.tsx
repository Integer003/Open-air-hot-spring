// 主页面组件，可能是应用加载时首先展示的页面
import React, { useState, useEffect, useContext } from 'react';
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
import { useUserStore } from './store';
import { useThemeStore } from './store';
import BackgroundImage from 'Pages/theme/BackgroungImage'

type ThemeMode = 'light' | 'dark';

export function Main(){
    const history=useHistory()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Seller'); // 默认用户类型为Seller
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();

    const [responseData, setResponseData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { storeUserName } = useUserStore();
    const { storeUserType } = useUserStore();

    const init = async () => {
        storeUserName('');
        storeUserType('Seller');
    }
    useEffect(() => {
        init();
    }, []);

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
            if ((responseData as string).startsWith('Valid')){
                alert(username+"登录成功");
                storeUserName(username);
                storeUserType(userType);
            }else{
                alert("登录失败！请确认用户名&密码！");
            }
            if(responseData=="Valid Seller") {
                history.push('/SellerMain');
            }
            else if(responseData=="Valid Regulator") {
                // alert("登录成功");
                history.push('/RegulatorMain');
            }
            else if(responseData=="Valid Operator") {
                // alert("登录成功");
                history.push('/OperatorMain');
            }
        }
    }, [responseData]); // 监听responseData的变化

    return (
        <BackgroundImage themeMode={themeMode}>
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent />
            <div className="content-with-appbar">
                <Container maxWidth="sm" sx={{ mt: 4,
                    bgcolor: themeMode =='light'? 'rgba(255, 255, 255, 0.8)': 'rgba(152,160,244,0.8)', p: 4, borderRadius: 2 }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h1" sx={{ fontSize: '2rem', color: '#333' }}>
                            {languageType === 'zh' ? '登录' : 'Login'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FormControl sx={{ width: '100%' }}>
                            <TextField
                                label={languageType === 'zh' ? '用户名' : 'Username'}
                                variant="outlined"
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor:themeMode =='light'? 'white': 'rgba(82,89,136,0.8)' } }}
                            />
                            <TextField
                                label={languageType === 'zh' ? '密码' : 'Password'}
                                variant="outlined"
                                type="password"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor:themeMode =='light'? 'white': 'rgba(112,117,177,0.8)' } }}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel sx={{ color: '#333' }}>{languageType === 'zh' ? '用户类型' : 'User type'}</InputLabel>
                                <Select
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value as string)}
                                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' } }}
                                >
                                    <MenuItem value="Seller">{languageType === 'zh' ? '用户' : 'Seller'}</MenuItem>
                                    <MenuItem value="Regulator">{languageType === 'zh' ? '监管方' : 'Regulator'}</MenuItem>
                                    <MenuItem value="Operator">{languageType === 'zh' ? '运营方' : 'Operator'}</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLogin}
                                sx={{ mt: 1, mb: 2 }}
                            >
                                {languageType === 'zh' ? '登录' : 'Login'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => history.push('/register')}
                                sx={{ mb: 2, borderColor: '#333', color: '#333' }}
                            >
                                {languageType === 'zh' ? '还没有账号？去注册' : 'Don\'t have an account? Register'}
                            </Button>
                        </FormControl>
                    </Box>
                </Container>
            </div>

        </ThemeProvider>
        </BackgroundImage>
);
}



import React, { useEffect, useState } from 'react'
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
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { sendPostRequest } from './tool/apiRequest';

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
import BackgroundImage from 'Pages/theme/BackgroungImage'
import { useThemeStore } from 'Pages/store'

type ThemeMode = 'light' | 'dark';

export function RegisterPage() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('Seller'); // 默认用户类型
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();


    const isFormValid = () => {
        return password === confirmPassword && username!='' && password!='';
    };

    const [responseData, setResponseData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);


    const handleRegister = async () => {
        if (!isFormValid()) {
            return;
        }
        try {
            let message: API | undefined;

            if (userType === 'Seller') {
                message = new SellerRegisterMessage(username, password);
            } else if (userType === 'Regulator') {
                message = new RegulatorRegisterMessage(username, password);
            } else if (userType === 'Operator') {
                message = new OperatorRegisterMessage(username, password);
            }

            if (!message) {
                throw new Error('Invalid user type');
            }
            const data = await sendPostRequest(message);
            setResponseData(data);
        } catch (error) {
            setError(error.message);
            alert("注册失败");
        }
    };

    useEffect(() => {
        if (responseData) {
            if (responseData=="Operation(s) done successfully"){
                alert("注册成功！");
                history.push('/');
            }else{
                alert("注册失败！");
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
                            {languageType === 'zh' ? '注册' : 'Register'}
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
                            <TextField
                                label={languageType === 'zh' ? '确认密码' : 'Confirm Password'}
                                variant="outlined"
                                type="password"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                onClick={handleRegister}
                                disabled={!isFormValid()}
                                sx={{ mt: 1, mb: 2 }}
                            >
                                {languageType === 'zh' ? '注册' : 'Register'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => history.goBack()}
                                sx={{ mb: 2, borderColor: '#333', color: '#333' }}
                            >
                                {languageType === 'zh' ? '返回登录' : 'Back to Login'}
                            </Button>
                        </FormControl>
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
        </BackgroundImage>
);
}
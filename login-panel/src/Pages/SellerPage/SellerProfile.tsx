import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
    CssBaseline,
    Box,
    ThemeProvider,
    TextField,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Container,
} from '@mui/material';
import {
    Brightness4,
    Brightness7,
    Language,
    Person as PersonIcon,
    Logout as LogoutIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useThemeStore, useUserStore } from '../store'
import { SellerCancelMessage } from 'Plugins/SellerAPI/SellerCancelMessage';
import ConfirmDialog from '../tool/ConfirmDialog';
import { SellerQueryMoneyMessage } from 'Plugins/SellerAPI/SellerQueryMoneyMessage';
import { SellerRechargeMessage } from 'Plugins/SellerAPI/SellerRechargeMessage';
import BackgroundImage from 'Pages/theme/BackgroungImage'
import { SendNews } from 'Pages/tool/SendNews'

type ThemeMode = 'light' | 'dark';

export function SellerProfile() {
    const history = useHistory();
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();
    const [error, setError] = useState<string | null>(null);
    const { userName } = useUserStore();
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (confirmed: boolean) => {
        setOpen(false);
        setResult(confirmed ? 'Confirmed' : 'Cancelled');
    };

    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);

    const handleCancel = async () => {
        try {
            const message = new SellerCancelMessage(userName);
            const data = await sendPostRequest(message);
            setResponseData(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (result === 'Confirmed') {
            handleCancel();
        }
    }, [result]);

    const [responseData, setResponseData] = useState<any>('');

    useEffect(() => {
        if (responseData) {
            if (responseData === "User successfully deleted") {
                alert(userName + "注销成功");
                history.push('/');
            } else {
                alert("注销失败！");
            }
        }
    }, [responseData]);

    const [responseData1, setResponseData1] = useState<any>('');

    const handleQueryMoney = async () => {
        try {
            const message = new SellerQueryMoneyMessage(userName);
            const data = await sendPostRequest(message);
            setResponseData1(data);
        } catch (error) {
            setError(error.message);
            setResponseData1('error');
        }
    };

    const init = async () => {
        handleQueryMoney();
        //SendNews(userName,'seller','any','登录成功！');
    };

    useEffect(() => {
        init();
    }, []);

    const [rechargeMoney, setRechargeMoney] = useState(0);
    const [rechargeMoneyResponse, setRechargeMoneyResponse] = useState('');

    const handleRechargeMoney = async (money: number) => {
        try {
            const message = new SellerRechargeMessage(userName, money);
            const data = await sendPostRequest(message);
            setRechargeMoneyResponse(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (rechargeMoneyResponse) {
            if (typeof rechargeMoneyResponse === 'string' && rechargeMoneyResponse.startsWith("Success")) {
                alert("充值成功");
                init();
            } else {
                alert("充值失败！");
            }
        }
    }, [rechargeMoneyResponse]);

    return (
        <BackgroundImage themeMode={themeMode}>
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent historyPath={'/SellerMain'} />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h2" component="h1" gutterBottom>
                        个人中心
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        欢迎, {userName}!
                    </Typography>
                </Box>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <Card sx={{ backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff', color: themeMode === 'dark' ? '#cbe681' : '#333333' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    当前余额: {responseData1} 元
                                </Typography>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    required
                                    name="price"
                                    label="充值金额"
                                    type="number"
                                    id="price"
                                    value={rechargeMoney}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value)) {
                                            setRechargeMoney(value);
                                        }
                                    }}
                                    InputLabelProps={{
                                        style: { color: themeMode === 'dark' ? '#cbe681' : '#333333' },
                                    }}
                                    InputProps={{
                                        style: { color: themeMode === 'dark' ? '#cbe681' : '#333333' },
                                    }}
                                />
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleRechargeMoney(rechargeMoney)}
                                    sx={{
                                        backgroundColor: '#1976d2',
                                        '&:hover': { backgroundColor: '#1565c0' },
                                    }}
                                >
                                    充值
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff', color: themeMode === 'dark' ? '#cbe681' : '#333333' }}>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => history.push('/SellerMain')}
                                    sx={{
                                        backgroundColor: '#d32f2f',
                                        '&:hover': { backgroundColor: '#c62828' },
                                    }}
                                >
                                    返回
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleOpen}
                                    sx={{
                                        backgroundColor: '#f44336',
                                        '&:hover': { backgroundColor: '#e53935' },
                                    }}
                                >
                                    注销
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
                <ConfirmDialog
                    open={open}
                    onConfirm={() => handleClose(true)}
                    onCancel={() => handleClose(false)}
                    title="提示"
                    message="您确定要注销吗？"
                />
            </Container>
        </ThemeProvider>
        </BackgroundImage>
    );
}

// 主页面组件，可能是应用加载时首先展示的页面
import React, { useState, useEffect, useContext } from 'react'
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { useHistory, useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from '../../images/summer.png';
import {
    AppBar,
    Typography,
    Button,
    Container,
    CssBaseline,
    Drawer,
    Toolbar,
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
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Card,
    CardContent,
    CardMedia,
} from '@mui/material';
import { Brightness4, Brightness7, Language } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import InboxIcon from '@mui/icons-material/Create';
import MessageIcon from '@mui/icons-material/Message';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useUserStore } from '../store'
import { SellerCancelMessage } from 'Plugins/SellerAPI/SellerCancelMessage'
import ConfirmDialog from '../tool/ConfirmDialog';
import { SellerQueryMoneyMessage } from 'Plugins/SellerAPI/SellerQueryMoneyMessage'
import { SellerRechargeMessage } from 'Plugins/SellerAPI/SellerRechargeMessage'


type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;

export function SellerProfile(){
    const history=useHistory()
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文
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
            console.log(`欢迎, {userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);

    const handleCancel = async () => {
        try {
            const message = new SellerCancelMessage(userName);
            const data = await sendPostRequest(message);
            setResponseData(data);
        } catch (error) {
            setError(error.message);
        }

    }

    useEffect(() => {
        if (result === 'Confirmed') {
            handleCancel();
        }
    }, [result]);

    const [responseData, setResponseData] = useState<any>('');

    useEffect(() => {
        if (responseData) {
            if (responseData=="User successfully deleted"){
                alert(userName+"注销成功");
                history.push('/');
            }else{
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
    }


    const init = async() => {
        handleQueryMoney();
    }

    useEffect(() => {
        init();
    }, []);


    const [rechargeMoney, setRechargeMoney] = useState(0);
    const [rechargeMoneyResponse, setRechargeMoneyResponse] = useState('');

    const handleRechargeMoney = async (money: number) => {
        try {
            const message = new SellerRechargeMessage(userName,money);
            const data = await sendPostRequest(message);
            setRechargeMoneyResponse(data);
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        if (rechargeMoneyResponse) {
            if (typeof rechargeMoneyResponse==='string' && rechargeMoneyResponse.startsWith("Success")){
                alert("充值成功");
                init();
            }else{
                alert("充值失败！");
            }
        }
    }, [rechargeMoneyResponse]);


    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                setLanguage={setLanguage}
            />
            <div>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                        <h1>个人中心！</h1>
                        <p>欢迎, {userName}!</p>
                    </Typography>
                </Box>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <p>你有{responseData1}元</p>
                </Box>
                <TextField
                    margin="normal"
                    required
                    name="price"
                    label="充值金额"
                    type="number"
                    id="price"
                    value={rechargeMoney}
                    onChange={(e) => {
                        const value =
                            parseInt(e.target.value);
                        if (!isNaN(value)) {
                            setRechargeMoney(value);
                        }
                    }}
                />
                <Button onClick={()=>handleRechargeMoney(rechargeMoney)}>
                    充值
                </Button>

                <Button onClick={()=>history.push('./SellerMain')}>
                    返回
                </Button>
                <Button onClick={handleOpen}>
                    注销
                </Button>
                <ConfirmDialog
                    open={open}
                    onConfirm={() => handleClose(true)}
                    onCancel={() => handleClose(false)}
                    title="提示"
                    message="您确定要注销吗？"
                />
            </div>

        </ThemeProvider>
    );
}



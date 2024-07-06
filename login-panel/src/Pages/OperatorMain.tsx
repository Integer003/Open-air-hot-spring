// 主页面组件，可能是应用加载时首先展示的页面
import React, { useState, useEffect, useContext } from 'react'
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { useHistory, useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from '../images/summer.png';
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
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { sendPostRequest } from './tool/apiRequest';
import { useUserStore } from './store'
import { SellerCancelMessage } from 'Plugins/SellerAPI/SellerCancelMessage'
import ConfirmDialog from './tool/ConfirmDialog';



type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;



export function OperatorMain(){
    const history=useHistory()
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文
    const [responseData, setResponseData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { userName } = useUserStore();

    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);



    useEffect(() => {
        if (userName) {
            console.log(`欢迎, {userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);




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
                        <h1>运营方主页！</h1>
                        <p>欢迎, {userName}!</p>
                    </Typography>
                </Box>

                <Button onClick={()=>history.push('./')}>
                    返回
                </Button>
            </div>

        </ThemeProvider>
    );
}



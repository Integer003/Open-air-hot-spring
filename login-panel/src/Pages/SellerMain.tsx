// 主页面组件，可能是应用加载时首先展示的页面
import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
// import { LoginMessage } from 'Plugins/DoctorAPI/LoginMessage'
// import { RegisterMessage } from 'Plugins/DoctorAPI/RegisterMessage'
// import { PatientLoginMessage } from 'Plugins/PatientAPI/PatientLoginMessage'
// import { PatientRegisterMessage } from 'Plugins/PatientAPI/PatientRegisterMessage'
// import { AddPatientMessage } from 'Plugins/DoctorAPI/AddPatientMessage'
import { useHistory } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from '../images/summer.png';
import cppImage from '../images/c-.png'
import pythonImage from '../images/python.png'
import scalaImage from '../images/scala.png'

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

const UnreadIndicator = ({ count }: { count: number }) => { if (count === 0) return null;

    return (
        <span style={{
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
        }}>
      {count}
    </span>
    );
};



type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;

const products = [
    { id: 1, title: 'C++', image: cppImage, description: 'C++ is a beautiful language' },
    { id: 2, title: 'python', image: pythonImage, description: 'python is a beautiful language' },
    { id: 3, title: 'scala', image: scalaImage, description: 'but scala is the most beautiful language' },
    // 在此处添加更多商品
];

const ProductList = () => (
    <Grid container spacing={2}>
        {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Button>
                <Card>
                    <CardMedia
                        component="img"
                        height="140"
                        image={product.image}
                        alt={product.title}
                        sx={{ height: 200, objectFit: 'contain' }} // resize the image
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {product.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {product.description}
                        </Typography>
                    </CardContent>
                </Card>
                </Button>
            </Grid>
        ))}
    </Grid>
);


export function SellerMain(){
    const history=useHistory()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('doctor'); // 默认用户类型为医生
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文

    const unreadMessagesCount = 5;

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


    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'zh' ? 'en' : 'zh'));
    };

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        尊敬的用户，您好！
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
            <div>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="temporary"
                anchor={'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
            >
                <Toolbar />
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', height: 10, paddingTop: theme => theme.spacing(1) }}>
                    <List>
                        <ListItemButton onClick={() => { /* 处理点击事件 */ }}>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="个人中心" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { /* 处理点击事件 */ }}>
                            <ListItemIcon>
                                <ReceiptIcon />
                            </ListItemIcon>
                            <ListItemText primary="消费记录" />

                        </ListItemButton>
                        <ListItemButton onClick={() => { /* 处理点击事件 */ }}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="货仓" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { /* 处理点击事件 */ }}>
                            <ListItemIcon>
                                <MessageIcon />
                            </ListItemIcon>
                            <ListItemText primary="消息" />
                        </ListItemButton>
                        <ListItemButton onClick={() => history.push('/')}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="退出" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                这里是商品浏览区域
                <Box sx={{ mt: 2 }}>
                    <ProductList />
                </Box>
            </Box>
                {!mobileOpen && (
                    <Button
                        onClick={handleDrawerToggle}
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: '90%',
                            transform: 'translateY(-50%)',
                            zIndex: 1000,
                            cursor: 'pointer', // 鼠标悬停时显示指针手势
                            padding: '10px', // 按钮的内边距
                            color: 'white', // 图标颜色
                            backgroundColor: 'grey', // 按钮背景颜色，使用对比色
                        }}
                    >
                        <ListItemIcon>
                            <ArrowForwardIcon />
                        </ListItemIcon>
                        <UnreadIndicator count={unreadMessagesCount} />
                    </Button>
                )}
            </div>
        </ThemeProvider>
    );
}



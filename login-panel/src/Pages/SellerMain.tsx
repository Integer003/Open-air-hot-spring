// 主页面组件，可能是应用加载时首先展示的页面
import React, { useEffect, useState, useContext } from 'react'
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { useHistory, useParams } from 'react-router-dom'
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
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { sendPostRequest } from './tool/apiRequest';
import { useUserStore } from './store'
import {UnreadIndicator} from './tool/Apps'



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
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文

    const unreadMessagesCount = 5;

    const [mobileOpen, setMobileOpen] = React.useState(false);


    const { userName } = useUserStore();


    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ?{userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                setLanguage={setLanguage}
            />
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
                        <ListItem>
                            {decodeURIComponent(userName)},你好！
                        </ListItem>
                        <ListItemButton onClick={() => history.push(`/SellerProfile`)}>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="个人中心" />
                        </ListItemButton>
                        <ListItemButton onClick={() => {}}>
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



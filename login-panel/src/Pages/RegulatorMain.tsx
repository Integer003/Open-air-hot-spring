import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
    CssBaseline,
    Box,
    ThemeProvider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material'
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { sendPostRequest } from './tool/apiRequest';
import { useUserStore } from './store';
import { ShowTableMessage } from 'Plugins/OperatorAPI/ShowTableMessage';
import DeleteIcon from '@mui/icons-material/Delete';
import { del } from 'idb-keyval'
import {
    Add as AddIcon, ArrowForward as ArrowForwardIcon,
    Home as HomeIcon, Logout as LogoutIcon,
    Message as MessageIcon,
    Person as PersonIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material'
import { UnreadIndicator } from 'Pages/tool/Apps'

type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;


export function RegulatorMain() {
    const history = useHistory();
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { userName } = useUserStore();

    const unreadMessagesCount=5;

    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);


    const init = async () => {
        try {
            const message = new ShowTableMessage();
            const data = await sendPostRequest(message);
            setResponseTableData(data); // 假设返回的数据是字符串，如果不是，需要转换
        } catch (error: any) {
            setError(error.message);
            setResponseTableData('error');
        }
    };

    useEffect(() => {
        init();
    }, []);

    const [mobileOpen, setMobileOpen] = useState(false);
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
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                        <h1>监管方主页！</h1>
                        <p>欢迎, {userName}!</p>
                    </Typography>
                </Box>
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
                            <ListItem>{decodeURIComponent(userName)}, 你好！</ListItem>
                            <ListItemButton onClick={() => history.push(`/RegulatorProfile`)}>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="个人中心" />
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
                    </Button>)}
                <Button onClick={() => history.push('./')}>
                    返回
                </Button>

            </div>
        </ThemeProvider>
    );
}

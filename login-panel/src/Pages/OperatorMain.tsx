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
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
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
import { SellerLoginMessage } from 'Plugins/SellerAPI/SellerLoginMessage'
import { RegulatorLoginMessage } from 'Plugins/RegulatorAPI/RegulatorLoginMessage'
import { OperatorLoginMessage } from 'Plugins/OperatorAPI/OperatorLoginMessage'
import { ShowTableMessage } from 'Plugins/OperatorAPI/ShowTableMessage'
import {parseDataString} from './tool/Apps'



type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;



export function OperatorMain(){
    const history=useHistory()
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文
    const [responseTableData, setResponseTableData] = useState<any>(null);
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

    const initData = async () => {
        try {
            const message = new ShowTableMessage();
            const data = await sendPostRequest(message);
            setResponseTableData(data); // 假设返回的数据是字符串，如果不是，需要转换
        } catch (error) {
            setError(error.message);
            setResponseTableData('error');
        }
    };

    type UserData = {
        userName: string;
        password: string;
    };

    const [tableData, setTableData] = useState<UserData[]>([]);

    useEffect(() => {
        // 假设 responseTableData 是通过异步操作更新的
        // 这里添加数据更新逻辑，例如通过API请求
        // 模拟异步更新数据
        initData();

        // 模拟定时更新数据
        const intervalId = setInterval(() => {
            initData();
        }, 5000);

        // 组件卸载时清除定时器
        return () => clearInterval(intervalId);
    }, []); // 空依赖数组，只在组件挂载时执行

    useEffect(() => {
        // 解析 responseTableData 字符串
        if (typeof responseTableData != 'string' )
            setResponseTableData('error');
        const parsedData = parseDataString(responseTableData);
        setTableData(parsedData);
    }, [responseTableData]); // 当 responseTableData 更新时执行



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
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        用户数据
                    </Typography>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>用户名</TableCell>
                                <TableCell>密码</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {row.userName}
                                    </TableCell>
                                    <TableCell>{row.password}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
                <Button onClick={()=>history.push('./')}>
                    返回
                </Button>
            </div>

        </ThemeProvider>
    );
}



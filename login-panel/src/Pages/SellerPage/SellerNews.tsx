// 主页面组件，可能是应用加载时首先展示的页面
import React, { useState, useEffect, useContext } from 'react'
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { useHistory, useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import logo from '../../images/summer.png';
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
    Table,
    Card,
    CardContent,
    CardMedia,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog,
} from '@mui/material'
import { Add as AddIcon, Brightness4, Brightness7, Language } from '@mui/icons-material'
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
import { useThemeStore, useUserStore } from '../store'
import { SellerCancelMessage } from 'Plugins/SellerAPI/SellerCancelMessage'
import ConfirmDialog from '../tool/ConfirmDialog';
import { SellerQueryStorageMessage } from 'Plugins/SellerAPI/SellerQueryStorageMessage'
import DeleteIcon from '@mui/icons-material/Delete'
import { SellerCancelGoodsMessage } from 'Plugins/SellerAPI/SellerCancelGoodsMessage'
import BackgroundImage from 'Pages/theme/BackgroungImage'
import { ReadNewsMessage } from 'Plugins/SellerAPI/ReadNewsMessage'
import { QueryNewsMessage } from 'Plugins/SellerAPI/QueryNewsMessage'



type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;

type NewsData = {
    NewsId: string;
    Receiver: string;
    ReceiverType: string;
    NewsType: string;
    NewsTime: string;
    content: string;
    condition: string;
};

const parseDataString = (dataString: string): NewsData[] => {
    // Parse the JSON string into an array of objects
    const parsedArray = JSON.parse(dataString);

    // Map the parsed objects to the GoodsData format
    return parsedArray.map((item: any) => ({
        NewsId: item.newsId,
        Receiver: item.receiver,
        ReceiverType: item.receiverType,
        NewsType: item.newsType,
        NewsTime: item.newsTime,
        content: item.content,
        condition: item.condition,
    }));
};


export function SellerNews() {
    const history = useHistory()
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();
    const [responseData, setResponseData] = useState<any>(null);
    const { userName } = useUserStore();

    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const [tableData, setTableData] = useState<NewsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);


    const init = async () => {
        try {
            const message = new QueryNewsMessage(userName, 'seller');
            const data = await sendPostRequest(message);
            setResponseTableData(data);
        } catch (error: any) {
            setError(error.message);
            setResponseTableData('error');
        }
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (typeof responseTableData === 'string') {
            const parsedData = parseDataString(responseTableData);
            setTableData(parsedData);
        }
    }, [responseTableData]);



    const [readResponse, setReadResponce] = useState<string | null>(null);

    useEffect(() => {
        if (readResponse) {
            // alert(deleteResponse);
            if (typeof readResponse==='string' && readResponse.startsWith("Success")){
                console.log("已读成功！");
            }else{
                console.log("已读失败！");
            }
        }
    }, [readResponse]);


    const handleRead =async (news: NewsData) => {
        setSelectedNews(news);
        if (selectedNews) {
            try {
                const message = new ReadNewsMessage(selectedNews?.NewsId);
                const data = await sendPostRequest(message);
                setReadResponce(data);
            } catch (error) {
                setError(error.message);
            }
            init()
        }
    };


    return (
        <BackgroundImage themeMode={themeMode}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline />
                <AppBarComponent historyPath={'/SellerMain'} />
                <div className="content-with-appbar">
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                            <p>欢迎, {userName}来到消息系统!</p>
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
                            <p>消息列表</p>
                        </Typography>
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>消息类型</TableCell>
                                <TableCell>消息时间</TableCell>
                                <TableCell>消息内容</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((news) => (
                                <ListItemButton key={news.NewsTime} onClick={() => handleRead(news)}
                                                sx={{ pl: 0, width: '100%' ,
                                                    backgroundColor: news.condition ? 'transparent' : '#FFF2C2', // 未读消息的背景色为黄色
                                                    color: news.condition ? 'black' : 'black',}}
                                >
                                    <ListItemText
                                        primaryTypographyProps={{
                                        variant: 'body1',
                                        component: 'div'
                                        }}
                                        secondaryTypographyProps={{
                                            color: news.condition ? 'text.secondary' : 'inherit' // 继承未读消息的文本颜色
                                        }}
                                    >
                                        <Typography variant="body1" component="div">
                                            <div>{news.NewsType}</div>
                                            <div>{news.NewsTime}</div>
                                            <div>{news.content}</div>
                                        </Typography>
                                    </ListItemText>
                                </ListItemButton>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </ThemeProvider>
        </BackgroundImage>
    );
}



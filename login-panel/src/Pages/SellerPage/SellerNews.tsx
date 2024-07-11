import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    CssBaseline,
    Box,
    Button,
    ThemeProvider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    ListItemButton,
    ListItemText
} from '@mui/material';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useThemeStore, useUserStore } from '../store';
import BackgroundImage from 'Pages/theme/BackgroungImage';
import { ReadNewsMessage } from 'Plugins/SellerAPI/ReadNewsMessage';
import { QueryNewsMessage } from 'Plugins/SellerAPI/QueryNewsMessage';

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
    const parsedArray = JSON.parse(dataString);
    return parsedArray.map((item: any) => ({
        NewsId: item.newsID,
        Receiver: item.receiver,
        ReceiverType: item.receiverType,
        NewsType: item.newsType,
        NewsTime: item.newsTime,
        content: item.content,
        condition: item.condition,
    }));
};

export function SellerNews() {
    const history = useHistory();
    const { themeMode } = useThemeStore();
    const { userName } = useUserStore();

    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [tableData, setTableData] = useState<NewsData[]>([]);
    const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);
    const [readResponse, setReadResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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
            // 按时间排序
            const sortedData = parsedData.sort((a, b) => new Date(b.NewsTime).getTime() - new Date(a.NewsTime).getTime());
            setTableData(sortedData);
        }
    }, [responseTableData]);

    useEffect(() => {
        if (readResponse) {
            if (typeof readResponse === 'string' && readResponse.startsWith("Success")) {
                console.log("已读成功！");
            } else {
                console.log("已读失败！");
            }
        }
    }, [readResponse]);

    const handleRead = async (news: NewsData) => {
        setSelectedNews(news);
        if (news) {
            try {
                //alert(news.NewsId);
                const message = new ReadNewsMessage(news.NewsId);
                const data = await sendPostRequest(message);
                setReadResponse(data);
            } catch (error) {
                setError(error.message);
            }
            init();
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
                                <TableCell align="center">消息类型</TableCell>
                                <TableCell align="center">消息时间</TableCell>
                                <TableCell align="center">消息内容</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((news) => (
                                <TableRow key={news.NewsId}
                                          sx={{ backgroundColor: news.condition=='true' ? 'transparent' : '#8581dd', color: news.condition ? 'black' : 'black' }}
                                          onClick={() => handleRead(news)}
                                >
                                    <TableCell align="center">{news.NewsType}</TableCell>
                                    <TableCell align="center">{news.NewsTime}</TableCell>
                                    <TableCell align="center">{news.content}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </ThemeProvider>
        </BackgroundImage>
    );
}

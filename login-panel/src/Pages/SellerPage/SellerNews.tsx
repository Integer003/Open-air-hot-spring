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
    Pagination,
    IconButton
} from '@mui/material';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useThemeStore, useUserStore } from '../store';
import BackgroundImage from 'Pages/theme/BackgroungImage';
import { ReadNewsMessage } from 'Plugins/SellerAPI/ReadNewsMessage';
import { QueryNewsMessage } from 'Plugins/SellerAPI/QueryNewsMessage';
import { Drafts, Email, Notifications, Info, Storefront, StarBorder, Comment, Check  } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import DraftsIcon from '@mui/icons-material/Drafts';

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

const getIconByNewsType = (newsType: string) => {
    switch (newsType) {
        case 'star':
            return <StarBorder />;
        case 'comment':
            return <Comment />;
        case 'verify':
            return <Check />;
        case 'buy':
            return <Storefront />;
        default:
            return <Info />;
    }
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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 7;

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
                const message = new ReadNewsMessage(news.NewsId);
                const data = await sendPostRequest(message);
                setReadResponse(data);
            } catch (error) {
                setError(error.message);
            }
            init();
        }
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <BackgroundImage themeMode={themeMode}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline />
                <AppBarComponent historyPath={'/SellerMain'} />
                <div className="content-with-appbar" >
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                            {userName}的消息中心！
                        </Typography>
                    </Box>
                    <Table sx={{ mb: 4, textAlign: 'center' , bgcolor: themeMode =='light'? 'rgba(255, 255, 255, 0.8)': 'rgba(152,160,244,0.8)', p: 4, borderRadius: 2 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">消息类型</TableCell>
                                <TableCell align="center">消息内容</TableCell>
                                <TableCell align="center">消息时间</TableCell>
                                <TableCell align='center'>标记已读</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((news) => (
                                <TableRow key={news.NewsId}
                                          sx={{ backgroundColor: news.condition=='true' ? 'transparent' : '#8581dd', color: news.condition ? 'black' : 'black' }}
                                >
                                    <TableCell align="center">
                                        {getIconByNewsType(news.NewsType)}
                                    </TableCell>
                                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                                        {news.content}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: 'gray' }}>
                                        {new Date(news.NewsTime).toLocaleString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleRead(news)}>
                                            {news.condition === 'true' ? <DraftsIcon /> : <EmailIcon />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={Math.ceil(tableData.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </Box>
                </div>
            </ThemeProvider>
        </BackgroundImage>
    );
}

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
    CssBaseline,
    Box,
    ThemeProvider,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useGoodsStore, useUserStore } from '../store';
import { GoodsQueryCommentsMessage } from 'Plugins/GoodsAPI/GoodsQueryCommentsMessage'
import { GoodsAddCommentsMessage } from 'Plugins/GoodsAPI/GoodsAddCommentsMessage'
import { GoodsBuyMessage } from 'Plugins/GoodsAPI/GoodsBuyMessage'
import logo from '../../images/summer.png';

type ThemeMode = 'light' | 'dark';

type CommentsData = {
    CommentId: number;
    SenderName: string;
    GoodsId: number;
    CommentsTime: string;
    Content: string;
};

const parseDataString = (dataString: string): CommentsData[] => {
    const parsedArray = JSON.parse(dataString);
    return parsedArray.map((item: any) => ({
        CommentId: item.commentId,
        SenderName: item.senderName,
        GoodsId: item.goodsId,
        CommentsTime: item.time,
        Content: item.content,
    }));
};

export function GoodsMain() {
    const history = useHistory();
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh');
    const { userName } = useUserStore();
    const { goodsId, goodsName, goodsPrice, goodsDescription, goodsSeller } = useGoodsStore();
    const [tableData, setTableData] = useState<CommentsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [buyResponse, setBuyResponse] = useState<string | null>(null);
    const [commentsResponse, setCommentsResponse] = useState<string | null>(null);

    const init = async () => {
        try {
            const message = new GoodsQueryCommentsMessage(goodsId);
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

    const handleBuy = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (buyResponse) {
            if (typeof buyResponse === 'string' && buyResponse.startsWith('Success')) {
                alert(goodsName + '购买成功');
                history.push('./sellerMain');
            } else {
                alert('购买失败！');
            }
        }
    }, [buyResponse]);

    const handleConfirmBuy = async () => {
        try {
            const message = new GoodsBuyMessage(userName, goodsId);
            const data = await sendPostRequest(message);
            setBuyResponse(data);
        } catch (error) {
            setError(error.message);
        }
        handleClose();
    };

    const handleComments = async (myComments: string) => {
        try {
            const message = new GoodsAddCommentsMessage(goodsId, userName, myComments);
            const data = await sendPostRequest(message);
            setCommentsResponse(data);
            init();
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (commentsResponse) {
            if (typeof commentsResponse === 'string' && commentsResponse.startsWith('Success')) {
                alert('评论成功');
                init();
            } else {
                alert('评论失败');
            }
        }
    }, [commentsResponse]);

    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                setLanguage={setLanguage}
                historyPath={'/SellerMain'}
                // TODO: if a regulator come in? or just another page?
            />
            <div className="content-with-appbar">
                <Box sx={{ mb: 4, textAlign: 'center', padding: 3 }}>
                    <Typography variant="h4" sx={{ fontSize: '2rem', mb: 3 }}>
                        商品详情
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} md={6} lg={4}>
                            <Card sx={{
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                '&:hover': { boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)' }
                            }}>
                                <CardMedia component="img" height="200" image={logo} alt="商品图片" />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {goodsName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {goodsDescription}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        卖家：{goodsSeller}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        商品价格：{goodsPrice}元
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                        商品评论
                    </Typography>
                    <List>
                        {tableData.map((item) => (
                            <ListItem key={item.CommentsTime}>
                                <ListItemText primary={item.Content}
                                              secondary={`${item.SenderName} ${item.CommentsTime}`} />
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                        <TextField
                            id="myComment"
                            label="评论"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleComments((document.getElementById('myComment') as HTMLInputElement).value)}
                            sx={{ ml: 2 }}
                        >
                            发送
                        </Button>
                    </Box>
                    <Button
                        onClick={handleBuy}
                        sx={{
                            backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
                            color: themeMode === 'dark' ? '#99dc10' : '#99dc10',
                            '&:hover': {
                                backgroundColor: themeMode === 'dark' ? '#333333' : '#f5f5f5',
                            },
                            mt: 2,
                        }}
                    >
                        <AddShoppingCartIcon /> 购买
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>确认购买</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                你确定要购买商品 {goodsName} 吗？
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                取消
                            </Button>
                            <Button onClick={handleConfirmBuy} color="secondary">
                                确认
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button variant="outlined" color="primary" onClick={() => history.push('/SellerMain')}
                            sx={{ mt: 2 }}>
                        返回
                    </Button>
                </Box>
            </div>
        </ThemeProvider>
);
}

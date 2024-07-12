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
import { AddShoppingCart as AddShoppingCartIcon, RemoveShoppingCart, Star as StarIcon } from '@mui/icons-material'
import { ShoppingBag as ShoppingBagIcon } from '@mui/icons-material';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useGoodsStore, useThemeStore, useUserStore } from '../store'
import { GoodsQueryCommentsMessage } from 'Plugins/GoodsAPI/GoodsQueryCommentsMessage'
import { GoodsAddCommentsMessage } from 'Plugins/GoodsAPI/GoodsAddCommentsMessage'
import { GoodsBuyMessage } from 'Plugins/GoodsAPI/GoodsBuyMessage'
import BackgroundImage from 'Pages/theme/BackgroungImage'
import { GoodsDeleteStarMessage } from 'Plugins/GoodsAPI/GoodsDeleteStarMessage'
import { GoodsAddStarMessage } from 'Plugins/GoodsAPI/GoodsAddStarMessage'
import { SellerDeleteGoodsCartMessage } from 'Plugins/SellerAPI/SellerDeleteGoodsCartMessage'
import { SellerAddGoodsCartMessage } from 'Plugins/SellerAPI/SellerAddGoodsCartMessage'
import { SellerQueryGoodsMessage } from 'Plugins/SellerAPI/SellerQueryGoodsMessage'
import { SellerQueryGoodsIsStarredMessage } from 'Plugins/SellerAPI/SellerQueryGoodsIsStarredMessage'
import { SellerQueryGoodsIsCartMessage } from 'Plugins/SellerAPI/SellerQueryGoodsIsCartMessage'
import { SendNews } from 'Pages/tool/SendNews'

type ThemeMode = 'light' | 'dark';

type CommentsData = {
    CommentId: number;
    SenderName: string;
    GoodsId: number;
    CommentsTime: string;
    Content: string;
};

const parseDataStringComments = (dataString: string): CommentsData[] => {
    const parsedArray = JSON.parse(dataString);
    return parsedArray.map((item: any) => ({
        CommentId: item.commentId,
        SenderName: item.senderName,
        GoodsId: item.goodsId,
        CommentsTime: item.time,
        Content: item.content,
    }));
};

type GoodsData = {
    GoodsId: string;
    GoodsName: string;
    GoodsPrice: string;
    GoodsDescription: string;
    GoodsSeller: string;
    GoodsStar: string;
    ImageUrl: string;
};

const parseDataStringGoods = (dataString: string): GoodsData[] => {
    const parsedArray = JSON.parse(dataString);
    return parsedArray.map((item: any) => ({
        GoodsId: item.goodsID,
        GoodsName: item.goodsName,
        GoodsPrice: item.price,
        GoodsDescription: item.description,
        GoodsSeller: item.sellerName,
        GoodsStar: item.star,
        ImageUrl: item.imageUrl,
    }));
};

export function GoodsMain() {
    const history = useHistory();
    const { themeMode } = useThemeStore();
    const { userName } = useUserStore();
    const { goodsId, goodsName, goodsPrice, goodsDescription, goodsSeller, goodsStar } = useGoodsStore();
    const [tableData, setTableData] = useState<CommentsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [buyResponse, setBuyResponse] = useState<string | null>(null);
    const [commentsResponse, setCommentsResponse] = useState<string | null>(null);

    const [tableGoodsData, setTableGoodsData] = useState<GoodsData[]>([]);
    const [responseTableGoodsData, setResponseTableGoodsData] = useState<any>(null);
    const [tableStarData, setTableStarData] = useState<string[]>([]);
    const [responseTableStarData, setResponseTableStarData] = useState<any>(null);
    const [tableCartData, setTableCartData] = useState<string[]>([]);
    const [responseTableCartData, setResponseTableCartData] = useState<any>(null);

    const init = async () => {
        try {
            const message = new GoodsQueryCommentsMessage(goodsId);
            const data = await sendPostRequest(message);
            setResponseTableData(data);
            const messageGoods = new SellerQueryGoodsMessage(userName);
            const dataGoods = await sendPostRequest(messageGoods);
            setResponseTableGoodsData(dataGoods);
            const messageStar = new SellerQueryGoodsIsStarredMessage(userName);
            const dataStar = await sendPostRequest(messageStar);
            setResponseTableStarData(dataStar);
            const messageCart = new SellerQueryGoodsIsCartMessage(userName);
            const dataCart = await sendPostRequest(messageCart);
            setResponseTableCartData(dataCart);
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
            const parsedData = parseDataStringComments(responseTableData);
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

    useEffect(() => {
        if (typeof responseTableGoodsData === 'string') {
            const parsedData = parseDataStringGoods(responseTableGoodsData);
            parsedData.sort((a, b) => parseInt(a.GoodsId) - parseInt(b.GoodsId));
            setTableGoodsData(parsedData);
        }
    }, [responseTableGoodsData]);

    function extractGoodsIDs(dataString: string): string[] {
        const parts = dataString.split('"goodsID"');
        const goodsIDs: string[] = [];
        for (let i = 1; i < parts.length; i++) {
            const start = parts[i].indexOf('"') + 1;
            const end = parts[i].indexOf('"', start);
            const goodsID = parts[i].substring(start, end);
            goodsIDs.push(goodsID);
        }
        return goodsIDs;
    }

    useEffect(() => {
        if (typeof responseTableStarData === 'string') {
            const parsedData = extractGoodsIDs(responseTableStarData);
            setTableStarData(parsedData);
        }
    }, [responseTableStarData]);

    const { storeGoodsStar } = useGoodsStore();

    const handleToggleStar = async () => {
        try {
            const message = tableStarData.includes(goodsId) ? new GoodsDeleteStarMessage(goodsId, userName) : new GoodsAddStarMessage(goodsId, userName);
            await sendPostRequest(message);
            init();
            storeGoodsStar(goodsStar);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (typeof responseTableCartData === 'string') {
            const parsedData = extractGoodsIDs(responseTableCartData);
            setTableCartData(parsedData);
        }
    }, [responseTableCartData]);

    const handleToggleCart = async () => {
        try {
            const message = tableCartData.includes(goodsId) ? new SellerDeleteGoodsCartMessage(goodsId, userName) : new SellerAddGoodsCartMessage(goodsId, userName);
            await sendPostRequest(message);
            init();
        } catch (error: any) {
            setError(error.message);
        }
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
                SendNews(goodsSeller, 'seller', 'comment', '商品' + goodsName + '收到了'+userName+'的评论');
                init();
            } else {
                alert('评论失败');
            }
        }
    }, [commentsResponse]);

    return (
        <ThemeProvider theme={themes[themeMode]}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <CssBaseline />
                <AppBar position="relative">
                    <AppBarComponent />
                </AppBar>
                <Box component="main" sx={{ flex: '1' }}>
                    <Grid container spacing={3} alignItems="center">
                        {tableGoodsData.map((goods) => (
                            <Grid item key={goods.GoodsId} xs={12} sm={6} md={4} lg={3}>
                                <Card>
                                    <CardMedia component="img" height="140" image={goods.ImageUrl} alt={goods.GoodsName} />
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {goods.GoodsName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {goods.GoodsDescription}
                                        </Typography>
                                        <Typography variant="body1">
                                            价格: {goods.GoodsPrice} 元
                                        </Typography>
                                        <Typography variant="body1">
                                            卖家: {goods.GoodsSeller}
                                        </Typography>
                                        <Typography variant="body1">
                                            Star 数量: {goods.GoodsStar}
                                        </Typography>
                                        <Button startIcon={<AddShoppingCartIcon />} onClick={handleBuy}>
                                            购买
                                        </Button>
                                        <Button startIcon={<StarIcon />} onClick={handleToggleStar}>
                                            {tableStarData.includes(goods.GoodsId) ? '取消 Star' : 'Star'}
                                        </Button>
                                        <Button startIcon={<RemoveShoppingCart />} onClick={handleToggleCart}>
                                            {tableCartData.includes(goods.GoodsId) ? '从购物车移除' : '加入购物车'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>确认购买</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        确定要购买该商品吗？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={handleConfirmBuy} color="primary">
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

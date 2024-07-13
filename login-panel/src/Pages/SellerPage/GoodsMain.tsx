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
    let parsedArray;
    try {
        parsedArray = JSON.parse(dataString);
    } catch (error) {
        console.error('Error parsing JSON:', error); // 还没有消息的时候是空，所以无法解析[?]不太确定，但是应该是这样的
        return [];
    }

    if (!Array.isArray(parsedArray)) {
        console.error('Parsed data is not an array:', parsedArray);
        return [];
    }

    return parsedArray.map((item: any) => ({
        CommentId: item.commentId,
        SenderName: item.senderName,
        GoodsId: item.goodsId,
        CommentsTime: item.time,
        Content: item.content,
    }));
};

const Minio = require('minio');

// MinIO 客户端配置
const minioClient = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'LecfJHLf0PQxlbZqCN2O',
    secretKey: 'vhOva5RaWe2Qcf5u7iKtTE4KGX4WCx3wfAQcjFJB'
});

function generatePresignedUrl(imageUrl: string) {
    return new Promise((resolve, reject) => {
        // 从 URL 中提取存储桶名称和对象键
        const urlParts = new URL(imageUrl);
        const bucketName = urlParts.pathname.split('/')[1];
        const objectName = urlParts.pathname.substring(bucketName.length + 2);

        // 生成预签名 URL
        minioClient.presignedGetObject(bucketName, objectName, 24 * 60 * 60, (err: Error, presignedUrl: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(presignedUrl);
            }
        });
    });
}

type GoodsData = {
    GoodsId: string;
    GoodsName: string;
    GoodsPrice: string;
    GoodsDescription: string;
    GoodsSeller: string;
    GoodsStar: string;
    GoodsImageUrl: string;
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
        GoodsImageUrl: item.imageUrl,
    }));
};

export function GoodsMain() {
    const history = useHistory();
    const { themeMode } = useThemeStore();
    const { userName } = useUserStore();
    const { goodsId, goodsName, goodsPrice, goodsDescription, goodsSeller, goodsStar, goodsImageUrl } = useGoodsStore();
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
    const [presignedUrls, setPresignedUrls] = useState<Record<string, string>>({});

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
            alert("goodsId");
            alert(goodsId);
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

    useEffect(() => {
        // 对每个商品异步获取预签名 URL
        const fetchPresignedUrls = async () => {
            const urls: Record<string, string> = {};
            for (const row of tableGoodsData) {
                const url = await generatePresignedUrl(row.GoodsImageUrl);
                if (typeof url === 'string') {
                    urls[row.GoodsId] = url
                }
            }
            setPresignedUrls(urls);
        };

        fetchPresignedUrls();
    }, [tableGoodsData]);

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
        <BackgroundImage themeMode={themeMode}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline />
                <AppBarComponent
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
                                    '&:hover': { boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)' },
                                    display: 'flex', // 添加此行
                                    flexDirection: 'column', // 添加此行
                                    alignItems: 'center', // 添加此行
                                }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: '50%', height: 'auto', objectFit: 'cover', margin: 'auto' }} // 修改此处以动态适应大小并居中
                                        image={presignedUrls[goodsId]}
                                        alt={goodsName}
                                    />
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
                                        <Typography variant="body2" color="text.secondary">
                                            商品收藏数：{goodsStar}
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
                        {userName !== goodsSeller && (
                            <div>
                                <Button
                                    onClick={handleBuy}
                                    sx={{
                                        color: themeMode === 'dark' ? '#99dc10' : '#99dc10',
                                    }}
                                >
                                    <ShoppingBagIcon /> 购买
                                </Button>
                                <Button
                                    onClick={handleToggleCart}
                                    sx={{
                                        color: tableCartData.includes(goodsId) ? 'red' : 'yellow',
                                    }}
                                >
                                    {tableCartData.includes(goodsId) ? <RemoveShoppingCart/>:<AddShoppingCartIcon />}
                                    {tableCartData.includes(goodsId) ? '移出购物车' : '加入购物车'}
                                </Button>
                                <Button
                                    onClick={handleToggleStar}
                                    sx={{
                                        color: tableStarData.includes(goodsId) ? 'yellow' : 'grey',
                                    }}
                                >
                                    <StarIcon />
                                    {tableStarData.includes(goodsId) ? '取消收藏' : '收藏'}
                                </Button>
                            </div>
                        )}
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
        </BackgroundImage>
    );
}

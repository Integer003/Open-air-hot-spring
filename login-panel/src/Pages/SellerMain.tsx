import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
    Badge,
    CssBaseline,
    Drawer,
    Toolbar,
    Box,
    ThemeProvider,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    CardActions,
} from '@mui/material';
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Message as MessageIcon,
    Receipt as ReceiptIcon,
    Logout as LogoutIcon,
    ArrowForward as ArrowForwardIcon,
    AddShoppingCart as AddShoppingCartIcon,
    ShoppingCart as ShoppingCartIcon,
    Store as StoreIcon,
    Info as InfoIcon,
    Star as StarIcon, Brightness4, Brightness7,
    Details as DetailsIcon,
    Apps as AppsIcon,
} from '@mui/icons-material'
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { useGoodsStore, useThemeStore, useUserStore } from './store'
import { UnreadIndicator } from './tool/Apps';
import { sendPostRequest } from './tool/apiRequest';
import { SellerQueryGoodsMessage } from 'Plugins/SellerAPI/SellerQueryGoodsMessage';
import { GoodsAddStarMessage } from 'Plugins/GoodsAPI/GoodsAddStarMessage';
import { GoodsDeleteStarMessage } from 'Plugins/GoodsAPI/GoodsDeleteStarMessage';
import { SellerQueryGoodsIsStarredMessage } from 'Plugins/SellerAPI/SellerQueryGoodsIsStarredMessage';
import BackgroundImage from 'Pages/theme/BackgroungImage'
import {SendNews} from 'Pages/tool/SendNews'
import { QueryNewsMessage } from 'Plugins/SellerAPI/QueryNewsMessage'

type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;

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
    GoodsBuyer: string;
    GoodsCondition: string;
    GoodsImageUrl: string;
};

const parseDataString = (dataString: string): GoodsData[] => {
    const parsedArray = JSON.parse(dataString);
    return parsedArray.map((item: any) => ({
        GoodsId: item.goodsID,
        GoodsName: item.goodsName,
        GoodsPrice: item.price,
        GoodsDescription: item.description,
        GoodsSeller: item.sellerName,
        GoodsStar: item.star,
        GoodsBuyer: item.buyerName,
        GoodsCondition: item.condition,
        GoodsImageUrl: item.imageUrl,
    }));
};

type NewsData = {
    NewsId: string;
    Receiver: string;
    ReceiverType: string;
    NewsType: string;
    NewsTime: string;
    content: string;
    condition: string;
};

const parseDataNewsString = (dataString: string): NewsData[] => {
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


export function SellerMain() {
    const history = useHistory();
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { userName } = useUserStore();
    const [presignedUrls, setPresignedUrls] = useState<Record<string, string>>({});



    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [tableData, setTableData] = useState<GoodsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [tableStarData, setTableStarData] = useState<string[]>([]);
    const [responseTableStarData, setResponseTableStarData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 对每个商品异步获取预签名 URL
        const fetchPresignedUrls = async () => {
            const urls: Record<string, string> = {};
            for (const row of tableData) {
                const url = await generatePresignedUrl(row.GoodsImageUrl);
                if (typeof url === 'string') {
                    urls[row.GoodsId] = url
                }
            }
            setPresignedUrls(urls);
        };

        fetchPresignedUrls();
    }, [tableData]); // 依赖于 tableData，当它更新时重新获取 URL


    useEffect(() => {
        if (typeof responseTableData === 'string') {
            const parsedData = parseDataString(responseTableData);
            parsedData.sort((a, b) => parseInt(a.GoodsId) - parseInt(b.GoodsId));
            setTableData(parsedData);
        }
    }, [responseTableData]);

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

    const { storeGoodsId, storeGoodsName, storeGoodsPrice, storeGoodsDescription, storeGoodsSeller, storeGoodsCondition,storeGoodsStar, storeGoodsImageUrl } = useGoodsStore();

    const [selectedGoods, setSelectedGoods] = useState<GoodsData | null>(null);

    const handleGoodsInfo = async (goods: GoodsData) => {
        setSelectedGoods(goods);
    };
    useEffect(() => {
        if (selectedGoods) {
            storeGoodsId(selectedGoods.GoodsId);
            storeGoodsName(selectedGoods.GoodsName);
            storeGoodsPrice(selectedGoods.GoodsPrice);
            storeGoodsDescription(selectedGoods.GoodsDescription);
            storeGoodsSeller(selectedGoods.GoodsSeller);
            storeGoodsStar(selectedGoods.GoodsStar);
            storeGoodsCondition(selectedGoods.GoodsCondition);
            storeGoodsImageUrl(selectedGoods.GoodsImageUrl);
            history.push("/GoodsMain");
        }
    }, [selectedGoods])

    const handleToggleStar = async (goods: GoodsData) => {
        try {
            if (tableStarData.includes(goods.GoodsId)) {
                const message = new GoodsDeleteStarMessage(goods.GoodsId, userName);
                await sendPostRequest(message);
            } else {
                const message = new GoodsAddStarMessage(goods.GoodsId, userName);
                await sendPostRequest(message);
                //alert('准备调用sendNews');
                SendNews(goods.GoodsSeller, 'seller', 'star', `您的商品${goods.GoodsName}被${userName}收藏了`,);
                //SendNews(userName, 'star', `您收藏了${goods.GoodsName}商品`,'seller');
            }
            //
            init();
        } catch (error: any) {
            setError(error.message);
        }
    };


    // shit of news
    const [tableNewsData, setTableNewsData] = useState<NewsData[]>([]);
    const [responseTableNewsData, setResponseTableNewsData] = useState<any>(null);

    const [unreadCount, setUnreadCount]=useState<number>(0);


    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (typeof responseTableNewsData === 'string') {
            const parsedNewsData = parseDataNewsString(responseTableNewsData);
            setTableNewsData(parsedNewsData);
            const res = parsedNewsData.filter(item => item.condition != "true").length;
            setUnreadCount(res);
        }
    }, [responseTableNewsData]);


    // finally init
    const init = async () => {
        try {
            const message = new SellerQueryGoodsMessage(userName);
            const data = await sendPostRequest(message);
            setResponseTableData(data);
            const messageStar = new SellerQueryGoodsIsStarredMessage(userName);
            const dataStar = await sendPostRequest(messageStar);
            setResponseTableStarData(dataStar);
            const messageNews=new QueryNewsMessage(userName, 'seller');
            const dataNews=await sendPostRequest(messageNews);
            setResponseTableNewsData(dataNews);
        } catch (error: any) {
            setError(error.message);
            setResponseTableData('error');
        }
    };

    useEffect(() => {
        init();
    }, []);


    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredData, setFilteredData] = useState<GoodsData[]>([]);

    const handleSearch = () => {
        const filtered = tableData.filter((item) =>
            item.GoodsName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.GoodsSeller.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.GoodsDescription.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        setFilteredData(tableData);
    }, [tableData]);


    return (
        <BackgroundImage themeMode={themeMode}>
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent  />
            <div className="content-with-appbar">
                <div>
                    <Box sx={{ display: 'flex', justifyContent: 'center', margin: 2 }}>
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="搜索商品"
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                marginRight: '10px',
                            }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSearch}>
                            搜索
                        </Button>
                    </Box>

                    <Drawer
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                background: themeMode === 'dark' ? 'linear-gradient(to bottom, #333333, #111111)' : 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
                                color: themeMode === 'dark' ? '#cbe681' : '#333333',
                            },
                        }}
                        variant="temporary"
                        anchor={'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                    >
                        <Toolbar />
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            height: 10,
                            paddingTop: theme => theme.spacing(1)
                        }}>
                            <List>
                                <ListItem>{decodeURIComponent(userName)}, 你好！</ListItem>
                                <ListItemButton onClick={() => history.push(`/SellerProfile`)}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="个人中心" />
                                </ListItemButton>
                                <ListItemButton onClick={() => history.push(`/SellerRecord`)}>
                                    <ListItemIcon>
                                        <ReceiptIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="消费记录" />
                                </ListItemButton>
                                <ListItemButton onClick={() => history.push('/SellerCart')}>
                                    <ListItemIcon>
                                        <ShoppingCartIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="购物车" />
                                </ListItemButton>
                                <ListItemButton onClick={() => history.push('/SellerStorage')}>
                                    <ListItemIcon>
                                        <StoreIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="货仓" />
                                </ListItemButton>
                                <ListItemButton onClick={() => history.push('/SellerNews')}>
                                    <ListItemIcon>
                                        <Badge badgeContent={unreadCount} color="primary">
                                        <MessageIcon />
                                        </Badge>
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

                            <IconButton color="inherit"
                                    onClick={handleDrawerToggle}
                                    sx={{
                                    position: 'fixed',
                                    left: 20,
                                    top: '1.5%',
                                    zIndex: 2000,
                                }}
                            ><Badge badgeContent={unreadCount} color="warning">
                                <AppsIcon/>
                            </Badge>
                        </IconButton>


                    )}
                    <Grid container spacing={2} sx={{ padding: 2 }}>
                        {filteredData.map((row, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card
                                    sx={{
                                        height: 'auto', // 允许卡片的高度根据内容自动调整
                                        minHeight: '150px', // 设置一个最小高度，确保卡片不会太矮
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: row.GoodsCondition === 'true' ? 'rgba(112,117,177,0.8)' : (themeMode === 'dark' ? '#3a5517' : '#3bb155'),
                                        color: row.GoodsCondition === 'true' ? '#cbe681' : (themeMode === 'dark' ? '#cbe681' : '#ffffff'),
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                                        },
                                        borderRadius: 5,
                                        margin: '10px',
                                        padding: '10px',
                                        opacity: row.GoodsCondition === 'true' ? 0.9 : 1,
                                    }}

                                >
                                    {row.GoodsCondition === 'true' && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px', // 调整位置到卡片顶部
                                            right: '10px', // 调整位置到卡片右侧
                                            backgroundColor: 'rgba(255, 0, 0, 0.8)', // 使用更醒目的红色
                                            color: 'white',
                                            padding: '10px 20px', // 增加内边距使标签更大
                                            borderRadius: '10px', // 圆角边框
                                            fontSize: '24px', // 增大字体大小
                                            fontWeight: 'bold',
                                            zIndex: 20, // 确保标签在图片上方
                                            display: 'block', // 确保始终显示
                                        }}>
                                            已售出
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'relative',
                                        paddingTop: '75%',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '1px solid #ddd',
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        marginBottom: '10px'
                                    }}>
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '20px',
                                                '&:hover': { cursor: 'pointer' },
                                            }}
                                            image={presignedUrls[row.GoodsId] || ''}
                                            alt={row.GoodsName}
                                            onClick={() => handleGoodsInfo(row)}
                                        />
                                    </div>
                                    <CardContent sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '0 10px'
                                    }}>
                                        <Typography gutterBottom variant="h6"
                                                    component="div"
                                                    sx={{'&:hover': { cursor:'pointer' ,boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',}}}
                                                    onClick={() => handleGoodsInfo(row)}>
                                            {row.GoodsName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary"
                                                    sx={{ flexGrow: 1, padding: '0 10px' }}>
                                            {row.GoodsDescription}
                                        </Typography>
                                        <Typography variant="h6" color="text.primary" sx={{ padding: '0 10px' }}>
                                            ¥{row.GoodsPrice}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ padding: '0 10px' }}>
                                            卖家: {row.GoodsSeller === userName ? '你的商品' : row.GoodsSeller}
                                        </Typography>
                                        {row.GoodsCondition === 'true' && (
                                            <Typography variant="body2" color="text.secondary"
                                                        sx={{ padding: '0 10px' }}>
                                                已售出
                                            </Typography>
                                        )}
                                        {row.GoodsSeller !== userName && (
                                            <Typography variant="body2" color="text.secondary"
                                                        sx={{ padding: '0 10px' }}>
                                                Stars: {row.GoodsStar}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ padding: '0 10px', flexGrow: 1 }}>
                                        {row.GoodsSeller !== userName && (
                                            <IconButton
                                                onClick={() => handleToggleStar(row)}
                                                sx={{
                                                    color: tableStarData.includes(row.GoodsId) ? 'yellow' : 'grey',
                                                }}
                                            >
                                                <StarIcon />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            onClick={() => handleGoodsInfo(row)}
                                            sx={{
                                                color: themeMode === 'dark' ? '#cbe681' : '#333333',
                                                '&:hover': {
                                                    color: themeMode === 'dark' ? '#d1e499' : '#666666',
                                                },
                                            }}
                                        >
                                            <InfoIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>

                            </Grid>
                        ))}
                    </Grid>


                </div>
            </div>
        </ThemeProvider>
        </BackgroundImage>
    );
}

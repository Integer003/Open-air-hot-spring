import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
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

type GoodsData = {
    GoodsId: string;
    GoodsName: string;
    GoodsPrice: string;
    GoodsDescription: string;
    GoodsSeller: string;
    GoodsStar: string;
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

    const { storeGoodsId, storeGoodsName, storeGoodsPrice, storeGoodsDescription, storeGoodsSeller, storeGoodsStar } = useGoodsStore();

    const [selectedGoods, setSelectedGoods] = useState<GoodsData | null>(null);

    const handleGoodsInfo = async (goods: GoodsData) => {
        setSelectedGoods(goods);
        if(selectedGoods) {
            storeGoodsId(selectedGoods.GoodsId);
            storeGoodsName(selectedGoods.GoodsName);
            storeGoodsPrice(selectedGoods.GoodsPrice);
            storeGoodsDescription(selectedGoods.GoodsDescription);
            storeGoodsSeller(selectedGoods.GoodsSeller);
            storeGoodsStar(selectedGoods.GoodsStar);
            history.push('/GoodsMain');
        }
    };

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

    return (
        <BackgroundImage themeMode={themeMode}>
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent  />
            <div className="content-with-appbar">
                <div>
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
                                <ListItemButton onClick={() => {
                                }}>
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
                                        <MessageIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="消息" />
                                    <UnreadIndicator count={unreadCount} />
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
                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',

                                }}
                            >
                                <AppsIcon/>

                                 <UnreadIndicator count={unreadCount} />
                        </IconButton>

                    )}

                    <Grid container spacing={3} sx={{ padding: 3 }}>
                        {tableData.map((row, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
                                        color: themeMode === 'dark' ? '#cbe681' : '#333333',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {row.GoodsName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {row.GoodsDescription}
                                        </Typography>
                                        <Typography variant="h6" color="text.primary">
                                            ¥{row.GoodsPrice}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            卖家: {row.GoodsSeller}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Stars: {row.GoodsStar}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton
                                            onClick={() => handleToggleStar(row)}
                                            sx={{
                                                color: tableStarData.includes(row.GoodsId) ? 'yellow' : 'grey',
                                            }}
                                        >
                                            <StarIcon />
                                        </IconButton>
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

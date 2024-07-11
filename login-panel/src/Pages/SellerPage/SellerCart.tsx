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
    CardActions, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog,
} from '@mui/material'
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Message as MessageIcon,
    Receipt as ReceiptIcon,
    Logout as LogoutIcon,
    ArrowForward as ArrowForwardIcon,
    AddShoppingCart as AddShoppingCartIcon,
    ShoppingCart as ShoppingCartIcon,
    ShoppingBag as ShoppingBagIcon,
    RemoveShoppingCart as RemoveShoppingCartIcon,
    Store as StoreIcon,
    Info as InfoIcon,
    Star as StarIcon, Brightness4, Brightness7,
    Details as DetailsIcon,
    Apps as AppsIcon,
} from '@mui/icons-material'
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { useGoodsStore, useThemeStore, useUserStore } from '../store'
import { UnreadIndicator } from '../tool/Apps';
import { sendPostRequest } from '../tool/apiRequest';
import { SellerQueryGoodsMessage } from 'Plugins/SellerAPI/SellerQueryGoodsMessage';
import { GoodsAddStarMessage } from 'Plugins/GoodsAPI/GoodsAddStarMessage';
import { GoodsDeleteStarMessage } from 'Plugins/GoodsAPI/GoodsDeleteStarMessage';
import { SellerQueryGoodsIsStarredMessage } from 'Plugins/SellerAPI/SellerQueryGoodsIsStarredMessage';
import BackgroundImage from 'Pages/theme/BackgroungImage'
import { SellerQueryGoodsIsCartMessage } from 'Plugins/SellerAPI/SellerQueryGoodsIsCartMessage'
import { SellerDeleteGoodsCartMessage } from 'Plugins/SellerAPI/SellerDeleteGoodsCartMessage'
import { GoodsBuyMessage } from 'Plugins/GoodsAPI/GoodsBuyMessage'
import { SendNews } from 'Pages/tool/SendNews'

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

export function SellerCart() {
    const history = useHistory();
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();
    const { userName } = useUserStore();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);


    const [tableData, setTableData] = useState<GoodsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [tableCartData, setTableCartData] = useState<string[]>([]);
    const [responseTableCartData, setResponseTableCartData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const init = async () => {
        try {
            const message = new SellerQueryGoodsMessage(userName);
            const data = await sendPostRequest(message);
            setResponseTableData(data);
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
        if (typeof responseTableCartData === 'string') {
            const parsedData = extractGoodsIDs(responseTableCartData);
            setTableCartData(parsedData);
        }
    }, [responseTableCartData]);


    const handleDeleteCart = async (goods: GoodsData) => {
        try {
            const message =  new SellerDeleteGoodsCartMessage(goods.GoodsId, userName);
            const responce = await sendPostRequest(message);
            init();
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


    const [buyResponse, setBuyResponse] = useState<string | null>(null);

    const handleBuy = (goods: GoodsData) => {
        setSelectedGoods(goods);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (buyResponse) {
            if (typeof buyResponse === 'string' && buyResponse.startsWith('Success')) {
                alert(selectedGoods.GoodsName + '购买成功');
                SendNews(selectedGoods.GoodsSeller, 'seller', 'buy', '您的商品' + selectedGoods.GoodsName + '已被购买');
                SendNews(userName, 'seller', 'buy', '您已购买商品' + selectedGoods.GoodsName);
                init();
            } else {
                alert('购买失败！');
            }
        }
    }, [buyResponse]);

    const handleConfirmBuy = async () => {
        try {
            const message = new GoodsBuyMessage(userName, selectedGoods.GoodsId);
            const data = await sendPostRequest(message);
            setBuyResponse(data);
        } catch (error) {
            setError(error.message);
        }
        handleClose();
    };



    return (
        <BackgroundImage themeMode={themeMode}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline />
                <AppBarComponent historyPath={'/SellerMain'} />
                <div className="content-with-appbar">
                    <Toolbar />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ my: 2 }}>
                            购物车
                        </Typography>
                    </Box>
                    <List>
                        {tableData
                            .filter(goods => tableCartData.includes(goods.GoodsId)) // 只显示购物车中的商品
                            .map((goods, index) => (
                                <div key={index}>
                                    <ListItem
                                        disablePadding
                                        sx={{ bgcolor: 'background.paper' }}
                                    >
                                        <ListItemButton onClick={() => handleGoodsInfo(goods)}>
                                            <ListItemIcon onClick={() => handleGoodsInfo(goods)}>
                                                <InfoIcon />
                                            </ListItemIcon>
                                            <ListItemButton
                                                onClick={() => handleBuy(goods)}
                                                sx={{ color: 'green' }}
                                            >
                                                <ListItemIcon>
                                                    <ShoppingBagIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="购买" />
                                            </ListItemButton>
                                            <ListItemButton
                                                onClick={() => handleDeleteCart(goods)}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <ListItemIcon>
                                                    <RemoveShoppingCartIcon /> {/* 假设有这个图标 */}
                                                </ListItemIcon>
                                                <ListItemText primary="移出" />
                                            </ListItemButton>
                                            <ListItemText
                                                primary={goods.GoodsName}
                                                secondary={
                                                    <React.Fragment>
                                                        {goods.GoodsDescription}
                                                        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                                                            价格：¥{goods.GoodsPrice}
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>

                                </div>
                            ))
                        }
                    </List>
                </div>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>确认购买</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            你确定要购买商品 {selectedGoods?.GoodsName} 吗？
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
            </ThemeProvider>
        </BackgroundImage>
    );
}

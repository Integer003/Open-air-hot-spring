import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
    CssBaseline,
    Toolbar,
    Box,
    ThemeProvider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog,
} from '@mui/material';
import {
    Info as InfoIcon,
    ShoppingBag as ShoppingBagIcon,
    RemoveShoppingCart as RemoveShoppingCartIcon,
} from '@mui/icons-material';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { useGoodsStore, useThemeStore, useUserStore } from '../store';
import { sendPostRequest } from '../tool/apiRequest';
import { SellerQueryGoodsMessage } from 'Plugins/SellerAPI/SellerQueryGoodsMessage';
import { SellerQueryGoodsIsCartMessage } from 'Plugins/SellerAPI/SellerQueryGoodsIsCartMessage';
import { SellerDeleteGoodsCartMessage } from 'Plugins/SellerAPI/SellerDeleteGoodsCartMessage';
import { GoodsBuyMessage } from 'Plugins/GoodsAPI/GoodsBuyMessage';
import { SendNews } from 'Pages/tool/SendNews';
import BackgroundImage from 'Pages/theme/BackgroungImage';

type ThemeMode = 'light' | 'dark';

type GoodsData = {
    GoodsId: string;
    GoodsName: string;
    GoodsPrice: string;
    GoodsDescription: string;
    GoodsSeller: string;
    GoodsCondition: string;
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
        GoodsCondition: item.condition,
        GoodsStar: item.star,
    }));
};

export function SellerCart() {
    const history = useHistory();
    const { themeMode } = useThemeStore();
    const { userName } = useUserStore();
    const [open, setOpen] = useState(false);

    const [tableData, setTableData] = useState<GoodsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [tableCartData, setTableCartData] = useState<string[]>([]);
    const [responseTableCartData, setResponseTableCartData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedGoods, setSelectedGoods] = useState<GoodsData | null>(null);
    const [buyResponse, setBuyResponse] = useState<string | null>(null);

    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);

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

    const extractGoodsIDs = (dataString: string): string[] => {
        const parts = dataString.split('"goodsID"');
        return parts.slice(1).map(part => {
            const start = part.indexOf('"') + 1;
            const end = part.indexOf('"', start);
            return part.substring(start, end);
        });
    };

    useEffect(() => {
        if (typeof responseTableCartData === 'string') {
            const parsedData = extractGoodsIDs(responseTableCartData);
            setTableCartData(parsedData);
        }
    }, [responseTableCartData]);

    const handleDeleteCart = async (goods: GoodsData) => {
        try {
            const message = new SellerDeleteGoodsCartMessage(goods.GoodsId, userName);
            await sendPostRequest(message);
            init();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const { storeGoodsId, storeGoodsName, storeGoodsPrice, storeGoodsDescription, storeGoodsSeller, storeGoodsStar, storeGoodsCondition } = useGoodsStore();

    const handleGoodsInfo = (goods: GoodsData) => {
        storeGoodsId(goods.GoodsId);
        storeGoodsName(goods.GoodsName);
        storeGoodsPrice(goods.GoodsPrice);
        storeGoodsDescription(goods.GoodsDescription);
        storeGoodsSeller(goods.GoodsSeller);
        storeGoodsStar(goods.GoodsStar);
        storeGoodsCondition(goods.GoodsCondition);
        history.push('/GoodsMain');
    };

    const handleBuy = (goods: GoodsData) => {
        setSelectedGoods(goods);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (buyResponse) {
            if (typeof buyResponse=='string' && buyResponse.startsWith('Success')) {
                alert(selectedGoods?.GoodsName + '购买成功');
                SendNews(selectedGoods?.GoodsSeller, 'seller', 'buy', '您的商品' + selectedGoods?.GoodsName + '已被购买');
                SendNews(userName, 'seller', 'buy', '您已购买商品' + selectedGoods?.GoodsName);
                init();
            } else {
                alert('购买失败！');
            }
        }
    }, [buyResponse]);

    const handleConfirmBuy = async () => {
        try {
            const message = new GoodsBuyMessage(userName, selectedGoods?.GoodsId);
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
                <div className="content-with-appbar" style={{ padding: '20px' }}>
                    <Toolbar />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                            购物车
                        </Typography>
                    </Box>
                    <List>
                        {tableData.filter(goods => tableCartData.includes(goods.GoodsId)).map((goods, index) => (
                            <ListItem key={index} disablePadding sx={{ bgcolor: 'background.paper', mb: 2 }}>
                                <ListItemButton>
                                    <ListItemIcon onClick={() => handleGoodsInfo(goods)}>
                                        <InfoIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={goods.GoodsName}
                                        secondary={
                                            <>
                                                {goods.GoodsDescription}
                                                <Typography component="span" variant="body2" sx={{ color: 'text.primary' }}>
                                                    {'   '}价格：¥{goods.GoodsPrice}
                                                </Typography>
                                            </>
                                        }
                                    />
                                    {goods.GoodsCondition=='true'&&(<div>已售出</div>)}
                                    {goods.GoodsCondition=='false'&&(
                                    <Button variant="contained" color="success" onClick={() => handleBuy(goods)} sx={{ mx: 1 }}>
                                        <ShoppingBagIcon /> 购买
                                    </Button>)}
                                    <Button variant="contained" color="error" onClick={() => handleDeleteCart(goods)} sx={{ mx: 1 }}>
                                        <RemoveShoppingCartIcon /> 移出
                                    </Button>
                                </ListItemButton>
                            </ListItem>
                        ))}
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

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
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Table,
    DialogTitle,
    DialogContent,
    DialogContentText, DialogActions, Dialog,
} from '@mui/material'
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Message as MessageIcon,
    Receipt as ReceiptIcon,
    Logout as LogoutIcon,
    Add as AddIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { useUserStore } from './store';
import { UnreadIndicator } from './tool/Apps';
import { ShowTableMessage } from 'Plugins/OperatorAPI/ShowTableMessage'
import { sendPostRequest } from 'Pages/tool/apiRequest'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { SellerQueryGoodsMessage } from 'Plugins/SellerAPI/SellerQueryGoodsMessage'
import { GoodsBuyMessage } from 'Plugins/GoodsAPI/GoodsBuyMessage'

type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;

type GoodsData = {
    GoodsId: string;
    GoodsName: string;
    GoodsPrice: string;
    GoodsDescription: string;
    GoodsSeller: string;
};

const parseDataString = (dataString: string): GoodsData[] => {
    // Parse the JSON string into an array of objects
    const parsedArray = JSON.parse(dataString);

    // Map the parsed objects to the GoodsData format
    return parsedArray.map((item: any) => ({
        GoodsId: item.goodsID,
        GoodsName: item.goodsName,
        GoodsPrice: item.price,
        GoodsDescription: item.description,
        GoodsSeller: item.sellerName
    }));
};

export function SellerMain() {
    const history = useHistory();
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文
    const unreadMessagesCount = 5;
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
    const [error, setError] = useState<string | null>(null);

    const init = async () => {
        try {
            const message = new SellerQueryGoodsMessage(userName);
            const data = await sendPostRequest(message);
            setResponseTableData(data); // 假设返回的数据是字符串，如果不是，需要转换
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


    const [selectedGoods, setSelectedGoods] = useState<GoodsData | null>(null);
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);


    const handleBuy = (goods: GoodsData) => {
        setSelectedGoods(goods);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedGoods(null);
    };

    const [buyResponse, setBuyResponce] = useState<string | null>(null);

    useEffect(() => {
        if (buyResponse) {
            if (typeof buyResponse==='string' && buyResponse.startsWith("Success")){
                alert(selectedGoods?.GoodsName+"购买成功");
                setTableData(tableData.filter(goods => goods !== selectedGoods));
            }else{
                alert("购买失败！");
            }
        }
    }, [buyResponse]);


    const handleConfirmBuy =async () => {
        if (selectedGoods) {
            try {
                const message = new GoodsBuyMessage(userName, selectedGoods?.GoodsId);
                const data = await sendPostRequest(message);
                setBuyResponce(data);
            } catch (error) {
                setError(error.message);
            }
            handleClose();
        }
    };


    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent themeMode={themeMode} setThemeMode={setThemeMode} setLanguage={setLanguage} />
            <div>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="temporary"
                    anchor={'left'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                >
                    <Toolbar />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', height: 10, paddingTop: theme => theme.spacing(1) }}>
                        <List>
                            <ListItem>{decodeURIComponent(userName)}, 你好！</ListItem>
                            <ListItemButton onClick={() => history.push(`/SellerProfile`)}>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="个人中心" />
                            </ListItemButton>
                            <ListItemButton onClick={() => {}}>
                                <ListItemIcon>
                                    <ReceiptIcon />
                                </ListItemIcon>
                                <ListItemText primary="消费记录" />
                            </ListItemButton>
                            <ListItemButton onClick={() => history.push('/SellerStorage')}>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="货仓" />
                            </ListItemButton>
                            <ListItemButton onClick={() => { /* 处理点击事件 */ }}>
                                <ListItemIcon>
                                    <MessageIcon />
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
                    <Button
                        onClick={handleDrawerToggle}
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: '90%',
                            transform: 'translateY(-50%)',
                            zIndex: 1000,
                            cursor: 'pointer', // 鼠标悬停时显示指针手势
                            padding: '10px', // 按钮的内边距
                            color: 'white', // 图标颜色
                            backgroundColor: 'grey', // 按钮背景颜色，使用对比色
                        }}
                    >
                        <ListItemIcon>
                            <ArrowForwardIcon />
                        </ListItemIcon>
                        <UnreadIndicator count={unreadMessagesCount} />
                    </Button>)}
                在这里陈列商品
                {/*{ tableData }*/}
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">商品名</TableCell>
                            <TableCell align="center">商品价格</TableCell>
                            <TableCell align="center">商品描述</TableCell>
                            <TableCell align="center">商品卖家</TableCell>
                            <TableCell align="center">商品购买</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{row.GoodsName}</TableCell>
                                <TableCell align="center">{row.GoodsPrice}</TableCell>
                                <TableCell align="center">{row.GoodsDescription}</TableCell>
                                <TableCell align="center">{row.GoodsSeller}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => handleBuy(row)}
                                        sx={{
                                            backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
                                            color: themeMode === 'dark' ? '#ff0000' : '#ff0000',
                                            '&:hover': {
                                                backgroundColor: themeMode === 'dark' ? '#333333' : '#f5f5f5',
                                            }
                                        }}
                                    >
                                        <AddShoppingCartIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
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
                </Table>
            </div>
        </ThemeProvider>
    );
}

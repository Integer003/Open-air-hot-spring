// 主页面组件，可能是应用加载时首先展示的页面
import React, { useState, useEffect, useContext } from 'react'
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { useHistory, useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import logo from '../../images/summer.png';
import {
    AppBar,
    Typography,
    Button,
    Container,
    CssBaseline,
    Drawer,
    Toolbar,
    Box,
    ThemeProvider,
    createTheme,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Table,
    Card,
    CardContent,
    CardMedia,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Dialog,
} from '@mui/material'
import { Add as AddIcon, Brightness4, Brightness7, Language } from '@mui/icons-material'
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import InboxIcon from '@mui/icons-material/Create';
import MessageIcon from '@mui/icons-material/Message';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useGoodsStore, useThemeStore, useUserStore } from '../store'
import { SellerCancelMessage } from 'Plugins/SellerAPI/SellerCancelMessage'
import ConfirmDialog from '../tool/ConfirmDialog';
import { SellerQueryStorageMessage } from 'Plugins/SellerAPI/SellerQueryStorageMessage'
import DeleteIcon from '@mui/icons-material/Delete'
import { SellerCancelGoodsMessage } from 'Plugins/SellerAPI/SellerCancelGoodsMessage'
import BackgroundImage from 'Pages/theme/BackgroungImage'



type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;

type GoodsData = {
    GoodsId: string;
    GoodsName: string;
    GoodsPrice: string;
    GoodsDescription: string;
    GoodsCondition: string;
    GoodsSeller: string;
    GoodsBuyer: string;
    GoodsStar?: string;
    GoodsVerify?: string;
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
        GoodsCondition: item.condition,
        GoodsSeller: item.sellerName,
        GoodsBuyer: item.buyerName,
        GoodsStar: item.star,
        GoodsVerify: item.verify,
    }));
};


export function SellerStorage() {
    const history = useHistory()
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();
    const [responseData, setResponseData] = useState<any>(null);
    const { userName } = useUserStore();

    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const [tableData, setTableData] = useState<GoodsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [selectedGoods, setSelectedGoods] = useState<GoodsData | null>(null);


    const init = async () => {
        try {
            const message = new SellerQueryStorageMessage(userName);
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

    const handleDelete = (goods: GoodsData) => {
        setSelectedGoods(goods);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedGoods(null);
    };

    const [deleteResponse, setDeleteResponce] = useState<string | null>(null);

    useEffect(() => {
        if (deleteResponse) {
            // alert(deleteResponse);
            if (typeof deleteResponse==='string' && deleteResponse.startsWith("Success")){
                alert(selectedGoods?.GoodsName+"删除成功");
                setTableData(tableData.filter(goods => goods !== selectedGoods));
            }else{
                alert("删除失败！");
            }
        }
    }, [deleteResponse]);


    const handleConfirmDelete =async () => {
        if (selectedGoods) {
            try {
                const message = new SellerCancelGoodsMessage(selectedGoods?.GoodsId);
                const data = await sendPostRequest(message);
                setDeleteResponce(data);
            } catch (error) {
                setError(error.message);
            }
            handleClose();
        }
    };



    const { storeGoodsId, storeGoodsName, storeGoodsPrice, storeGoodsDescription, storeGoodsSeller, storeGoodsStar } = useGoodsStore();

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


    return (
        <BackgroundImage themeMode={themeMode}>
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent historyPath={'/SellerMain'} />
            <div className="content-with-appbar">
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                        <p>欢迎, {userName}来到货仓!</p>
                    </Typography>
                </Box>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">商品名</TableCell>
                            <TableCell align="center">商品价格</TableCell>
                            <TableCell align="center">商品描述</TableCell>
                            <TableCell align="center">售出状态</TableCell>
                            <TableCell align="center">审核状态</TableCell>
                            <TableCell align="center">商品买家</TableCell>
                            <TableCell align='center'>查看详情</TableCell>
                            <TableCell align="center">删除</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{row.GoodsName}</TableCell>
                                <TableCell align="center">{row.GoodsPrice}</TableCell>
                                <TableCell align="center">{row.GoodsDescription}</TableCell>
                                <TableCell align="center">{row.GoodsCondition=='true'?'已售出':'未售出'}</TableCell>
                                <TableCell align="center">{row.GoodsVerify=='true'?'已过审':'未过审'}</TableCell>
                                <TableCell align="center">{row.GoodsBuyer}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => handleGoodsInfo(row)}
                                        sx={{
                                            backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
                                            color: themeMode === 'dark' ? '#0000ff' : '#0000ff',
                                            '&:hover': {
                                                backgroundColor: themeMode === 'dark' ? '#333333' : '#f5f5f5',
                                            }
                                        }}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => handleDelete(row)}
                                        sx={{
                                            backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
                                            color: themeMode === 'dark' ? '#ff0000' : '#ff0000',
                                            '&:hover': {
                                                backgroundColor: themeMode === 'dark' ? '#333333' : '#f5f5f5',
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push('/SellerAddGoods')}
                    sx={{
                        position: 'absolute',
                        right: 20,
                        bottom: 20,
                        zIndex: 1000,
                    }}
                >
                    添加商品
                    <AddIcon sx={{ ml: 1 }} />
                </Button>

                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>确认删除</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            你确定要删除商品 {selectedGoods?.GoodsName} 吗？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            取消
                        </Button>
                        <Button onClick={handleConfirmDelete} color="secondary">
                            删除
                        </Button>
                    </DialogActions>
                </Dialog>


                <Button onClick={() => history.push('./SellerMain')}>
                    返回
                </Button>
            </div>
        </ThemeProvider>
        </BackgroundImage>
);
}



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
import { SellerQueryRecordMessage } from 'Plugins/SellerAPI/SellerQueryRecordMessage'
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


export function SellerRecord() {
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
            const message = new SellerQueryRecordMessage(userName);
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





    return (
        <BackgroundImage themeMode={themeMode}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline />
                <AppBarComponent historyPath={'/SellerMain'} />
                <div className="content-with-appbar"  style={{ padding: '20px' }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h1" sx={{ fontSize: '2rem', textAlign: 'center', textShadow: '1px 1px 2px #000, 0 0 25px #000' }}>
                            欢迎, {userName}来到消费记录!
                        </Typography>
                    </Box>
                    <Table sx={{ minWidth: 650, border: '2px #000000' }}  aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">商品名</TableCell>
                                <TableCell align="center">商品价格</TableCell>
                                <TableCell align="center">商品描述</TableCell>
                                <TableCell align="center">商品卖家</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.GoodsName}</TableCell>
                                    <TableCell align="center">{row.GoodsPrice}</TableCell>
                                    <TableCell align="center">{row.GoodsDescription}</TableCell>
                                    <TableCell align="center">{row.GoodsSeller}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </ThemeProvider>
        </BackgroundImage>

    );
}



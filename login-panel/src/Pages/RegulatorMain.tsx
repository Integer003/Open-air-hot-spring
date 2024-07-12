import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
    CssBaseline,
    Box,
    ThemeProvider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Switch,
    DialogTitle,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Pagination
} from '@mui/material';
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { sendPostRequest } from './tool/apiRequest';
import { useThemeStore, useUserStore } from './store';
import { ShowTableMessage } from 'Plugins/OperatorAPI/ShowTableMessage';
import DeleteIcon from '@mui/icons-material/Delete';
import { del } from 'idb-keyval';
import {
    Add as AddIcon, Apps as AppsIcon, ArrowForward as ArrowForwardIcon,
    Home as HomeIcon, Logout as LogoutIcon,
    Message as MessageIcon,
    Person as PersonIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BackgroundImage from 'Pages/theme/BackgroungImage';
import { SendNews } from 'Pages/tool/SendNews';
import { RegulatorQueryGoodsMessage } from 'Plugins/RegulatorAPI/RegulatorQueryGoodsMessage';
import { RegulatorModifyGoodsMessage } from 'Plugins/RegulatorAPI/RegulatorModifyGoodsMessage';

type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;
type GoodsData = {
    GoodsId: string;
    GoodsName: string;
    GoodsPrice: string;
    GoodsDescription: string;
    GoodsSeller: string;
    GoodsVerify: string;
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
        GoodsSeller: item.sellerName,
        GoodsVerify: item.verify
    }));
};

export function RegulatorMain() {
    const history = useHistory();
    const { themeMode } = useThemeStore();
    const { userName } = useUserStore();

    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);

    const init = async () => {
        try {
            const message = new RegulatorQueryGoodsMessage();
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

    const [tableData, setTableData] = useState<GoodsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 7;

    useEffect(() => {
        if (typeof responseTableData === 'string') {
            const parsedData = parseDataString(responseTableData);
            const sortedData = parsedData.sort((a, b) => a.GoodsId.localeCompare(b.GoodsId));
            setTableData(sortedData);
        }
    }, [responseTableData]);

    const [selectedGoods, setSelectedGoods] = useState<GoodsData | null>(null);
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleModify = (goods: GoodsData) => {
        setSelectedGoods(goods);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedGoods(null);
    };

    const [modifyResponse, setModifyResponce] = useState<string | null>(null);

    useEffect(() => {
        if (modifyResponse) {
            if (typeof modifyResponse === 'string' && modifyResponse.startsWith("Success")) {
                alert(selectedGoods?.GoodsName + "管理成功");
                SendNews(selectedGoods?.GoodsSeller, "seller", "verify", "您的商品" + selectedGoods?.GoodsName + "已经通过审核");
                init();
            } else {
                alert("管理失败！");
            }
        }
    }, [modifyResponse]);

    const handleConfirmModify = async () => {
        if (selectedGoods) {
            try {
                const message = new RegulatorModifyGoodsMessage(selectedGoods?.GoodsId);
                const data = await sendPostRequest(message);
                setModifyResponce(data);
            } catch (error) {
                setError(error.message);
            }
            handleClose();
        }
    };

    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <BackgroundImage themeMode={themeMode}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline />
                <AppBarComponent />
                <div className="content-with-appbar">
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                            <h1>监管方主页！</h1>
                            <p>欢迎, {userName}!</p>
                        </Typography>
                    </Box>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">商品名</TableCell>
                                <TableCell align="center">商品价格</TableCell>
                                <TableCell align="center">商品描述</TableCell>
                                <TableCell align="center">商品卖家</TableCell>
                                <TableCell align="center">审核情况</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.GoodsName}</TableCell>
                                    <TableCell align="center">{row.GoodsPrice}</TableCell>
                                    <TableCell align="center">{row.GoodsDescription}</TableCell>
                                    <TableCell align="center">{row.GoodsSeller}</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={row.GoodsVerify === 'true'}
                                            onChange={() => handleModify(row)}
                                            color="primary"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={Math.ceil(tableData.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </Box>
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
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            height: 10,
                            paddingTop: theme => theme.spacing(1)
                        }}>
                            <List>
                                <ListItem>{decodeURIComponent(userName)}, 你好！</ListItem>
                                <ListItemButton onClick={() => history.push(`/RegulatorProfile`)}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="个人中心" />
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
                        >
                            <AppsIcon />
                        </IconButton>

                    )}
                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>确认管理</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                你确定要修改商品 {selectedGoods?.GoodsName} 审核状态吗？
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                取消
                            </Button>
                            <Button onClick={handleConfirmModify} color="secondary">
                                确认
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </ThemeProvider>
        </BackgroundImage>
    );
}

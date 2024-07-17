import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
    CssBaseline,
    Box,
    ThemeProvider,
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
    ListItemText, CardMedia,
} from '@mui/material'
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
    GoodsVerify: string;
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
        GoodsVerify: item.verify,
        GoodsImageUrl: item.imageUrl
    }));
};

export function RegulatorMain() {
    const history = useHistory();
    const { themeMode } = useThemeStore();
    const { userName } = useUserStore();
    const [isCompleted, setIsCompleted] = useState(false);

    const [presignedUrls, setPresignedUrls] = useState<Record<string, string>>({});


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
    const [oriTableData, setOriTableData] = useState<GoodsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        if (typeof responseTableData === 'string') {
            const parsedData = parseDataString(responseTableData);
            const sortedData = parsedData.sort((a, b) => a.GoodsId.localeCompare(b.GoodsId));
            setOriTableData(sortedData);
        }
    }, [responseTableData]);

    const [selectedGoods, setSelectedGoods] = useState<GoodsData | null>(null);
    const [open, setOpen] = useState(true);
    const [result, setResult] = useState<string | null>(null);

    useEffect(() => {
        if (tableData.length > 0) {
            setSelectedGoods(tableData[currentIndex]);
        }
    }, [tableData, currentIndex]);

    useEffect(() => {
        // 对每个商品异步获取预签名 URL
        const fetchPresignedUrls = async () => {
            const urls: Record<string, string> = {};
            for (const row of oriTableData) {
                const url = await generatePresignedUrl(row.GoodsImageUrl);
                if (typeof url === 'string') {
                    urls[row.GoodsId] = url;
                }
            }
            setPresignedUrls(urls);
        };
        fetchPresignedUrls();
        setTableData(oriTableData);
    }, [oriTableData]);

    const handleModify = async () => {
        if (selectedGoods) {
            try {
                const message = new RegulatorModifyGoodsMessage(selectedGoods.GoodsId);
                const data = await sendPostRequest(message);
                setResult(data);
                SendNews(selectedGoods.GoodsSeller, 'seller','verify', `您的商品${selectedGoods.GoodsName}审核结果为: ${selectedGoods.GoodsVerify == 'false' ? '已过审' : '未过审'}`);
            } catch (error) {
                setError(error.message);
            }
            handleNext();
        }
    };

    const handleNext = () => {
        if (currentIndex < tableData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert('所有商品已审核完毕！');
            setOpen(false);
            setIsCompleted(true);
        }
    };

    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <BackgroundImage themeMode={themeMode}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline />
                <AppBarComponent />
                <div className="content-with-appbar">
                    {isCompleted && (
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontSize: '2rem', color: 'green' }}>
                                辛苦啦！
                            </Typography>
                        </Box>
                    )}
                    <Dialog open={open} onClose={handleNext}>
                        <DialogTitle>商品审核</DialogTitle>
                        {selectedGoods && (
                            <>
                                <DialogContent>
                                    <DialogContentText>
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: '50%',
                                                height: 'auto',
                                                objectFit: 'cover',
                                                margin: 'auto',
                                                borderRadius: 5,
                                            }} // 修改此处以动态适应大小并居中
                                            image={presignedUrls[selectedGoods.GoodsId]}
                                            alt={selectedGoods.GoodsId}
                                        />
                                        <Typography variant="h6">商品名: {selectedGoods.GoodsName}</Typography>
                                        <Typography variant="body1">价格: {selectedGoods.GoodsPrice}</Typography>
                                        <Typography variant="body1">描述: {selectedGoods.GoodsDescription}</Typography>
                                        <Typography variant="body1">卖家: {selectedGoods.GoodsSeller}</Typography>
                                        <Typography
                                            variant="body1" sx={{color:selectedGoods.GoodsVerify == 'true' ?'green':'red'}}>审核状态: {selectedGoods.GoodsVerify == 'true' ? '已过审' : '未过审'}</Typography>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleNext} color="primary">
                                        保留审核状态
                                    </Button>
                                    <Button onClick={handleModify} color="secondary">
                                        更改审核状态
                                    </Button>
                                </DialogActions>
                            </>
                        )}
                    </Dialog>
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
                            paddingTop: theme => theme.spacing(1),
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
                    </div>
            </ThemeProvider>
        </BackgroundImage>
);
}

// 主页面组件，可能是应用加载时首先展示的页面
import React, { useState, useEffect, useContext } from 'react'
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import { useHistory, useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from '../../images/summer.png';
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
    Card,
    CardContent,
    CardMedia, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog,
} from '@mui/material'
import { Brightness4, Brightness7, Language } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import InboxIcon from '@mui/icons-material/Create';
import MessageIcon from '@mui/icons-material/Message';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useGoodsStore, useUserStore } from '../store'
import { SellerCancelMessage } from 'Plugins/SellerAPI/SellerCancelMessage'
import ConfirmDialog from '../tool/ConfirmDialog';
import { SellerQueryMoneyMessage } from 'Plugins/SellerAPI/SellerQueryMoneyMessage'
import { SellerRechargeMessage } from 'Plugins/SellerAPI/SellerRechargeMessage'
import { SellerQueryGoodsMessage } from 'Plugins/SellerAPI/SellerQueryGoodsMessage'
import { GoodsQueryCommentsMessage } from 'Plugins/GoodsAPI/GoodsQueryCommentsMessage'
import { GoodsAddCommentsMessage } from 'Plugins/GoodsAPI/GoodsAddCommentsMessage'
import InfoIcon from '@mui/icons-material/Info'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { GoodsBuyMessage } from 'Plugins/GoodsAPI/GoodsBuyMessage'


type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;

type CommentsData = {
    CommentId: number;
    SenderName: string;
    GoodsId: number;
    CommentsTime: string;
    Content: string;
};

const parseDataString = (dataString: string): CommentsData[] => {
    // Parse the JSON string into an array of objects
    const parsedArray = JSON.parse(dataString);

    // Map the parsed objects to the GoodsData format
    return parsedArray.map((item: any) => ({
        CommentId: item.commentId,
        SenderName: item.senderName,
        GoodsId: item.goodsId,
        CommentsTime: item.time,
        Content: item.content
    }));
};


export function GoodsMain(){
    const history=useHistory()
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文
    const { userName } = useUserStore();


    const { goodsId } = useGoodsStore();
    const { goodsName } = useGoodsStore();
    const { goodsPrice } = useGoodsStore();
    const { goodsDescription } = useGoodsStore();
    const { goodsSeller } = useGoodsStore();



    const [tableData, setTableData] = useState<CommentsData[]>([]);
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const init = async () => {
        try {
            const message = new GoodsQueryCommentsMessage(goodsId);
            const data = await sendPostRequest(message);
            setResponseTableData(data); // 假设返回的数据是字符串，如果不是，需要转换
            // alert(data);
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
            // alert(tableData);
        }
    }, [responseTableData]);


    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);


    const handleBuy = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [buyResponse, setBuyResponce] = useState<string | null>(null);

    useEffect(() => {
        if (buyResponse) {
            if (typeof buyResponse==='string' && buyResponse.startsWith("Success")){
                alert(goodsName+"购买成功");
                history.push('./sellerMain');
            }else{
                alert("购买失败！");
            }
        }
    }, [buyResponse]);


    const handleConfirmBuy =async () => {
        try {
            const message = new GoodsBuyMessage(userName, goodsId);
            const data = await sendPostRequest(message);
            setBuyResponce(data);
        } catch (error) {
            setError(error.message);
        } handleClose();
    };



    const [commentsResponse, setCommentsResponse] = useState<string | null>(null);

    const handleComments =async (myComments: string) => {
        try {
            const message = new GoodsAddCommentsMessage(goodsId, userName,myComments);
            const data = await sendPostRequest(message);
            setCommentsResponse(data);
        } catch (error) {
            setError(error.message);
        }
    }
    useEffect(() => {
        if (commentsResponse) {
            if (typeof commentsResponse==='string' && commentsResponse.startsWith("Success")){
                alert("评论成功");
                init();
            }else{
                alert("评论失败！");
            }
        }
    }, [commentsResponse]);


    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                setLanguage={setLanguage}
            />
            <Container>
                <Typography variant="h4" gutterBottom>
                    商品详情
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={logo}
                                alt="商品图片"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {goodsName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {goodsDescription}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    商品价格：{goodsPrice}元
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    商品ID：{goodsId}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    卖家：{goodsSeller}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Typography variant="h4" gutterBottom>
                    商品评论
                </Typography>
                <List>
                    {tableData.map((item) => (
                        <ListItem key={item.CommentsTime}>
                            <ListItemButton>
                                <ListItemText
                                    primary={item.Content}
                                    secondary={item.SenderName + " " + item.CommentsTime}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Container>


            {/*在这里添加评论*/}
            <TextField
                id="myComment"
                label="评论"
                multiline
                rows={4}
                defaultValue=""
                variant="outlined"
            />
            <Button
                onClick={() => handleComments((document.getElementById("myComment") as HTMLInputElement).value)}
            >
                发送评论
            </Button>


            <IconButton
                onClick={() => handleBuy()}
                sx={{
                    backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
                    color: themeMode === 'dark' ? '#cbe681' : '#d1e499',
                    '&:hover': {
                        backgroundColor: themeMode === 'dark' ? '#333333' : '#f5f5f5',
                    }
                }}
            >
                <AddShoppingCartIcon />买它买它！
            </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
            >
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


            <Button onClick={()=>history.push('./SellerMain')}>
                返回
            </Button>

        </ThemeProvider>

    );
}
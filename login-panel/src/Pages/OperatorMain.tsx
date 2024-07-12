import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
    CssBaseline,
    Box,
    ThemeProvider,
    Grid,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { sendPostRequest } from './tool/apiRequest';
import { useThemeStore, useUserStore } from './store'
import { ShowTableMessage } from 'Plugins/OperatorAPI/ShowTableMessage';
import { ShowRegulatorTableMessage } from 'Plugins/OperatorAPI/ShowRegulatorTableMessage';
import { SellerDeleteMessage } from 'Plugins/OperatorAPI/SellerDeleteMessage';
import { RegulatorDeleteMessage } from 'Plugins/OperatorAPI/RegulatorDeleteMessage';
import DeleteIcon from '@mui/icons-material/Delete';
import BackgroundImage from 'Pages/theme/BackgroungImage'
import { ShowGoodsTableMessage } from 'Plugins/OperatorAPI/ShowGoodsTableMessage'
import { ShowCommentsTableMessage } from 'Plugins/OperatorAPI/ShowCommentsTableMesage'

type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;

type UserData = {
    userName: string;
    password: string;
};

const parseDataString = (dataString: string): UserData[] => {
    return dataString.trim().split('\n').map(data => {
        const user = data.match(/"userName":"(.*?)","password":"(.*?)"/);
        return user ? { userName: user[1], password: user[2] } : { userName: '', password: '' };
    });
};

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

const parseGoodsDataStringGoods = (dataString: string): GoodsData[] => {
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
type CommentsData = {
    CommentId: number;
    SenderName: string;
    GoodsId: number;
    CommentsTime: string;
    Content: string;
};

const parseCommentsDataStringComments = (dataString: string): CommentsData[] => {
    const parsedArray = JSON.parse(dataString);
    return parsedArray.map((item: any) => ({
        CommentId: item.commentId,
        SenderName: item.senderName,
        GoodsId: item.goodsId,
        CommentsTime: item.time,
        Content: item.content,
    }));
};



export function OperatorMain() {
    const history = useHistory();
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { userName } = useUserStore();
    const [tableData, setTableData] = useState<UserData[]|GoodsData[]|CommentsData[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedObject, setSelectedObject] = useState<UserData | GoodsData | CommentsData| null>(null);
    const [selectedType, setSelectedType] = useState<'Seller' | 'Regulator'|'Goods'|'Comments'>('Seller');

    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);

    const init = async () => {
        try {
            if(selectedType==='Seller'){
                const message = new ShowTableMessage();
                const data = await sendPostRequest(message);
                setResponseTableData(data);
            }else if(selectedType==='Regulator'){
                const message = new ShowRegulatorTableMessage();
                const data = await sendPostRequest(message);
                setResponseTableData(data);
            }else if(selectedType==='Goods'){
                const message = new ShowGoodsTableMessage();
                const data = await sendPostRequest(message);
                setResponseTableData(data);
            }else if (selectedType==='Comments'){
                const message = new ShowCommentsTableMessage();
                const data = await sendPostRequest(message);
                setResponseTableData(data);
            }
        } catch (error: any) {
            setError(error.message);
            setResponseTableData('error');
        }
    };

    useEffect(() => {
        init();
    }, [selectedType]);

    useEffect(() => {
        if (typeof responseTableData === 'string') {
            if(selectedType==='Seller'||selectedType==='Regulator') {
                const parsedData = parseDataString(responseTableData);
                setTableData(parsedData);
            }else if(selectedType==='Goods'){
                const parsedData = parseGoodsDataStringGoods(responseTableData);
                setTableData(parsedData);
            }else if(selectedType==='Comments'){
                const parsedData = parseCommentsDataStringComments(responseTableData);
                setTableData(parsedData);
            }else{
                console.log('未定义的类型');
                const parsedData = parseCommentsDataStringComments('');
                setTableData(parsedData);
            }
        }
    }, [responseTableData]);

    const handleDelete = (object: UserData|GoodsData|CommentsData) => {
        setSelectedObject(object);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedObject(null);
    };

    const [deleteResponse, setDeleteResponse] = useState<string | null>(null);

    useEffect(() => {
        if (deleteResponse) {
            if (typeof deleteResponse === 'string' && deleteResponse.startsWith('Success')) {
                alert(selectedType+"删除成功");
                init();
            } else {
                alert("删除失败！");
            }
        }
    }, [deleteResponse]);

    const handleConfirmDelete = async () => {
        if (selectedObject) {
            try {
                /*const message = selectedType === 'Seller'
                    ? new SellerDeleteMessage(selectedObject?.userName)
                    : new RegulatorDeleteMessage(selectedUser?.userName);*/
                alert('删除还没写好！');
                const message=new SellerDeleteMessage('');
                const data = await sendPostRequest(message);
                setDeleteResponse(data);
            } catch (error) {
                setError(error.message);
            }
            handleClose();
        }
    };

    const handleTypeChange = (type: 'Seller' | 'Regulator'|'Goods'|'Comments') => {
        setSelectedType(type);
    };

    return (
        <BackgroundImage themeMode={themeMode}>
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent />
            <div className="content-with-appbar">
                <Box sx={{ mb: 4, textAlign: 'center', padding: 3 }}>
                    <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                        <h1>运营方主页！</h1>
                        <p>欢迎, {userName}!</p>
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        用户数据
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant={selectedType === 'Seller' ? 'contained' : 'outlined'}
                            onClick={() => handleTypeChange('Seller')}
                            sx={{ mr: 2 }}
                        >
                            Seller
                        </Button>
                        <Button
                            variant={selectedType === 'Regulator' ? 'contained' : 'outlined'}
                            onClick={() => handleTypeChange('Regulator')}
                        >
                            Regulator
                        </Button>
                        <Button
                            variant={selectedType === 'Goods' ? 'contained' : 'outlined'}
                            onClick={() => handleTypeChange('Goods')}
                        >
                            Goods
                        </Button>
                        <Button
                            variant={selectedType === 'Comments' ? 'contained' : 'outlined'}
                            onClick={() => handleTypeChange('Comments')}
                        >
                            Comments
                        </Button>
                    </Box>
                    <Grid container spacing={3} justifyContent="center">
                        {tableData.map((row, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card sx={{
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
                                    }
                                }}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            用户名: {/*row.userName*/}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            密码: {/*row.password*/}
                                        </Typography>
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
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Button
                        variant="contained"
                        onClick={() => history.push('./')}
                        sx={{
                            mt: 2,
                            backgroundColor: themeMode === 'dark' ? '#333333' : '#1976d2',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: themeMode === 'dark' ? '#555555' : '#1565c0',
                            }
                        }}
                    >
                        返回
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>确认删除</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                你确定要删除用户 {/*selectedUser?.userName*/} 吗？
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
                </Box>
            </div>
        </ThemeProvider>
        </BackgroundImage>
);
}

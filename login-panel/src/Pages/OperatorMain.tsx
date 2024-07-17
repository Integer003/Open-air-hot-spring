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
    DialogTitle
} from '@mui/material';
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { sendPostRequest } from './tool/apiRequest';
import { useThemeStore, useUserStore } from './store';
import { ShowTableMessage } from 'Plugins/OperatorAPI/ShowTableMessage';
import { ShowRegulatorTableMessage } from 'Plugins/OperatorAPI/ShowRegulatorTableMessage';
import { SellerDeleteMessage } from 'Plugins/OperatorAPI/SellerDeleteMessage';
import { RegulatorDeleteMessage } from 'Plugins/OperatorAPI/RegulatorDeleteMessage';
import DeleteIcon from '@mui/icons-material/Delete';
import BackgroundImage from 'Pages/theme/BackgroungImage';
import { ShowGoodsTableMessage } from 'Plugins/OperatorAPI/ShowGoodsTableMessage';
import { ShowCommentsTableMessage } from 'Plugins/OperatorAPI/ShowCommentsTableMessage';
import { CommentsDeleteMessage } from 'Plugins/OperatorAPI/CommentsDeleteMessage';
import { GoodsDeleteMessage } from 'Plugins/OperatorAPI/GoodsDeleteMessage';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { toNumber } from 'lodash'

type ThemeMode = 'light' | 'dark';

const drawerWidth = 240;

type SellerData = {
    userName: string;
    password: string;
    money: number;
};

const parseSellerDataString = (dataString: string): SellerData[] => {
    return dataString.trim().split('\n').map(data => {
        const user = data.match(/"userName":"(.*?)","password":"(.*?)","money":(\d+)/);
        return user ? { userName: user[1], password: user[2], money: toNumber(user[3]) } : { userName: '', password: '',money: 0 };
    });
};

type RegulatorData = {
    userName: string;
};

const parseRegulatorDataString = (dataString: string): RegulatorData[] => {
    return dataString.trim().split('\n').map(data => {
        const user = data.match(/"userName":"(.*?)"/);
        return user ? { userName: user[1]} : { userName: ''};
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
    const parsedArray = JSON.parse(dataString);
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
    CommentId: string;
    SenderName: string;
    GoodsId: string;
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

type SelectedType = 'Seller' | 'Regulator' | 'Goods' | 'Comments';

export function OperatorMain() {
    const history = useHistory();
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { userName } = useUserStore();
    const [tableData, setTableData] = useState<SellerData[]|RegulatorData[] | GoodsData[] | CommentsData[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedObject, setSelectedObject] = useState<SellerData|RegulatorData| GoodsData | CommentsData | null>(null);
    const [selectedType, setSelectedType] = useState<SelectedType>('Seller');

    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);

    const init = async () => {
        try {
            let message;
            if (selectedType === 'Seller') {
                message = new ShowTableMessage();
            } else if (selectedType === 'Regulator') {
                message = new ShowRegulatorTableMessage();
            } else if (selectedType === 'Goods') {
                message = new ShowGoodsTableMessage();
            } else if (selectedType === 'Comments') {
                message = new ShowCommentsTableMessage();
            }
            const data = await sendPostRequest(message);
            setResponseTableData(data);
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
            if (selectedType === 'Seller'  ){
                const parsedData = parseSellerDataString(responseTableData);
                setTableData(parsedData);
            } else if(selectedType==='Regulator'){
                const parsedData = parseRegulatorDataString(responseTableData);
                setTableData(parsedData);
            }
            else if (selectedType === 'Goods') {
                const parsedData = parseGoodsDataStringGoods(responseTableData);
                setTableData(parsedData);
            } else if (selectedType === 'Comments') {
                const parsedData = parseCommentsDataStringComments(responseTableData);
                setTableData(parsedData);
            }
            //alert(tableData);
        }
    }, [responseTableData]);

    const handleDelete = (object: SellerData|RegulatorData | GoodsData | CommentsData) => {
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
                alert(selectedType + "删除成功");
                init();
            } else {
                alert("删除失败！");
            }
        }
    }, [deleteResponse]);

    const handleConfirmDelete = async () => {
        if (selectedObject) {
            try {
                let message;
                if (selectedType === 'Seller') {
                    message = new SellerDeleteMessage((selectedObject as SellerData).userName);
                } else if (selectedType === 'Regulator') {
                    message = new RegulatorDeleteMessage((selectedObject as SellerData).userName);
                } else if (selectedType === 'Goods') {
                    message = new GoodsDeleteMessage((selectedObject as GoodsData).GoodsId);
                } else if (selectedType === 'Comments') {
                    message = new CommentsDeleteMessage((selectedObject as CommentsData).CommentId);
                }
                const data = await sendPostRequest(message);
                setDeleteResponse(data);
            } catch (error) {
                setError(error.message);
            }
            handleClose();
        }
    };

    const handleTypeChange = (type: SelectedType) => {
        setSelectedType(type);
    };

    return (
        <BackgroundImage themeMode={themeMode}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline />
                <AppBarComponent />
                <div className="content-with-appbar" >
                    <Box sx={{ mb: 4, textAlign: 'center', padding: 3 }}>
                        <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                            <h1>运营方主页！</h1>
                        </Typography>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            {selectedType=='Seller'&&('用户数据')}
                            {selectedType=='Regulator'&&('监管者数据')}
                            {selectedType=='Goods'&&('商品数据')}
                            {selectedType=='Comments'&&('评论数据')}
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
                                sx={{ mr: 2 }}
                            >
                                Regulator
                            </Button>
                            <Button
                                variant={selectedType === 'Goods' ? 'contained' : 'outlined'}
                                onClick={() => handleTypeChange('Goods')}
                                sx={{ mr: 2 }}
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
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {selectedType === 'Seller'  ? (
                                            <>
                                                <TableCell>用户名</TableCell>
                                                <TableCell>钱</TableCell>
                                            </>
                                        ) : selectedType === 'Regulator' ? (
                                            <>
                                                <TableCell>用户名</TableCell>
                                            </>
                                        ) :  selectedType === 'Goods' ? (
                                            <>
                                                <TableCell>商品名</TableCell>
                                                <TableCell>商品描述</TableCell>
                                                <TableCell>商品价格</TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>评论内容</TableCell>
                                                <TableCell>评论者</TableCell>
                                                <TableCell>评论商品</TableCell>
                                                <TableCell>评论时间</TableCell>
                                            </>
                                        )}
                                        <TableCell>操作</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((row, index) => (
                                        <TableRow key={index}>
                                            {selectedType === 'Seller' ? (
                                                <>
                                                    <TableCell>{(row as SellerData).userName}</TableCell>
                                                    <TableCell>{(row as SellerData).money}</TableCell>
                                                </>
                                            ): selectedType === 'Regulator' ? (
                                                <TableCell>{(row as RegulatorData).userName}</TableCell>
                                            ) : selectedType === 'Goods' ? (
                                                <>
                                                    <TableCell>{(row as GoodsData).GoodsName}</TableCell>
                                                    <TableCell>{(row as GoodsData).GoodsDescription}</TableCell>
                                                    <TableCell>{(row as GoodsData).GoodsPrice}</TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell>{(row as CommentsData).Content}</TableCell>
                                                    <TableCell>{(row as CommentsData).SenderName}</TableCell>
                                                    <TableCell>{(row as CommentsData).GoodsId}</TableCell>
                                                    <TableCell>{(row as CommentsData).CommentsTime}</TableCell>
                                                </>
                                            )}
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => handleDelete(row)}
                                                    sx={{
                                                        backgroundColor: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
                                                        color: '#ff0000',
                                                        '&:hover': {
                                                            backgroundColor: themeMode === 'dark' ? '#333333' : '#f5f5f5',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                                    你确定要删除 {selectedType === 'Seller'
                                    ? '用户 ' + (selectedObject as SellerData)?.userName
                                    : selectedType === 'Regulator'
                                     ? '监管者 ' + (selectedObject as RegulatorData)?.userName                                    : selectedType === 'Goods'
                                        ? '商品 ' + (selectedObject as GoodsData)?.GoodsName
                                        : '评论 ' + (selectedObject as CommentsData)?.CommentId
                                } 吗？
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

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

export function OperatorMain() {
    const history = useHistory();
    const { themeMode, storeThemeMode, languageType, storeLanguageType } = useThemeStore();
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { userName } = useUserStore();
    const [tableData, setTableData] = useState<UserData[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [selectedType, setSelectedType] = useState<'Seller' | 'Regulator'>('Seller');

    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);

    const init = async () => {
        try {
            const message = selectedType === 'Seller'
                ? new ShowTableMessage()
                : new ShowRegulatorTableMessage();
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
            const parsedData = parseDataString(responseTableData);
            setTableData(parsedData);
        }
    }, [responseTableData]);

    const handleDelete = (user: UserData) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const [deleteResponse, setDeleteResponse] = useState<string | null>(null);

    useEffect(() => {
        if (deleteResponse) {
            if (typeof deleteResponse === 'string' && deleteResponse.startsWith(selectedType)) {
                alert(selectedUser?.userName + " 注销成功");
                setTableData(tableData.filter(user => user !== selectedUser));
            } else {
                alert("注销失败！");
            }
        }
    }, [deleteResponse]);

    const handleConfirmDelete = async () => {
        if (selectedUser) {
            try {
                const message = selectedType === 'Seller'
                    ? new SellerDeleteMessage(selectedUser?.userName)
                    : new RegulatorDeleteMessage(selectedUser?.userName);
                const data = await sendPostRequest(message);
                setDeleteResponse(data);
            } catch (error) {
                setError(error.message);
            }
            handleClose();
        }
    };

    const handleTypeChange = (type: 'Seller' | 'Regulator') => {
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
                                            用户名: {row.userName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            密码: {row.password}
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
                                你确定要删除用户 {selectedUser?.userName} 吗？
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

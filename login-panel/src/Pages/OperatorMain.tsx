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
    DialogTitle
} from '@mui/material';
import { themes } from './theme/theme';
import AppBarComponent from './theme/AppBarComponent';
import { sendPostRequest } from './tool/apiRequest';
import { useUserStore } from './store';
import { ShowTableMessage } from 'Plugins/OperatorAPI/ShowTableMessage';
import { SellerDeleteMessage } from 'Plugins/OperatorAPI/SellerDeleteMessage'
import DeleteIcon from '@mui/icons-material/Delete';
import { SellerCancelMessage } from 'Plugins/SellerAPI/SellerCancelMessage'
import { del } from 'idb-keyval'

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
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [language, setLanguage] = useState('zh'); // 默认语言为中文
    const [responseTableData, setResponseTableData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { userName } = useUserStore();
    const [tableData, setTableData] = useState<UserData[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    useEffect(() => {
        if (userName) {
            console.log(`欢迎, ${userName}!`);
        } else {
            console.log('用户名未定义');
        }
    }, [userName]);


    const init = async () => {
        try {
            const message = new ShowTableMessage();
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

    const handleDelete = (user: UserData) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const [deleteResponse, setDeleteResponce] = useState<string | null>(null);

    useEffect(() => {
        if (deleteResponse) {
            // alert(deleteResponse);
            if (typeof deleteResponse==='string' && deleteResponse.startsWith("Seller")){
                alert(selectedUser?.userName+"注销成功");
            }else{
                alert("注销失败！");
            }
        }
    }, [deleteResponse]);


    const handleConfirmDelete =async () => {
        if (selectedUser) {
            try {
                const message = new SellerDeleteMessage(selectedUser?.userName);
                const data = await sendPostRequest(message);
                setDeleteResponce(data);
            } catch (error) {
                setError(error.message);
            }

            setTableData(tableData.filter(user => user !== selectedUser));
            handleClose();
        }
    };

    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                setLanguage={setLanguage}
            />
            <div>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{ fontSize: '2rem' }}>
                        <h1>运营方主页！</h1>
                        <p>欢迎, {userName}!</p>
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        用户数据
                    </Typography>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">用户名</TableCell>
                                <TableCell align="center">密码</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.userName}</TableCell>
                                    <TableCell align="center">{row.password}</TableCell>
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
                </Box>
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
            </div>
        </ThemeProvider>
    );
}

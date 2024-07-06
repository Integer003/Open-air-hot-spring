import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Typography,
    Button,
    Container,
    CssBaseline,
    Toolbar,
    Box,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ThemeProvider,
} from '@mui/material';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useUserStore } from '../store'
import { GoodsAddMessage } from 'Plugins/GoodsAPI/GoodsAddMessage'
import ConfirmDialog from '../tool/ConfirmDialog';

type ThemeMode = 'light' | 'dark';

export function SellerAddGoods() {
    const history = useHistory();
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
    const [goodsName, setGoodsName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [openExitDialog, setOpenExitDialog] = useState(false);
    const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
    const { userName } = useUserStore();

    const handleExit = () => {
        setOpenExitDialog(true);
    };

    const handleSubmit = () => {
        setOpenSubmitDialog(true);
    };

    const confirmExit = () => {
        setOpenExitDialog(false);
        history.push('/SellerMain');
    };

    const confirmSubmit = async () => {
        setOpenSubmitDialog(false);
        const numericPrice = parseFloat(price);
        const message = new GoodsAddMessage(goodsName, numericPrice, description, "false", userName);
        try {
            await sendPostRequest(message);
            history.push('/SellerMain');
        } catch (error) {
            console.error('Failed to add goods:', error);
        }
    };

    return (
        <ThemeProvider theme={themes[themeMode]}>
            <CssBaseline />
            <AppBarComponent themeMode={themeMode} setThemeMode={setThemeMode} setLanguage={() => {}} />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        添加商品
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="goodsName"
                            label="商品名称"
                            name="goodsName"
                            autoFocus
                            value={goodsName}
                            onChange={(e) => setGoodsName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="price"
                            label="商品价格"
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="description"
                            label="商品描述"
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleExit}
                        >
                            退出
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleSubmit}
                        >
                            提交
                        </Button>
                    </Box>
                </Box>
                <Dialog open={openExitDialog} onClose={() => setOpenExitDialog(false)}>
                    <DialogTitle>确认退出？</DialogTitle>
                    <DialogContent>
                        <DialogContentText>如果退出，信息会丢失。</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenExitDialog(false)}>取消</Button>
                        <Button onClick={confirmExit} color="primary">确认</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openSubmitDialog} onClose={() => setOpenSubmitDialog(false)}>
                    <DialogTitle>确认提交？</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setOpenSubmitDialog(false)}>取消</Button>
                        <Button onClick={confirmSubmit} color="primary">确认</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
}

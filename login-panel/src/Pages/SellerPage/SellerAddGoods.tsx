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
    Input,
} from '@mui/material';
import { themes } from '../theme/theme';
import AppBarComponent from '../theme/AppBarComponent';
import { sendPostRequest } from '../tool/apiRequest';
import { useThemeStore, useUserStore } from '../store'
import { GoodsAddMessage } from 'Plugins/GoodsAPI/GoodsAddMessage'
import BackgroundImage from 'Pages/theme/BackgroungImage'
import axios from 'axios'
import AWS from 'aws-sdk';

type ThemeMode = 'light' | 'dark';

// 配置 AWS SDK
// eslint-disable-next-line import/no-named-as-default-member
AWS.config.update({
    accessKeyId: 'LecfJHLf0PQxlbZqCN2O',
    secretAccessKey: 'vhOva5RaWe2Qcf5u7iKtTE4KGX4WCx3wfAQcjFJB',
    // region: 'us-east-1', // 你的 MinIO 服务器配置的区域，如果没有特别设置，可以是默认值
    s3ForcePathStyle: true, // 这个设置允许我们使用 MinIO 的路径风格
    signatureVersion: 'v4',
});

// 创建一个 S3 实例
const s3 = new AWS.S3({
    endpoint: 'http://127.0.0.1:9000', // 你的 MinIO 服务器地址
});

function uploadFileToMinIO(file: File): Promise<string> {
    const params = {
        Bucket: 'goods-images', // 你的存储桶名称
        Key: file.name, // 文件名
        Body: file, // 文件内容
        ACL: 'public-read', // 文件权限，根据需要设置
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
            if (err) {
                console.error('Error uploading file', err);
                reject(err);
            } else {
                console.log('File uploaded successfully', data);
                // 返回文件的 URL
                resolve(data.Location);
            }
        });
    });
}

export function SellerAddGoods() {
    const history = useHistory();
    const { themeMode } = useThemeStore();
    const [goodsName, setGoodsName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [openExitDialog, setOpenExitDialog] = useState(false);
    const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { userName } = useUserStore();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            //alert("selectedFile not null");
            setFile(selectedFile);
        }
    };

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

        if (!file) {
            console.error('No file selected for upload.');
            return;
        }

        try {
            const imageUrl = await uploadFileToMinIO(file);
            //alert(imageUrl);

            // 创建消息对象
            const message = new GoodsAddMessage(goodsName, numericPrice, description, "false", userName, 0, imageUrl);

            // 发送消息对象到后端
            await sendPostRequest(message);
            history.push('/SellerMain');
        } catch (error) {
            console.error('Failed to add goods:', error);
        }
    };



    return (
        <BackgroundImage themeMode={themeMode}>
            <ThemeProvider theme={themes[themeMode]}>
                <CssBaseline />
                <AppBarComponent historyPath={'/SellerStorage'} />
                <div className="content-with-appbar">
                    <Container component="main" maxWidth="xs" sx={{}}>
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: themeMode =='light'? 'rgba(255, 255, 255, 0.8)': 'rgba(152,160,244,0.8)',
                                p: 4,
                                borderRadius: 2
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
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    上传图片
                                    <Input
                                        type="file"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </Button>
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
                </div>
            </ThemeProvider>
        </BackgroundImage>
    );
}

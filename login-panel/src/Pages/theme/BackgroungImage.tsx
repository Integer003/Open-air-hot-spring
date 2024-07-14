import React from 'react';
import Box from '@mui/material/Box';
import light from '../../images/CoolSky.jpg';
import dark from '../../images/WitchingHour.jpg';
import ptk from '../../images/ptk.png';
import sbsq from '../../images/sbsq.png';

interface BackgroundImageProps {
    themeMode: string // 限制为 'light' 或 'dark'
    children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ themeMode, children }) => {
    // 根据themeMode选择背景图片
    const backgroundImage = themeMode === 'light' ? sbsq : ptk;

    return (
        <Box
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100vh',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed', // 背景图片固定
                overflowY: 'auto', // 确保内容可以上下滚动
                opacity: 0.8,
            }}
        >
            <Box
                sx={{
                    minHeight: '100vh', // 确保内容区域至少和视口一样高
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default BackgroundImage;

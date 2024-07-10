// BackgroundImage.tsx
import React from 'react';
import Box from '@mui/material/Box';
import light from '../../images/CoolSky.jpg';
import dark from '../../images/WitchingHour.jpg';

interface BackgroundImageProps {
    themeMode: string // 限制为 'light' 或 'dark'
    children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ themeMode, children }) => {
    // 根据themeMode选择背景图片
    const backgroundImage = themeMode === 'light' ? light : dark;

    return (
        <Box position="fixed"
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100vh', // 或者你想要的高度
                backgroundRepeat: 'no-repeat', // 确保背景图片不重复
                //zIndex: -1, /* 确保伪元素在内容之下 */
            }}
        >
            {children}
        </Box>
    );
};

export default BackgroundImage;

import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import sbsq from '../../images/sbsq.png';
import ptk from '../../images/ptk.png';
import JellySwim from '../../images/icons/JellySwim.gif';

interface BackgroundImageProps {
    themeMode: string // 限制为 'light' 或 'dark'
    children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ themeMode, children }) => {
    // 根据themeMode选择背景图片
    const backgroundImage = themeMode === 'light' ? sbsq : ptk;

    const jellyfishRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (jellyfishRef.current) {
            jellyfishRef.current.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px)`;
        }
    }, [mousePosition]);

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
                position: 'relative', // 为了定位小水母
            }}
        >
            <Box
                ref={jellyfishRef}
                component="img"
                src={JellySwim}
                alt="Jellyfish"
                sx={{
                    width: '100px',
                    height: '100px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none', // 确保鼠标事件穿透小水母
                    transition: 'transform 2s, scale 2s', // 增加平滑动画效果
                    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.2)`, // 添加 scale 变换
                }}
            />
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

// store.ts
import create from 'zustand';

type ThemeMode = 'light' | 'dark';
type LanguageType = 'zh' | 'en';

type ThemeState = {
    themeMode: ThemeMode;
    storeThemeMode: (mode: ThemeMode) => void;
    languageType: LanguageType;
    storeLanguageType: (type: LanguageType) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
    themeMode: 'dark' as ThemeMode,
    storeThemeMode: (mode) => {
        // 确保设置的主题模式是有效的
        if (mode === 'light' || mode === 'dark') {
            set({ themeMode: mode });
        }
    },
    languageType: 'zh' as LanguageType,
    storeLanguageType: (type) => {
        // 确保设置的主题模式是有效的
        if (type === 'zh' || type === 'en') {
            set({ languageType: type });
        }
    },
}));

type UserState = {
    userName: string;
    storeUserName: (name: string) => void;
    userType: string;
    storeUserType: (type: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
    userName: 'defaultUserName', // 初始用户名
    storeUserName: (name) => set({ userName: name }),
    userType: 'Seller',
    storeUserType: (type) => set({ userType: type }),
}));

type GoodsState = {
    goodsId: string;
    storeGoodsId: (id: string) => void;
    goodsName: string;
    storeGoodsName: (name: string) => void;
    goodsPrice: string;
    storeGoodsPrice: (price: string) => void;
    goodsDescription: string;
    storeGoodsDescription: (description: string) => void;
    goodsSeller: string;
    storeGoodsSeller: (seller: string) => void;
    goodsStar: string;
    storeGoodsStar: (star: string) => void;
    goodsImageUrl: string;
    storeGoodsImageUrl: (imageUrl: string) => void;
};

export const useGoodsStore = create<GoodsState>((set) => ({
    goodsId: '0',
    storeGoodsId: (id) => set({ goodsId: id }),
    goodsName: 'defaultGoodsName', // 初始用户名
    storeGoodsName: (name) => set({ goodsName: name }),
    goodsPrice: '0',
    storeGoodsPrice: (price) => set({ goodsPrice: price }),
    goodsDescription: 'This is some good goods.',
    storeGoodsDescription: (description) => set({ goodsDescription: description }),
    goodsSeller: 'defaultGoodsSeller',
    storeGoodsSeller: (seller) => set({ goodsSeller: seller }),
    goodsStar: '0',
    storeGoodsStar: (star: string) => set({ goodsStar: star }),
    goodsImageUrl: 'default/path',
    storeGoodsImageUrl: (imageUrl) => set({ goodsImageUrl: imageUrl }),
}));
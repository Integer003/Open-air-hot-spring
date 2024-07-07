// store.ts
import create from 'zustand';

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
}));
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
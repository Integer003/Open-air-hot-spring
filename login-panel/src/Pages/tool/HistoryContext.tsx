// HistoryContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

// 创建一个 Context
const HistoryContext = createContext<ReturnType<typeof useHistory> | null>(null);

// 创建一个 Provider 组件
export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const history = useHistory();
    return (
        <HistoryContext.Provider value={history}>
            {children}
        </HistoryContext.Provider>
    );
};

// 创建一个自定义钩子，用于在组件中访问 history
export const useHistoryContext = () => {
    const history = useContext(HistoryContext);
    if (!history) {
        console.log("useHistoryContext must be used within a HistoryProvider");
        throw new Error('useHistoryContext must be used within a HistoryProvider');
    }
    return history;
};

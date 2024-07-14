import React, { Component, ErrorInfo, ReactNode } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Box } from '@mui/material';

interface Props extends RouteComponentProps {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        // 更新 state 使下一次渲染显示备用 UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // 你也可以将错误日志上报给服务器
        console.error("Uncaught error:", error, errorInfo);
    }

    handleRedirect = () => {
        this.props.history.push('/');
    };

    render() {
        if (this.state.hasError) {
            // 自定义错误信息界面
            return (
                <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                    <h1>Something went wrong. 可能是token已过期，请刷新界面！</h1>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);

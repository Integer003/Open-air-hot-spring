import axios from 'axios';
import { API } from 'Plugins/CommonUtils/API';
import { useAPITokenStore } from 'Pages/store';

export const sendPostRequest = async (message: API): Promise<any> => {
    try {
        const token = useAPITokenStore.getState().token; // 获取 token
        // alert(token);
        const response = await axios.post(message.getURL(), JSON.stringify(message), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '', // 如果 token 存在，则添加到请求头中
            },
        });
        console.log('Response status:', response.status);
        console.log('Response body:', response.data);
        return response.data; // 返回响应数据
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data && error.response.data.error && (error.response.data.error.includes("Unauthorized")||error.response.data.error.includes("Invalid token"))) {
                alert('Token已过期，请重新登录！');
                window.location.hash = '/'; // 重定向到登录页面
                return error.response.data; // 返回错误响应数据
            }
            if (error.response && error.response.data) {
                console.error('Error sending request:', error.response.data);
                return error.response.data; // 返回错误响应数据
            } else {
                console.error('Error sending request:', error.message);
                throw new Error(error.message); // 抛出错误
            }
        } else {
            console.error('Unexpected error:', error);
            throw new Error('Unexpected error occurred'); // 抛出错误
        }
    }
};

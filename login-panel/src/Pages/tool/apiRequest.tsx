import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
export const sendPostRequest = async (message: API): Promise<any> => {
    try {
        const response = await axios.post(message.getURL(), JSON.stringify(message), {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response status:', response.status);
        console.log('Response body:', response.data);
        return response.data; // 返回响应数据
    } catch (error) {
        if (axios.isAxiosError(error)) {
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
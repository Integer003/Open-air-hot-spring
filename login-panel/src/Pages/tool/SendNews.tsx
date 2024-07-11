import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios'
import { API } from 'Plugins/CommonUtils/API'
import {sendPostRequest} from 'Pages/tool/apiRequest'
import { GoodsAddMessage } from 'Plugins/GoodsAPI/GoodsAddMessage'
import { AddNewsMessage } from 'Plugins/SellerAPI/AddNewsMessage'

export const SendNews = async (receiver: string, receiverType: string, newsType: string, content: string): Promise<any> => {
    alert('进入了SandNews');
    const message = new AddNewsMessage(receiver, receiverType, newsType, content);
    try {
        alert('准备发消息了！');
        await sendPostRequest(message);
    } catch (error) {
        console.error('Failed to send news:', error);
    }
}
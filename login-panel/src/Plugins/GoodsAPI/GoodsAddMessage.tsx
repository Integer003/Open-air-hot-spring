// GoodsAddMessage.tsx
import { GoodsMessage } from 'Plugins/GoodsAPI/GoodsMessage'

export class GoodsAddMessage extends GoodsMessage {
    goodsName: string;
    price: number; // 修改为 number 类型
    description: string;
    condition: string;
    sellerName: string;
    star: number;
    imageUrl: string;

    constructor(goodsName: string, price: number, description: string, condition: string, sellerName: string, star: number, imageUrl: string) {
        super();
        this.goodsName = goodsName;
        this.price = price; // 确保 price 是 number 类型
        this.description = description;
        this.condition = "false";
        this.sellerName = sellerName;
        this.star = star;
        this.imageUrl = imageUrl;
    }
}
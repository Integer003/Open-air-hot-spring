import { GoodsMessage } from 'Plugins/GoodsAPI/GoodsMessage'

export class GoodsAddMessage extends GoodsMessage {
    goodsName: string;
    price: number; // 修改为 number 类型
    description: string;
    condition: string;
    sellerName: string;
    star: number;

    constructor(goodsName: string, price: number, description: string, condition: string, sellerName: string, star: number) {
        super();
        this.goodsName = goodsName;
        this.price = price; // 确保 price 是 number 类型
        this.description = description;
        this.condition = "false";
        this.sellerName = sellerName; // test, TODO: change to the seller's name
        this.star = star;
    }
}
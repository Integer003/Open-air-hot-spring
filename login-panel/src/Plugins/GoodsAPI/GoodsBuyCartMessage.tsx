import { GoodsMessage } from 'Plugins/GoodsAPI/GoodsMessage'

export class GoodsBuyCartMessage extends GoodsMessage {
    buyerName: string;
    goodsIDList: string[];
    constructor(buyerName: string, goodsIDList: string[]) {
        super();
        this.buyerName = buyerName;
        this.goodsIDList = goodsIDList;
    }
}
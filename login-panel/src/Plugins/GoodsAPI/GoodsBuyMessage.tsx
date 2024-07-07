import { GoodsMessage } from 'Plugins/GoodsAPI/GoodsMessage'

export class GoodsBuyMessage extends GoodsMessage {
    buyerName: string;
    goodsID: string;
    constructor(buyerName: string, goodsID: string) {
        super();
        this.buyerName = buyerName;
        this.goodsID = goodsID;
    }
}
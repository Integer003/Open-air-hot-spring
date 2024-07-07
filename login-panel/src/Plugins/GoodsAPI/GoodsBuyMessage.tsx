import { GoodsMessage } from 'Plugins/GoodsAPI/GoodsMessage'

export class GoodsBuyMessage extends GoodsMessage {
    sellerName: string;
    goodsID: string;
    constructor(sellerName: string, goodsID: string) {
        super();
        this.sellerName = sellerName;
        this.goodsID = goodsID;
    }
}
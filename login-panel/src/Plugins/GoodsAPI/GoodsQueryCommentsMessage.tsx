import { GoodsMessage } from 'Plugins/GoodsAPI/GoodsMessage'

export class GoodsQueryCommentsMessage extends GoodsMessage {
    goodsID: string;
    constructor(goodsID: string) {
        super();
        this.goodsID = goodsID;
    }
}
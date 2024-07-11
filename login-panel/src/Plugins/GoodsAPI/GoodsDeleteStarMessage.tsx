import { GoodsMessage } from 'Plugins/GoodsAPI/GoodsMessage'

export class GoodsDeleteStarMessage extends GoodsMessage {
    goodsID: string;
    userName: string;
    constructor(goodsID: string, userName: string) {
        super();
        this.goodsID = goodsID;
        this.userName = userName;
    }
}
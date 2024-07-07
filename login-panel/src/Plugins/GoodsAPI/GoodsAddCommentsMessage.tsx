import { GoodsMessage } from 'Plugins/GoodsAPI/GoodsMessage'

export class GoodsAddCommentsMessage extends GoodsMessage {
    goodsID: string;
    senderName: string;
    content: string;
    constructor(goodsID: string, senderName: string, content: string) {
        super();
        this.goodsID = goodsID;
        this.senderName = senderName;
        this.content = content;
    }
}
import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class SellerCancelGoodsMessage extends SellerMessage {
    goodsID: string;
    constructor(goodsID: string) {
        super();
        this.goodsID=goodsID;
    }
}

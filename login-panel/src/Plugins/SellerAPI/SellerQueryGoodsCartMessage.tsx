import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class SellerQueryGoodsCartMessage extends SellerMessage {
    goodsID: string;
    constructor(goodsID: string) {
        super();
        this.goodsID = goodsID;
    }
}
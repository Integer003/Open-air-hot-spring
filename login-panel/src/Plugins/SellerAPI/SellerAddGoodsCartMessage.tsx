import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class SellerAddGoodsCartMessage extends SellerMessage {
    goodsID: string;
    userName: string;
    constructor(goodsID: string, userName: string) {
        super();
        this.goodsID = goodsID;
        this.userName = userName;
    }
}
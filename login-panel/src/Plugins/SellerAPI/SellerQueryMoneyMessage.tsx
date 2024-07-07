import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class SellerQueryMoneyMessage extends SellerMessage {
    sellerName: string;
    constructor(sellerName:string) {
        super();
        this.sellerName = sellerName;
    }
}
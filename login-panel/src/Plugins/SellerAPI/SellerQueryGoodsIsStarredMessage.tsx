import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class SellerQueryGoodsIsStarredMessage extends SellerMessage {
    userName: string;
    constructor(userName:string) {
        super();
        this.userName = userName;
    }
}
import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class SellerRechargeMessage extends SellerMessage {
    userName: string;
    money: number;
    constructor(sellerName: string, money:number) {
        super();
        this.userName = sellerName;
        this.money = money;
    }
}
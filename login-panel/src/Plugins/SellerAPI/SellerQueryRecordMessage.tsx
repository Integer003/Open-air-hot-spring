import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class SellerQueryRecordMessage extends SellerMessage {
    userName: string;
    constructor(userName:string) {
        super();
        this.userName = userName;
    }
}
import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class QueryNewsMessage extends SellerMessage {
    receiver: string;
    receiverType: string;
    constructor(receiver: string, receiverType: string) {
        super();
        this.receiver = receiver;
        this.receiverType = receiverType;
    }
}
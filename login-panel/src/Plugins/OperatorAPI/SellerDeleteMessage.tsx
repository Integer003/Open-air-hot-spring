import { OperatorMessage } from 'Plugins/OperatorAPI/OperatorMessage'

export class SellerDeleteMessage extends OperatorMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}
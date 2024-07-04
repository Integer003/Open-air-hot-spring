import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class SellerLoginMessage extends SellerMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}
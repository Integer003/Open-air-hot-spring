import { SellerMessage } from 'Plugins/SellerAPI/SellerMessage'

export class SellerRegisterMessage extends SellerMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}

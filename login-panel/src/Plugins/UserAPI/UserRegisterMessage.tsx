import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserRegisterMessage extends UserMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}

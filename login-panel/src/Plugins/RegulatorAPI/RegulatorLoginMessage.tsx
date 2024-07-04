import { RegulatorMessage } from 'Plugins/RegulatorAPI/RegulatorMessage'

export class RegulatorLoginMessage extends RegulatorMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}
import { OperatorMessage } from 'Plugins/OperatorAPI/OperatorMessage'

export class RegulatorDeleteMessage extends OperatorMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}